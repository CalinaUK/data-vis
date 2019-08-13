/*--------------------------------------------------------------------

   Module: piechart class implemented in Bostock's functional style
   Author: Dominic Calina

	 Adapted from Mike Chandler

   What it does:
  	Renders a pie chart using the GUP

   Dependencies
  	D3.js v4

   Version history
  	v001	19/11/2018	dc	Created.

---------------------------------------------------------------------- */

function piechart(targetDOMelement) {
	//Here we use a function declaration to imitate a 'class' definition
	//
	//Invoking the function will return an object (piechartObject)
	//    e.g. piechart_instance = piechart(target)
	//    This also has the 'side effect' of appending an svg to the target element
	//
	//The returned object has attached public and private methods (functions in JavaScript)
	//For instance calling method 'updateAndRenderData()' on the returned object
	//(e.g. piechart_instance) will render a piechart to the svg


	//Delare the main object that will be returned to caller
	var piechartObject = {};

	var department;

	//=================== PUBLIC FUNCTIONS =========================
	//
	piechartObject.overrideDataFieldFunction = function (dataFieldFunction) {
		dataField = dataFieldFunction;
		return piechartObject;
	}

	piechartObject.overrideMouseOverFunction = function (callbackFunction) {
		mouseOverFunction = callbackFunction;
		layoutAndRender();
		return piechartObject;
	}

	piechartObject.overrideMouseOutFunction = function (callbackFunction) {
		mouseOutFunction = callbackFunction;
		layoutAndRender();
		return piechartObject;
	}

	piechartObject.render = function (callbackFunction) {
		layoutAndRender();
		return piechartObject;
	}

	piechartObject.loadAndRenderPie = function (data) {
		if(data.length == 0) {

		}
		else {
			data = data[0].environment.topicsAsArray;

			//set weights less than 0.02, so that very small
			//weights are not rendered
			for (i = 0; i < data.length; i++) {
				if(data[i].weight < 0.02)
				{
					data[i].weight = 0;
				}
			}
		}
		dataset=data;
		layoutAndRender();
		return piechartObject;
	}

	//=================== PRIVATE VARIABLES ====================================
	//Width and height of svg canvas
	var svgWidth = 600;
	var svgHeight = 600;
	var dataset = [];

	//colour for the pie
	var color = d3.scaleOrdinal(d3.schemeCategory20);

	//=================== INITIALISATION CODE ====================================
	//Declare and append SVG element
	var svg = d3.select(targetDOMelement)
				.append("svg")
				.attr("width", svgWidth)
				.attr("height", svgHeight)
				.classed ("piechart",true);

	//Declare and append group that we will use tp center the piechart within the svg
	var grp = svg.append("g");

	var topicAs3wordsTip;
	var weightTip;


	//=================== PRIVATE FUNCTIONS ====================================

	var dataField = function(d){
		console.log(d.weight);
		return d.weight
		};

	var mouseOverFunction = function (d,i){
		d.data.highlight = "highlight"

		topicAs3wordsTip.style("display", null);
		weightTip.style("display", null);

		var tip1 = d.data.topicAs3words;
		var tip2 = d.data.weight;

		var xPosition = 10;
		var yPosition = 15;

		topicAs3wordsTip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
		topicAs3wordsTip.select("text").text(tip1);

		weightTip.attr("transform", "translate(" + xPosition + "," + (yPosition+20) + ")");
		weightTip.select("text").text(tip2);


	}
	var mouseOutFunction = function (d,i){
		topicAs3wordsTip.style("display", "none");
		weightTip.style("display", "none");
		d.data.highlight = "noHighlight";
	}

	//Set up shape generator
	var arcShapeGenerator = d3.arc()
		.outerRadius(svgHeight/2)
		.innerRadius(svgHeight/4)
		.padAngle(0.03)
		.cornerRadius(8);

	function layoutAndRender(){
		//Taken and addapted from https://github.com/d3/d3-shape/blob/master/README.md#pie

		//Generate the layout
		var arcsLayout = d3.pie()
			.value(dataField)
			.sort(null)
			(dataset);

		//center the group within the svg
		grp.attr("transform", "translate("+[svgWidth/2, svgHeight/2]+")")

		//Now call the GUP
		GUP_pies(arcsLayout, arcShapeGenerator);
	}

	function GUP_pies(arcsLayout, arcShapeGenerator){

		//GUP = General Update Pattern to render pies

		//GUP: BIND DATA to DOM placeholders
		var selection = grp.selectAll("path")
			.data(arcsLayout, function (d){return d.data.topicAs3words})

		//GUP: ENTER SELECTION
		var enterSel = selection
			.enter()
			.append("path")
			.classed("noHighlight", true)
			.classed("highlight", false)
			.each(function(d) { this.dPrevious = d; }); // store d for use in tweening

			//focus adapted from https://bl.ocks.org/mbostock/3902569
			//bostock example: Released under the GNU General Public License, version 3

			var focus = grp
				.append("g")
				.attr("class", "focus")
				.style("display", "none");
			topicAs3wordsTip = focus;
			focus.append("text")
				.style("text-anchor", "middle")
				.style("fill", "black")
				.style("font-size", "16px")
				.attr("font-weight", "bold");

			var focus1 = grp
				.append("g")
				.attr("class", "focus")
				.style("display", "none");
			weightTip = focus1;
			focus1.append("text")
				.style("text-anchor", "middle")
				.style("fill", "black")
				.style("font-size", "16px")
				.attr("font-weight", "bold");

		//GUP ENTER AND UPDATE selection
		var mergedSel = enterSel.merge(selection)



		mergedSel
			.filter(function(d) {return d.data.highlight=="highlight"})
				.classed("highlight", true)
				.classed("noHighlight", false);

		mergedSel
			.filter(function(d) {return d.data.highlight=="noHighlight"})
				.classed("highlight", false)
				.classed("noHighlight", true);

		mergedSel
			.attr("fill", function(d, i) { return color(i); })
			.on("mouseover", mouseOverFunction)
			.on("mouseout", mouseOutFunction);

		mergedSel
			.transition()
			.duration(750)
			.attrTween("d", arcTween); //Use custom tween to draw arcs

		//GUP EXIT selection
		selection.exit()
			.remove()
	};

	//Ignore this function unless you really want to know how interpolators work
	function arcTween(dNew) {
		//Create the linear interpolator function
		//this provides a linear interpolation of the start and end angles
		//stored 'd' (starting at the previous values in 'd' and ending at the new values in 'd')
		var interpolateAngles = d3.interpolate(this.dPrevious, dNew);
		//Now store new d for next interpoloation
		this.dPrevious = dNew;
		//Return shape (path for the arc) for time t (t goes from 0 ... 1)
		return function(t) {return arcShapeGenerator(interpolateAngles(t)) };
	}


	//================== IMPORTANT do not delete ==================================
	return piechartObject; // return the main object to the caller to create an instance of the 'class'

} //End of piechart() declaration
