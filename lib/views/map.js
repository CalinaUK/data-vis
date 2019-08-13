/*--------------------------------------------------------------------

   Module: simple map class implemented in Bostock's functional style
   Author: Dominic Calina

	 Adapted from Mike Chandler

   What it does:
  	Render a simple map

   Dependencies
  	D3.js v4

   Version history
  	v001	19/11/2018	dc	Created.

---------------------------------------------------------------------- */
"use safe"

function map(targetDOMelement) {
	//Here we use a function declaration to imitate a 'class' definition
	//
	//Invoking the function will return an object (mapObject)
	//    e.g. map_instance = map(target)
	//    This also has the 'side effect' of appending an svg to the target element
	//
	//The returned object has attached public and private methods (functions in JavaScript)
	//For instance calling method 'updateAndRenderData()' on the returned object
	//(e.g. map_instance) will render a map to the svg


	//Delare the main object that will be returned to caller
	var mapObject = {};

	//=================== PUBLIC FUNCTIONS =========================
	//
	mapObject.loadAndRenderMap = function (countries){
		topojsonCountries=countries;
		GUP_countries(mapGrp, topojsonCountries);
		return mapObject;
	}
	mapObject.loadAndRenderTowns = function (towns){
		topojsonTowns=towns;
		GUP_towns(townsGrp, topojsonTowns);
		return mapObject;
	}
	mapObject.overrideTownLongLatAccessor = function (functionRef) {
		longLatAccessor = functionRef;
		return mapObject;
	}
	mapObject.overrideTownNameAccessor = function (functionRef) {
		townNameAccessor = functionRef;
		return mapObject;
	}
	mapObject.appendClickFunction = function (fn) {
		//Instead of overriding the internal click function
		//this will append the invocation of 'fn' to the end of it
		appendClickFunction = fn;
		return mapObject; //for method chaining
	}

	//=================== PRIVATE VARIABLES ====================================
	//Width and height of svg canvas
	var width = 1000,
		height = 1200;
	var topojsonCountries, topojsonTowns;
	var targetDOM = targetDOMelement;
	var countries, towns;

	//=================== INITIALISATION CODE ====================================

	//Declare and append SVG element
	//Create SVG
	var svg = d3
		.select(targetDOMelement)
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.classed("map",true);

	var mapGrp = svg.append("g").classed("mapGroup", true);
	var townsGrp = svg.append("g").classed("townsGrp",true);

	var uniTip;

	//===================== PRIVATE FUNCTIONS =========================================

	var townNameAccessor = d => d.properties.name; //Default town name in topojson format
	var longLatAccessor = d => d.geometry.coordinates; //Default latitude, longitude is geojson
	var town_xyPosition = d => ("translate(" + projection(longLatAccessor(d)) + ")");

	//define projection of spherical coordinates to the Cartesian plane
	var projection = d3.geoAlbers()
		.center([0, 55.4])
		.rotate([4.4, 0])
		.parallels([50, 60])
		.scale(1200 * 5)
		.translate([width / 2, height / 2]);

	//Define path generator (takes projected 2D geometry and formats for SVG)
	var pathGen = d3
		.geoPath()
		.projection(projection)
		.pointRadius(2);

		var clickFunction = function (d){

			console.log("map click");
			d3.select(".doubleselected").classed("doubleselected", false)
			d3.select(".selected").classed("selected", false);
			d3.select(this).classed("selected", true);
			appendClickFunction(d);
		}
		var mouseOverFunction = function (d){

			console.log(d);
			d3.select(this).classed("highlightMap", true)

			uniTip.style("display", null);

			var tip1 = d.key;

			uniTip.attr("transform", "translate(" + "350" + "," + "200" + ")");
			uniTip.select("text").text(tip1);

		}
		var mouseOutFunction = function (d){
			d3.select(this).classed("highlightMap", false);
			uniTip.style("display", "none");
		}

	function GUP_countries(mapGrp, countries){
		//Draw the five unit outlines (ENG, IRL, NIR, SCT, WLS)

		//DATA BIND
		var selection = mapGrp
			.selectAll(".classCountry")
			.data(countries, d=>d.id); //Use ENG, IRL etc as key

		//ENTER
		var enterSel = selection
			.enter()
			.append("path")
			.attr("class", d=>("key--"+d.id))
			.classed("classCountry", true)
			.attr("d", pathGen);


		//ENTER + UPDATE
		enterSel.merge(selection)
			.on("mouseover", function(d,i){
				d3.select(this).classed("highlightMap", true)
			})
			.on("mouseout", function(d,i){
				d3.select(this).classed("highlightMap", false)
			});


		//EXIT
		selection.exit().remove();
	}


	function GUP_towns(townsGrp, towns){

		//DATA BIND
		var selection = townsGrp
			.selectAll("g.classTown")
			.data(towns, townNameAccessor);

		//ENTER
		var enterSelection = selection.enter()
			.append("g")
			.attr("class", d=>("key--"+townNameAccessor(d)))
			.classed("classTown", true)
			.on("mouseover", function(d){console.log("d=",d)})
			.attr("transform", town_xyPosition);



	 //subjectClasses(d);

		//Append circles
		enterSelection
			.append("circle")
			.transition()
			.duration(1000)
			.delay(500)
			.attr("r", 8);


		//Append labels
		//focus adapted from https://bl.ocks.org/mbostock/3902569
		//bostock example: Released under the GNU General Public License, version 3
		var focus = townsGrp
			.append("g")
			.attr("class", "focus")
			.style("display", "none");
		uniTip = focus;
		focus.append("text")
			.style("text-anchor", "middle")
			.style("fill", "black")
			.style("font-size", "22px")
			.attr("font-weight", "bold");

		//ENTER + UPDATE
		enterSelection.merge(selection)
			.on("click", clickFunction)
			.on("mouseover", mouseOverFunction)
			.on("mouseout", mouseOutFunction);

		//EXIT
		selection.exit().remove();
	}




	//================== IMPORTANT do not delete ==================================
	return mapObject; // return the main object to the caller to create an instance of the 'class'

} //End of map() declaration
