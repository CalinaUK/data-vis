/*--------------------------------------------------------------------

   Module: bubbleChart class implemented in Bostock's functional style
   Author: Dominic Calina

	 Adapted from Mike Chandler

   What it does:
  	Renders a bubble chart and its axes using the GUP

   Dependencies
  	D3.js v4

   Version history
  	v001	19/11/2018	dc	Created.


---------------------------------------------------------------------- */
"use safe"

function bubbleChart(targetDOMelement) {

	//Delare the main object that will be returned to caller
	var bubbleChartObject = {};

	//=================== PUBLIC FUNCTIONS =========================
	//
	bubbleChartObject.appendedMouseOverFunction = function (callbackFunction) {
		appendedMouseOverFunction = callbackFunction;
		return bubbleChartObject;
	}

	bubbleChartObject.appendedMouseOutFunction = function (callbackFunction) {
		appendedMouseOutFunction = callbackFunction;
		return bubbleChartObject;
	}

	bubbleChartObject.appendClick2Function = function (fn) {
		//Instead of overriding the internal click function
		//this will append the invocation of 'fn' to the end of it
		appendClick2Function = fn;
		return bubbleChartObject; //for method chaining
	}

	bubbleChartObject.appendDoubleClick2Function = function (fn) {
		//Instead of overriding the internal click function
		//this will append the invocation of 'fn' to the end of it
		appendDoubleClick2Function = fn;
		return bubbleChartObject; //for method chaining
	}

	bubbleChartObject.loadAndRenderDataset = function (data) {
		dataset=data.map(d=>d).sort((a,b)=>dataField3(b)-dataField3(a));
		console.log(dataset);
		//create local copy of references so that we can sort etc.
		render();
		return bubbleChartObject;
	}

	bubbleChartObject.overrideDataFieldFunction = function (dataFieldFunction) {
		dataField = dataFieldFunction;
		return bubbleChartObject;
	}
	bubbleChartObject.overrideDataField1Function = function (dataField1Function) {
		dataField1 = dataField1Function;
		return bubbleChartObject;
	}

  bubbleChartObject.overrideDataField2Function = function (dataField2Function) {
    dataField2 = dataField2Function;

    return bubbleChartObject;
  }
  bubbleChartObject.overrideDataField3Function = function (dataField3Function) {
    dataField3 = dataField3Function;
    return bubbleChartObject;
  }

	bubbleChartObject.overrideDataField4Function = function (dataField4Function) {
		console.log(dataField4Function);
    dataField4 = dataField4Function;
    return bubbleChartObject;
  }

	bubbleChartObject.overrideDataField5Function = function (dataField5Function) {
		dataField5 = dataField5Function;
		return bubbleChartObject;
	}


	bubbleChartObject.overrideKeyFunction = function (keyFunction) {
		//The key function is used to obtain keys for GUP rendering and
		//to provide the categories for the y-axis
		//These valuse should be unique
		GUPkeyField = yAxisCategoryFunction = keyFunction;
		return bubbleChartObject;
	}

	bubbleChartObject.overrideMouseOverFunction = function (callbackFunction) {
		mouseOverFunction = callbackFunction;
		render();
		return bubbleChartObject;
	}

	bubbleChartObject.overrideMouseOutFunction = function (callbackFunction) {
		mouseOutFunction = callbackFunction;
		render(); //Needed to update DOM
		return bubbleChartObject;
	}

	bubbleChartObject.overrideTooltipFunction = function (toolTipFunction) {

		tooltip = toolTipFunction;
		return bubbleChartObject;
	}

	bubbleChartObject.overrideMouseClickFunction = function (fn) {
		mouseClick2Function = fn;
		render(); //Needed to update DOM if they exist
		return bubbleChartObject;
	}


	bubbleChartObject.maxValueOfDataField = function (max) {
		maxValueOfDataset = max;
		maxValueOfDataField=function(){return maxValueOfDataset};
		return bubbleChartObject;
	}



	bubbleChartObject.render = function (callbackFunction) {
		render(); //Needed to update DOM
		return bubbleChartObject;
	}

	bubbleChartObject.setTransform = function (t) {
		//Set the transform on the svg
		svg.attr("transform", t)
		return bubbleChartObject;
	}

	bubbleChartObject.yAxisIndent = function (indent) {
		yAxisIndent=indent;
		return bubbleChartObject;
	}

	//=================== PRIVATE VARIABLES ====================================
	//Width and height of svg canvas
	var svgWidth = 1300;
	var svgHeight = 600;
	var dataset = [];
	var xScale = d3.scaleLinear();
	var yScale = d3.scaleLinear();
  var rScale = d3.scaleLinear();
	var yAxisIndent = 60; //Space for labels
	var xAxisIndent = 50;
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


	//Declare and add group for y axis
	var yAxis = svg
		.append("g")
		.classed("yAxis", true);

	//Declare and add group for x axis
	var xAxis = svg
		.append("g")
		.classed("xAxis", true);

	var t1,t2,t3,t4,t5;

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
	var dataField4 = function(d){return D5(d)}
	var dataField5 = function(d){return D6(d)}


	var yAxisCategoryFunction = function(d){return d.key} //Categories for y-axis


	var GUPkeyField = yAxisCategoryFunction; //For 'keyed' GUP rendering (set to y-axis category)


	//=================== OTHER PRIVATE FUNCTIONS ====================================
	var maxValueOfDataField = function(){
		//Find the maximum value of the data field for the x scaling function using a handy d3 max() method
		//This will be used to set (normally used )
		return d3.max(dataset, dataField)
	};
	var clickFunction = function (d){
		console.log(d3.select(this))

		d3.select(".selected").classed("selected", false);
		d3.select(".doubleselected").classed("doubleselected", false)
		d3.select(this).classed("selected", true);
		appendClick2Function(d);
	}
	var doubleclickFunction = function (d) {

		d3.select(".doubleselected").classed("doubleselected", false)
		d3.select(".selected").classed("selected", false);
		d3.select(this).classed("doubleselected", true);

		appendDoubleClick2Function(d);
	}
	var mouseOverFunction = function(d) {
		console.log(d);

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
				console.log(dataField2(d))
				return rScale(dataField2(d))+10;
			}

		}
		)
		t1.style("display", null);
		t2.style("display", null);
		t3.style("display", null);
		t4.style("display", null);
		t5.style("display", null);

		var rval = 7;
		var tip3 = "Staff: n/a";

		if (noScaledFTE == true){

		}
		else{
			rval = rScale(dataField2(d));
			tip3 = "Staff: " + dataField2(d);
		}

		var xPosition = xScale(dataField(d)) + yAxisIndent;
		var yPosition = yScale(dataField1(d)) - rval - 5;
		var tip1 = "%: "+ dataField(d);
		var tip2 = "WC: "+ dataField1(d);



		var tip4 = dataField4(d);
		var tip5 = dataField5(d);
		t5.attr("transform", "translate(" + xPosition + "," + (yPosition-80) + ")");
		t5.select("text").text(tip5);
		t1.attr("transform", "translate(" + xPosition + "," + (yPosition-60) + ")");
		t1.select("text").text(tip4);
		t2.attr("transform", "translate(" + xPosition + "," + (yPosition-40) + ")");
		t2.select("text").text(tip1);
		t3.attr("transform", "translate(" + xPosition + "," + (yPosition-20) + ")");
		t3.select("text").text(tip2);
		t4.attr("transform", "translate(" + xPosition + "," + (yPosition) + ")");
		t4.select("text").text(tip3);

	}


	var mouseOutFunction = function(d) {
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
		t1.style("display", "none");
		t2.style("display", "none");
		t3.style("display", "none");
		t4.style("display", "none");
		t5.style("display", "none");

	}
	var mouseClick2Function = function (d,i){
        console.log("bubbleChart click function = nothing at the moment, d=",d)
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

	var zeroRatingCheck = function (d){
		console.log(dataField(d))
		xval = -1000
		if (dataField(d) == "0"){
		}
		else {
		xval = xScale(dataField(d))+yAxisIndent;
		}
		return xval;

	}

	function updateScalesAndRenderAxes(){

    var min = d3.min(dataset, function(d) { return dataField1(d);} );

		var max = d3.max(dataset, function(d) { return dataField1(d);} );

    var max1 = d3.max(dataset, function(d) { return dataField2(d);} );

    var min1 = d3.min(dataset, function(d) { return dataField2(d);} );

		//Set scales to reflect any change in svgWidth, svgHeight or the dataset size or max value
		xScale
			.domain([0, maxValueOfDataField()])
			.range([0, svgWidth-400]);
		yScale
			.domain([0, max+1000])
			.range([0, svgHeight-100]);

    rScale
      .domain([0,max1])
      .range([3,40])

		//Now render the y-axis using the new yScale
		var yAxisGenerator = d3.axisLeft(yScale);
		svg.select(".yAxis")
			.transition().duration(1000).delay(1000)
			.attr("transform", "translate(" + yAxisIndent + "," + xAxisIndent + ")")
			.call(yAxisGenerator);

		//Now render the x-axis using the new xScale
		var xAxisGenerator = d3.axisTop(xScale);
		svg.select(".xAxis")
			.transition().duration(1000).delay(1000)
			.attr("transform", "translate(" + yAxisIndent + "," + xAxisIndent + ")")
			.call(xAxisGenerator);



		var xlabel = svg.append("text")
		    .attr("transform",
		           "translate(" + ((svgWidth /2)-(200-yAxisIndent)) + " ," +
			                           (svgHeight-580) + ")")
				.style("text-anchor", "middle")
				.style("font-size", "12px")
			  .text("% of 4* Rating");

			var ylabel = svg.append("text")
		      .attr("transform", "translate(10,300)rotate(-90)")
		      .style("text-anchor", "middle")
					.style("font-size", "16px")
		      .text("Word Count");
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
			.attr("class", d=>("key--"+((dataField4(d).replace(/ /g,'_')).replace(/,/g,"_"))))
			.classed("dot", true)

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
	      .attr("cx", function(d) {return zeroRatingCheck(d);})
	      .attr("cy", function(d) {return yScale(dataField1(d))+yAxisIndent;})
	      .style("stroke", "black")
				.style("fill", function(d) { return selectColor(dataField3(d)); });


			//focus adapted from https://bl.ocks.org/mbostock/3902569
			//bostock example: Released under the GNU General Public License, version 3
			var focus = svg
				.append("g")
				.attr("class", "focus")
				.style("display", "none");
			t1 = focus;
			focus.append("text")
				.style("text-anchor", "middle")
				.style("fill", "black")
				.style("font-size", "16px")
				.attr("font-weight", "bold");
			var focus1 = svg
				.append("g")
				.attr("class", "focus")
				.style("display", "none");
			t2 = focus1;
			focus1.append("text")
				.style("text-anchor", "middle")
				.style("fill", "black")
				.style("font-size", "14px")
				.attr("font-weight", "bold");
			var focus2 = svg
				.append("g")
				.attr("class", "focus")
				.style("display", "none");
			t3 = focus2;
			focus2.append("text")
				.style("text-anchor", "middle")
				.style("fill", "black")
				.style("font-size", "14px")
				.attr("font-weight", "bold");
			var focus3 = svg
				.append("g")
				.attr("class", "focus")
				.style("display", "none");
			t4 = focus3;

			focus3.append("text")
				.style("text-anchor", "middle")
				.style("fill", "black")
				.style("font-size", "14px")
				.attr("font-weight", "bold");

			var focus4 = svg
				.append("g")
				.attr("class", "focus")
				.style("display", "none");
			t5 = focus4;

			focus4.append("text")
				.style("text-anchor", "middle")
				.style("fill", "black")
				.style("font-size", "14px")
				.attr("font-weight", "bold");

			enterSel
				.on("mouseover", mouseOverFunction)
				.on("mouseout", mouseOutFunction)
				.on('click', clickFunction)
				.on('dblclick', doubleclickFunction)
				.on("mousemove", function(d) {

				});


		//GUP UPDATE (anything that is already on the page)
		var updateSel = selection

		updateSel.attr("class", d=>("key--"+((dataField4(d).replace(/ /g,'_')).replace(/,/g,"_"))))


		updateSel	//update bars
			.transition()
			.duration(1000)
			.delay(1000)
			.attr("cx", function(d) {return zeroRatingCheck(d);})
      .attr("cy", function(d) {return yScale(dataField1(d))+yAxisIndent;})
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
			.on('click', clickFunction)
			.on('dblclick', doubleclickFunction);


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

	return bubbleChartObject; // return the main object to the caller to create an instance of the 'class'

} //End of bubbleChart() declaration
