/*--------------------------------------------------------------------

   Module: simple circle class implemented in Bostock's functional style
   Author: Dominic Calina

	 Adapted from Mike Chandler

   What it does:
  	Render simple circles for selection

   Dependencies
  	D3.js v4

   Version history
  	v001	19/11/2018	dc	Created.

---------------------------------------------------------------------- */

function circlelist(targetDOMelement) {

  var listObject = {};

  listObject.loadAndRenderUniList = function (data) {
    dataset = data;

    render();

    return listObject;

  }
  listObject.overrideListKeyFunction = function (keyFunction) {
		GUPkeyField = yAxisCategoryFunction = keyFunction;
		return listObject;
	}

  listObject.render = function (callbackFunction) {
    render();

    return listObject;
  }
  listObject.appendMLClickFunction = function (fn) {
		//Instead of overriding the internal click function
		//this will append the invocation of 'fn' to the end of it
		appendMLClickFunction = fn;
		return listObject; //for method chaining
	}

  var svgH = 1000;
  var svgW = 400;
  var dataset = [];

  var yScale = d3.scaleBand();

  var uniText, rankText


  var svg = d3
		.select(targetDOMelement)
		.append("svg")
		.attr("width", svgW)
		.attr("height", svgH);
  var yAxisCategoryFunction = function(d) {return d.key}



  var GUPkeyField = yAxisCategoryFunction;

  var clickFunction = function (d){
    appendMLClickFunction(d);
  	}

  var mouseOverFunction = function (d){
    d3.select(this)
    .attr("r", "12");

    uniText.style("display", null);
    rankText.style("display", null);

    var yvalues =   yScale(yAxisCategoryFunction(d))+5;

    uniText.attr("transform", "translate(" + "70" + "," + yvalues + ")");
    uniText.select("text").text(d["Institution name"]);

    rankText.attr("transform", "translate(" + "70" + "," + (yvalues+20) + ")");
    rankText.select("text").text("Research Rank: " + d.ResearchRank);
  }

  var mouseOutFunction = function (d){
    d3.select(this)
    .attr("r", "8");

    uniText.style("display", "none");
    rankText.style("display", "none");

  }

  function render () {
  	uni_list();
  }

  function uni_list() {

    var selection = svg
      .selectAll(".dot")
      .data(dataset, d=>d["Institution name"]);

    var enterSel = selection //Create DOM rectangles, positioned @ x=yAxisIndent
  		.enter()
  		.append("circle")
  		.attr("class", "dot")

      yScale
        .domain(dataset.map(yAxisCategoryFunction))
        .rangeRound([20, svgH-20])
        .padding([.1]);

    var focus = svg
  		.append("g")
  		.attr("class", "focus")
  		.style("display", "none");
  	uniText = focus;



  	focus.append("text")
  		.style("fill", "black")
  		.style("font-size", "16px")
  		.attr("font-weight", "bold")

    var focus1 = svg
    	.append("g")
    	.attr("class", "focus")
    	.style("display", "none");
    rankText = focus1;

    focus1.append("text")
    	.style("fill", "black")
    	.style("font-size", "16px")
    	.attr("font-weight", "bold")


    enterSel
      .attr("r", "8")
      .attr("cx", "50")
      .attr("cy", function(d, i) {
        return yScale(yAxisCategoryFunction(d));})
      .style("stroke", "orange")
      .style("fill", "orange");

    enterSel
      .on("click", clickFunction)
      .on("mouseover", mouseOverFunction)
      .on("mouseout", mouseOutFunction);



    //can remove

    var updateSel = selection

    updateSel
      .attr("r", "8")
      .attr("cx", "50")
      .attr("cy", function(d, i) {
        return yScale(yAxisCategoryFunction(d));})

    updateSel
      .on("click", clickFunction);

    var exitSel = selection.exit()
      .remove()

  };


  return listObject;








}
