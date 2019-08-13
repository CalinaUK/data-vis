/*--------------------------------------------------------------------

   Module: circle class implemented in Bostock's functional style
   Author: Dominic Calina

   What it does:
  	Renders ordered circles representing uni departments

   Dependencies
  	D3.js v4

   Version history
  	v001	19/11/2018	dc Created

---------------------------------------------------------------------- */
"use safe"

function zeroFilter(targetDOMelement) {
	//Here we use a function declaration to imitate a 'class' definition
	//
	//Invoking the function will return an object (zeroFilterObject)
	//    e.g. barchart_instance = barchart(target)
	//    This also has the 'side effect' of appending an svg to the target element
	//
	//The returned object has attached public and private methods (functions in JavaScript)
	//For instance calling method 'updateAndRenderData()' on the returned object
	//(e.g. barchart_instance) will render a barchart to the svg


	//Delare the main object that will be returned to caller
	var zeroFilterObject = {};

	//=================== PUBLIC FUNCTIONS =========================
	//
	zeroFilterObject.appendedMouseOverFunction = function (callbackFunction) {
		console.log("appendedMouseOverFunction called", callbackFunction)
		appendedMouseOverFunction = callbackFunction;
		render();
		return zeroFilterObject;
	}

	zeroFilterObject.appendedMouseOutFunction = function (callbackFunction) {
		console.log("appendedMouseOutFunction called", callbackFunction)
		appendedMouseOutFunction = callbackFunction;
		render();
		return zeroFilterObject;
	}
	zeroFilterObject.appendClick3Function = function (fn) {
		//Instead of overriding the internal click function
		//this will append the invocation of 'fn' to the end of it
		appendClick3Function = fn;
		return zeroFilterObject; //for method chaining
	}

	zeroFilterObject.loadAndRenderD = function (data) {
		//remove map
		dataset=data
		//create local copy of references so that we can sort etc.
			render();

		return zeroFilterObject;
	}

	zeroFilterObject.overrideDFunction = function (dataFieldFunction) {
		dataField = dataFieldFunction;
		return zeroFilterObject;
	}
	zeroFilterObject.overrideD1Function = function (dataField1Function) {
		dataField1 = dataField1Function;
		return zeroFilterObject;
	}

  zeroFilterObject.overrideD2Function = function (dataField2Function) {
    dataField2 = dataField2Function;

    return zeroFilterObject;
  }
  zeroFilterObject.overrideD3Function = function (dataField3Function) {
    dataField3 = dataField3Function;
    return zeroFilterObject;
  }

	zeroFilterObject.overrideD4Function = function (dataField4Function) {
    dataField4 = dataField4Function;
    return zeroFilterObject;
  }

	zeroFilterObject.overrideD5Function = function (dataField5Function) {
		dataField5 = dataField5Function;
		return zeroFilterObject;
	}

	zeroFilterObject.overrideKFunction = function (keyFunction) {
		//The key function is used to obtain keys for GUP rendering and
		//to provide the categories for the y-axis
		//These valuse should be unique
		GUPkeyField = yAxisCategoryFunction = keyFunction;
		return zeroFilterObject;
	}

	zeroFilterObject.overrideMouseOverFunction = function (callbackFunction) {
		mouseOverFunction = callbackFunction;
		render();
		return zeroFilterObject;
	}

	zeroFilterObject.overrideMouseOutFunction = function (callbackFunction) {
		mouseOutFunction = callbackFunction;
		render(); //Needed to update DOM
		return zeroFilterObject;
	}

	zeroFilterObject.overrideTtipFunction = function (toolTipFunction) {
		tooltip = toolTipFunction;
		return zeroFilterObject;
	}

	zeroFilterObject.overrideMouseClickFunction = function (fn) {
		mouseClick2Function = fn;
		render(); //Needed to update DOM if they exist
		return zeroFilterObject;
	}

	zeroFilterObject.maxValueOfDField = function (max) {
		maxValueOfDataset = max;
		maxValueOfDField=function(){return maxValueOfDataset};
		return zeroFilterObject;
	}


	zeroFilterObject.render = function (callbackFunction) {
		render(); //Needed to update DOM
		return zeroFilterObject;
	}


	zeroFilterObject.setTransform = function (t) {
		//Set the transform on the svg
		svg.attr("transform", t)
		return zeroFilterObject;
	}

	zeroFilterObject.yAxisIndent = function (indent) {
		yAxisIndent=indent;
		return zeroFilterObject;
	}

	//=================== PRIVATE VARIABLES ====================================
	//Width and height of svg canvas
	var svgWidth = 600;
	var svgHeight = 600;
	var dataset = [];
	var yScale = d3.scaleBand();
	var xScale = d3.scaleLinear(); //This is an ordinal (categorical) scale
  var rScale = d3.scaleLinear();
	var yAxisIndent = 50; //Space for labels
	var maxValueOfDataset;	//For manual setting of bar length scaling (only used if .maxValueOfDataset() public method called)

	var color = d3.scaleOrdinal(d3.schemeCategory10);

  var selectColor;

	//=================== INITIALISATION CODE ====================================
	//Declare and append SVG element
	var svg = d3
		.select(targetDOMelement)
		.append("svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight)
		.classed("scatterplot",true);

		var tooltip1,tooltip2,tooltip3,tooltip4,tooltip5;

	//===================== ACCESSOR FUNCTIONS =========================================

	var D1 = function(d){return d.dataField} //The length of the bars
	var D2 = function(d){return d.dataField1} //The length of the bars
  var D3 = function(d){return d.dataField2}
  var D4 = function(d){return d.dataField3}
	var D5 = function(d){return d.dataField4}
	var D6 = function(d){return d.dataField5}
	var dataField = function(d){return D1(d)}
	var dataField1 = function(d){return D2(d)}
  var dataField2 = function(d){return D3(d)}
  var dataField3 = function(d){return D4(d)}
	var dataField3 = function(d){return D5(d)}
	var dataField3 = function(d){return D6(d)}
  //The length of the bars

	var yAxisCategoryFunction = function(d) {return d.key} //Categories for y-axis


	var GUPkeyField = yAxisCategoryFunction; //For 'keyed' GUP rendering (set to y-axis category)


	//=================== OTHER PRIVATE FUNCTIONS ====================================
	var maxValueOfDataField = function(){
		//Find the maximum value of the data field for the x scaling function using a handy d3 max() method
		//This will be used to set (normally used )
		return d3.max(dataset, dataField)
	};


	var appendedMouseOutFunction = function(){};

	var appendedMouseOverFunction = function(){};

	var clickFunction = function (d){
		console.log(d3.select(this))
		d3.select(".selected").classed("selected", false);
			d3.select(".doubleselected").classed("doubleselected", false)
		d3.select(this).classed("selected", true);
		appendClick3Function(d);
	}

	var mouseOverFunction = function (d){
        console.log("mouseover called")
				var noScaledFTE = false;
				d3.select(this)
				.attr("r", function(d)
	      {
	        var a = "7"
					if (isNaN(d.context.scaledFTE)){
						noScaledFTE = true;
						return a;
					}
	        else{
	          return rScale(dataField2(d)*1.5);
	        }

	      }
	      )
				tooltip1.style("display", null);
				tooltip2.style("display", null);
				tooltip3.style("display", null);
				tooltip4.style("display", null);
				tooltip5.style("display", null);

				var rval = 7;
				var tip3 = "Staff: n/a";

				if (noScaledFTE == true){

				}
				else{
					rval = rScale(dataField2(d));
					tip3 = "Staff: " + dataField2(d);
				}

				var xPosition = xScale(dataField(d))+300;
				var yPosition = svgHeight/2;
				var tip1 = "%: "+ dataField(d);
				var tip2 = "WC: "+ dataField1(d);



				var tip4 = dataField4(d);
				var tip5 = dataField5(d);
				tooltip5.attr("transform", "translate(" + xPosition + "," + (yPosition-80) + ")");
				tooltip5.select("text").text(tip5);
				tooltip1.attr("transform", "translate(" + xPosition + "," + (yPosition-60) + ")");
				tooltip1.select("text").text(tip4);
				tooltip2.attr("transform", "translate(" + xPosition + "," + (yPosition-40) + ")");
				tooltip2.select("text").text(tip1);
				tooltip3.attr("transform", "translate(" + xPosition + "," + (yPosition-20) + ")");
				tooltip3.select("text").text(tip2);
				tooltip4.attr("transform", "translate(" + xPosition + "," + (yPosition) + ")");
				tooltip4.select("text").text(tip3);

	}

	var mouseOutFunction = function (){
        console.log("mouseout called")
				d3.select(this)
				.attr("r", function(d)
	      {
	        var a = "3.5"
	        if (isNaN(d.context.scaledFTE)){
	          return a;
	        }
	        else{
	          return rScale(dataField2(d));
	        }

	      }
	      )
				tooltip1.style("display", "none");
				tooltip2.style("display", "none");
				tooltip3.style("display", "none");
				tooltip4.style("display", "none");
				tooltip5.style("display", "none");


	}



	var mouseClick2Function = function (d,i){
        console.log("barchart click function = nothing at the moment, d=",d)
	};


	function render () {
		updateScalesAndRenderAxes();
		GUP_bars();
	}

  selectColor = function (d){

    var col = "white"
    if (d == "A"){
      col = "red"
    }
    if (d == "B"){
      col = "green"
    }
    if (d == "C"){
      col = "Aqua"
    }
    if (d == "D"){
      col = "orange"
    }
    return col;
  }


	zeroRatingCheck = function (d){
		xval = -1000
		if (dataField(d) == "0"){
			xval = 50;
		}
		return xval;

	}

	function updateScalesAndRenderAxes(){

    var min = d3.min(dataset, function(d) { return dataField1(d);} );

		var max = d3.max(dataset, function(d) { return dataField1(d);} );

    var max1 = d3.max(dataset, function(d) { return dataField2(d);} );

    var min1 = d3.min(dataset, function(d) { return dataField2(d);} );

		xScale
			.domain([0, max+1000])
			.range([0, svgWidth-10]);

		yScale
			.domain(dataset.map(yAxisCategoryFunction)) //Load y-axis categories into yScale
			.rangeRound([30, svgHeight-30])
			.padding([.1]);

    rScale
      .domain([0,max1])
      .range([3,20])

		//Now render the y-axis using the new yScale
		var yAxisGenerator = d3.axisLeft(yScale);
		svg.select(".yAxis")
			.transition().duration(1000).delay(1000)
			.attr("transform", "translate(" + yAxisIndent + ",20)")
			.call(yAxisGenerator);

		//Now render the x-axis using the new xScale
		var xAxisGenerator = d3.axisTop(xScale);
		svg.select(".xAxis")
			.transition().duration(1000).delay(1000)
			.attr("transform", "translate(" + yAxisIndent + ",20)")
			.call(xAxisGenerator);
	};


	function GUP_bars(){
		//GUP = General Update Pattern to render bars

		//GUP: BIND DATA to DOM placeholders
		var selection = svg
			.selectAll(".dot")
			.data(dataset, GUPkeyField);

	   //GUP: ENTER SELECTION
		var enterSel = selection //Create DOM rectangles, positioned @ x=yAxisIndent
			.enter()
			.append("circle")
			.attr("class", "dot")

			enterSel
				.transition()
				.duration(1000)
				.delay(2000)
				.attr("r", function(d)
	      {
	        var a = "3.5"
	        if (isNaN(d.context.scaledFTE)){
	          return a;
	        }
	        else{
	          return rScale(dataField2(d));
	        }

	      }
	      )
				.attr("cx", function(d) { return zeroRatingCheck(d); })
	      .attr("cy", function(d, i) {return yScale(yAxisCategoryFunction(d));})
	      .style("stroke", "black")
				.style("fill", function(d) { return selectColor(dataField3(d)); });

				//Append labels
				//focus adapted from https://bl.ocks.org/mbostock/3902569
				//bostock example: Released under the GNU General Public License, version 3

				var focus = svg
					.append("g")
					.attr("class", "focus")
					.style("display", "none");
				tooltip1 = focus;
				focus.append("text")
					.style("text-anchor", "middle")
					.style("fill", "black")
					.style("font-size", "16px")
					.attr("font-weight", "bold");
				var focus1 = svg
					.append("g")
					.attr("class", "focus")
					.style("display", "none");
				tooltip2 = focus1;
				focus1.append("text")
					.style("text-anchor", "middle")
					.style("fill", "black")
					.style("font-size", "14px")
					.attr("font-weight", "bold");
				var focus2 = svg
					.append("g")
					.attr("class", "focus")
					.style("display", "none");
				tooltip3 = focus2;
				focus2.append("text")
					.style("text-anchor", "middle")
					.style("fill", "black")
					.style("font-size", "14px")
					.attr("font-weight", "bold");
				var focus3 = svg
					.append("g")
					.attr("class", "focus")
					.style("display", "none");
				tooltip4 = focus3;

				focus3.append("text")
					.style("text-anchor", "middle")
					.style("fill", "black")
					.style("font-size", "14px")
					.attr("font-weight", "bold");

				var focus4 = svg
					.append("g")
					.attr("class", "focus")
					.style("display", "none");
				tooltip5 = focus4;

				focus4.append("text")
					.style("text-anchor", "middle")
					.style("fill", "black")
					.style("font-size", "14px")
					.attr("font-weight", "bold");

			//you need to split up enterSel as you need to select dot rather than
			//transition. You call transition on enterSel and display the dots.
			//Then you mouseover on the dots
			enterSel
				.on("mouseover",  mouseOverFunction)
				.on("mouseout", mouseOutFunction)
				.on("click", clickFunction);




		//GUP UPDATE (anything that is already on the page)
		var updateSel = selection


		updateSel	//update bars
			.transition()
			.duration(1000)
			.delay(1000)
			.attr("cx", function(d) { return zeroRatingCheck(d); })
			.attr("cy", function(d, i) {return yScale(yAxisCategoryFunction(d));})
			.attr("r", function(d)
      {
        var a = "3.5"
        if (isNaN(d.context.scaledFTE)){
          return a;
        }
        else{
          return rScale(dataField2(d));
        }

      }
		);
		updateSel
			.on("mouseover",  mouseOverFunction)
			.on("mouseout", mouseOutFunction)
			.on("click", clickFunction);


			 //Add tooltip
			 //updateSel
			  //.select("title")
				//.text(tooltip)






		//GUP EXIT selection
		var exitSel = selection.exit()
			.classed("highlight updateSelection enterSelection", false)
			.classed("exitSelection", true)
			.transition()
			.duration(1000)
				.attr("cx", 0)
				.attr("cy", 0)
				.attr("r", 0)
				.remove()
	};


	//================== IMPORTANT do not delete ==================================
	return zeroFilterObject; // return the main object to the caller to create an instance of the 'class'

} //End of barchart() declaration
