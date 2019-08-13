/*--------------------------------------------------------------------

   Module: pack class implemented in Bostock's functional style
   Author: Dominic Calina

	 Adapted from Mike Chandler

   What it does:
  	Renders a pack hierarchy using the GUP


   Dependencies
  	D3.js v4

   Version history
  	v001	19/11/2018	dc	Created.

---------------------------------------------------------------------- */
var hierarchyGraph; //The graph of objects used to represent the hierachy

function pack(targetDOMelement) {
	//Here we use a function declaration to imitate a 'class' definition
	//
	//Invoking the function will return an object (packObject)
	//    e.g. tree_instance = pack(target)
	//    This also has the 'side effect' of appending an svg to the target element
	//
	//The returned object has attached public and private methods (functions in JavaScript)
	//For instance calling method 'updateAndRenderData()' on the returned object
	//(e.g. tree_instance) will render a pack to the svg


	//Delare the main object that will be returned to caller
	var packObject = {};

	//=================== PUBLIC FUNCTIONS =========================
	//


	packObject.loadAndRenderNestDataset = function (nestFormatHierarchy, rootName) {
		//Loads and renders (format 2) hierarchy in "nest" or "key-values" format.
		layoutAndRenderHierarchyInNestFormat(nestFormatHierarchy, rootName)
		return packObject; //for method chaining
	}


	packObject.nodeLabelIfNoKey = function (fn) {
		//Leaf nodes from d3.nest typically have no 'key' property
		//By default the d3.nest 'key' property is used as the node text label
		//If this does not exist the nodeLabelIfNoKey() function will be called to
		// provide the label
		nodeLabelIfNoKey = fn;
		return packObject; //for method chaining
	}
	packObject.appendClick1Function = function (fn) {
		//Instead of overriding the internal click function
		//this will append the invocation of 'fn' to the end of it
		appendClick1Function = fn;
		return packObject; //for method chaining
	}

	packObject.appendDoubleClick1Function = function (fn) {
		appendDoubleClick1Function = fn;
		return packObject;
	}


	//=================== PRIVATE VARIABLES ====================================

	//Declare and append SVG element
	var margin = {top: 0, right: 50, bottom: 50, left: 50},
	width = 700 - margin.right - margin.left,
	height = 700 - margin.top - margin.bottom;

	//Set up SVG and append group to act as container for pack graph
	var grp = d3.select(targetDOMelement).append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var nodesGroup = grp
		.append("g")
		.classed("nodesGroup", true);

	var tool_tips;
	var list_Of_Nodes;

	//=================== PRIVATE FUNCTIONS ====================================

	var nodeLabelIfNoKey = function(){return "No name set"};

	var clickFunction = function (d){
		console.log("node clicked, d = ",d);
		appendClick1Function(d);
	}
	var clickColorFunction = function (d){
		d3.select(".selected").classed("selected", false);
		d3.select(".doubleselected").classed("doubleselected", false);
		d3.select(this).select("circle").classed("selected", true);
	}
	var doubleclickColorFunction = function (d){
		d3.select(".selected").classed("selected", false);
		d3.select(".doubleselected").classed("doubleselected", false);
		d3.select(this).select("circle").classed("doubleselected", true);
	}
	var doubleclickFunction = function (d){
		console.log("node double clicked, d = ",d);
		appendDoubleClick1Function(d);
	}
	var mouseOverFunction = function (d){
		console.log("mouseover called")
		d3.select(this)
			.select("circle")
			.style("opacity", "1.0");

		if(d.height == "0") {
			tool_tips.style("display", null);
			console.log(d);
			var rValue = d.r;
			//inverse
			middleWidth = (width/2)+ margin.left;
			middleHeight = (height/2)+ margin.top;
			var yPosition = d.x-rValue;
			var xPosition = d.y;

			if (xPosition > (middleWidth)) {
				console.log("enter");
				tool_tips.style("text-anchor", "end")
			}
			else {
				tool_tips.style("text-anchor", "start")
			}
			tool_tips.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
			tool_tips.select("text").text(d.data.key);
		}

	}
	var mouseOutFunction = function (){
				console.log("mouseout called")
				d3.select(this)
					.select("circle")
					.style("opacity", "0.7");

				tool_tips.style("display", "none");

	}
	function clickcancel() {
	//http://bl.ocks.org/ropeladder/83915942ac42f17c087a82001418f2ee
  //distinguish single/double click
	//Released under the The MIT License.
  var dispatcher = d3.dispatch('click', 'dblclick');
  function cc(selection) {
      var down, tolerance = 5, last, wait = null, args;
      // euclidean distance
      function dist(a, b) {
          return Math.sqrt(Math.pow(a[0] - b[0], 2), Math.pow(a[1] - b[1], 2));
      }
      selection.on('mousedown', function() {
          down = d3.mouse(document.body);
          last = +new Date();
          args = arguments;
      });
      selection.on('mouseup', function() {
          if (dist(down, d3.mouse(document.body)) > tolerance) {
              return;
          } else {
              if (wait) {
                  window.clearTimeout(wait);
                  wait = null;
                  dispatcher.apply("dblclick", this, args);
              } else {
                  wait = window.setTimeout((function() {
                      return function() {
                          dispatcher.apply("click", this, args);
                          wait = null;
                      };
                  })(), 500);
              }
          }
      });
  };
  // Copies a variable number of methods from source to target.
  var d3rebind = function(target, source) {
    var i = 1, n = arguments.length, method;
    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
    return target;
  };

  // Method is assumed to be a standard D3 getter-setter:
  // If passed with no arguments, gets the value.
  // If passed with arguments, sets the value and returns the target.
  function d3_rebind(target, source, method) {
    return function() {
      var value = method.apply(source, arguments);
      return value === source ? target : value;
    };
  }
  return d3rebind(cc, dispatcher, 'on');
}


	var nodeLabel = function(d) {return d.data.name + "(height:"+d.height+")";}

	function layoutAndRenderHierarchyInNestFormat (nestFormatHierarchy, rootName){
	//Lays out and renders (format 2) hierarchy in "nest" ("key-values" format).

		//Move the 'nest' array into a root node:
		var datasetAsJsonD3Hierarchy = {"key":rootName, "values": nestFormatHierarchy}

		//Now create hierarchy structure
		//Note that we need to add the "children" accessor "d=>d.values" in order
		//to tell d3.hierarchy to use nest's 'values' as children
		hierarchyGraph = d3
			.hierarchy(datasetAsJsonD3Hierarchy, d=>d.values)
			.sum(function(d){ return d.value})
			.sort(function(a, b) { return b.value - a.value; });

		//And we'll use the nest 'keys' as the node labels
		nodeLabel = function(d) {
			if (d.data.key) return d.data.key + "(value " + d.value+")";
			else return nodeLabelIfNoKey(d);
		}

		//Can now calculate XY data and render
		calculateXYpositionsAndRender(hierarchyGraph);
	}


	function calculateXYpositionsAndRender(hierarchyGraph, clickedNode){
		//Note that the 'clickedNode' is the clicked node in a collapse or
		//uncollapse animation
		//For a colapse, we want all children of the clicked node converge upon the
		//the clicked node's final position (in the current GUP animation) and then exit.

		//get and setup the pack layout generator
		var myTreeLayoutGenerator = d3.pack().size([height, height]);

		//Add the newly calculated x and y properies to each node
		//in the hierarcy graph.
		var hierarchyGraphWithPositions = myTreeLayoutGenerator(hierarchyGraph);

		//Get lists of nodes
		var listOfNodes = hierarchyGraphWithPositions.descendants();
		list_Of_Nodes = listOfNodes;

		console.log("listOfNodes = ", listOfNodes)

		//Render links and nodes
		GUPrenderNodes(listOfNodes);

	}


	function GUPrenderNodes(listOfNodes, clickedNode){

		//DATA BIND
		var selection = nodesGroup
			.selectAll("g.cssClassNode") //select groups with class = "cssClassNode"
			.data(listOfNodes);

		//ENTmiddle

		var enterSelection = selection
			.enter()
			.append("g")
			.attr("class", d=>("key--"+ ((d.data.key).replace(/ /g,'_')).replace(/,/g,"_")))
			.classed("cssClassNode enterSelection", true)

		//focus adapted from https://bl.ocks.org/mbostock/3902569
		//bostock example: Released under the GNU General Public License, version 3

		var focus = nodesGroup
			.append("g")
			.attr("class", "focus")
			.style("display", "none");
			tool_tips = focus;

		focus.append("text")
			.style("fill", "black")
			.style("font-size", "16px")
			.attr("font-weight", "bold")


		enterSelection
		.append("circle")
		.attr("r", function(d) {console.log("d=",d); return d.r} );

		enterSelection
			.attr("transform", function(d) {
				return "translate(" + d.y + "," + d.x + ")";
			})

		enterSelection
				.classed("leafNode", d => d.height == 0)
				.classed("rootNode", d => d.depth == 0)
				.classed("intermediateNodeA", d => (d.data.key=="A"))
				.classed("intermediateNodeB", d => (d.data.key=="B"))
				.classed("intermediateNodeC", d => (d.data.key=="C"))
				.classed("intermediateNodeD", d => (d.data.key=="D"))

		enterSelection
				.on("mouseover",  mouseOverFunction)
				.on("mouseout", mouseOutFunction)
				.on('click', clickColorFunction)
				.on('dblclick', doubleclickColorFunction);


		//http://bl.ocks.org/ropeladder/83915942ac42f17c087a82001418f2ee
		 //distinguish single/double click
		//Released under the The MIT License.
		var cc = clickcancel();
		nodesGroup
			.selectAll("g.cssClassNode").call(cc);
		cc.on('click', clickFunction);
		cc.on('dblclick', doubleclickFunction);

		//ENTER + UPDATE
		var updateSelection = selection


		updateSelection.select("circle")
		.attr("r", function(d) {console.log("d=",d); return d.r} );

		updateSelection
			.attr("transform", function(d) {
				return "translate(" + d.y + "," + d.x + ")";
			})
		updateSelection
			.classed("leafNode", d => d.height == 0)
			.classed("rootNode", d => d.depth == 0)
			.classed("intermediateNodeA", d => (d.data.key=="A"))
			.classed("intermediateNodeB", d => (d.data.key=="B"))
			.classed("intermediateNodeC", d => (d.data.key=="C"))
			.classed("intermediateNodeD", d => (d.data.key=="D"))

		updateSelection
			.on("mouseover",  mouseOverFunction)
			.on("mouseout", mouseOutFunction)
			.on('click', clickColorFunction)
			.on('dblclick', doubleclickColorFunction);

		// EXIT
		var exitSel = selection.exit()
			.classed("enterSelection updateSelection", false)
			.classed("exitSelection", true)
			.remove();
	}

	return packObject; // return the main object to the caller to create an instance of the 'class'

} //End of pack() declaration
