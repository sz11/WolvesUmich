//This code is for showing the individual reports


//This is where we declare the variables we will use throughout the program

var roster;
var table = [];
var zones = [];

var player;
var pressure;

var titletext;


var shotsMadeArray = [];
var shotsMissedArray = [];
var passMadeArray = [];
var passMissedArray = [];
var advantagePassArray = [];
var assistArray = [];
var turnoverArray = [];
var ftMade;
var ftMissed;

var shotsAttemptedArray = [];

var shotsMade3pt = 0;
var shotsMade2pt = 0;
var shotsAttempted3pt = 0;
var shotsAttempted2pt = 0;

var accuracy2pt;
var accuracy3pt;
var accuracyFT;

var shotAccuracyArray = [];
var totalShotAttempts;
var shotFrequencyArray = [];
var shotFrequencyAdjustedArray = [];


var passMadeTotalArray = [];
var passAttemptedArray = [];

var passAccuracyArray = [];
var totalPassAttempts;
var passFrequencyArray = [];
var passFrequencyAdjustedArray = [];

var totalActionsArray = [];
var totalTurnovers;
var turnoverPercentArray = [];
var turnoverFrequencyArray = [];
var turnoverFrequencyAdjustedArray = [];

var totalShotsMade;
var totalShotsMissed;
var totalPassMade;
var totalPassMissed;
var totalAdvantagePass;
var totalAssist;

//This block of code loads the roster data and adjusts the dropdown menu

function setup() {
}

window.onload = function initialize() {
	roster = JSON.parse(fs.readFileSync("data/roster.JSON", 'utf8'));

	for (var i = 0; i < roster.length; i++) {
		var selectedplayer = document.createElement("a");
		selectedplayer.setAttribute("onclick", "choosePlayer('" + roster[i] + "')");
		selectedplayer.innerHTML = capitalizeName(roster[i]);
		var dropdown = document.getElementById("myDropdown");
		dropdown.appendChild(selectedplayer);
	}
}

function myFunction() {
	document.getElementById("myDropdown").classList.toggle("show");
}

function myFunction2() {
	document.getElementById("pressureDropdown").classList.toggle("show");
}

//This block is for selectin the player and pressure level and viewing the player report

function choosePlayer(choice) {

	player = choice;
	console.log(player);
	myFunction();

	var playerselection = document.getElementById("playerselection");
	playerselection.innerHTML = capitalizeName(player);
}

function choosePressure(choice) {
	pressure = choice;
	console.log(pressure);
	myFunction2();

	var pressureselection = document.getElementById("pressureselection");
	pressureselection.innerHTML = pressure;
}

function viewReport() {
	document.getElementById("initialpage").style.display = "none";
	document.getElementById("viewplayerlist").style.display = "inline";

	titletext = document.getElementById("titletext");

	table = JSON.parse(fs.readFileSync("data/" + player + ".JSON", 'utf8'));

	performCalculations();

	pieChart();

	if (totalShotAttempts != 0 || totalPassAttempts != 0 || totalTurnovers != 0) {
		heatMap();
		displayAccuracies();
	}

	if (totalShotAttempts == 0 && totalPassAttempts == 0 && totalTurnovers == 0) {
		var nodata = document.createElement("h2");
		nodata.setAttribute("id","nodata");
		nodata.innerHTML = "No Data for " + capitalizeName(player) + " - " + pressure;
		titletext.appendChild(nodata);
	}
}

//This block is for returning to the player list after viewing a report

function viewPlayerList() {
	$("#piechart1").remove();
	$("#piechart2").remove();
	$("#label").remove();
	$("#nodata").remove();
	$("#3ptefg").remove();
	$("#2ptefg").remove();
	$("#ftperc").remove();
	$("#tooltip").remove();
	$("#tooltip2").remove();

	document.getElementById("initialpage").style.display = "inline";
	document.getElementById("viewplayerlist").style.display = "none";
	document.getElementById("pressureselection").innerHTML = "";
	document.getElementById("playerselection").innerHTML = "";
	
	player = null;
	pressure = null;

	d3.select("#piechart1div")
		.attr("display","none")
		.attr("width",null)
		.attr("height",null)
		.attr("position",null);

	d3.select("#piechart2div")
		.attr("display","none")
		.attr("width",null)
		.attr("height",null)
		.attr("position",null);

	for(var i = 0; i < 26; i++) {
		d3.select("#shotzone" + zoneNames[i] + "")
			.attr("transform", null)
			.attr("fill", null);

		d3.select("#passzone" + zoneNames[i] + "")
			.attr("transform", null)
			.attr("fill", null);

		d3.select("#tovzone" + zoneNames[i] + "")
			.attr("transform", null)
			.attr("fill", null);
	}

	d3.select("#shotheatmap")
		.attr("transform",null)
		.attr("display","none");

	d3.select("#shotcolor")
		.attr("display","none");

	d3.select("#passheatmap")
		.attr("transform",null)
		.attr("display","none");

	d3.select("#passcolor")
		.attr("display","none");

	d3.select("#tovheatmap")
		.attr("transform",null)
		.attr("display","none");

	d3.select("#tovcolor")
		.attr("display","none");
}

//This block performs the calculations and displays the accuracies

function performCalculations() {
	switch(pressure) {
		case "Drill":
			shotsMadeArray = table[1].slice(1,27);
			shotsMissedArray = table[2].slice(1,27);
			ftMade = table[1][27];
			ftMissed = table[2][27];
			break;
		case "Scrimmage":
			shotsMadeArray = table[3].slice(1,27);
			shotsMissedArray = table[4].slice(1,27);
			passMadeArray = table[5].slice(1,27);
			passMissedArray = table[6].slice(1,27);
			advantagePassArray = table[7].slice(1,27);
			assistArray = table[8].slice(1,27);
			turnoverArray = table[9].slice(1,27);
			ftMade = table[3][27];
			ftMissed = table[4][27];
			break;
		case "Game":
			shotsMadeArray = table[10].slice(1,27);
			shotsMissedArray = table[11].slice(1,27);
			passMadeArray = table[12].slice(1,27);
			passMissedArray = table[13].slice(1,27);
			advantagePassArray = table[14].slice(1,27);
			assistArray = table[15].slice(1,27);
			turnoverArray = table[16].slice(1,27);
			ftMade = table[10][27];
			ftMissed = table[11][27];
			break;
	}

	for (var i = 0; i < 26; i++) {
		shotsAttemptedArray[i] = shotsMadeArray[i] + shotsMissedArray[i];
	}

	totalShotAttempts = getSum(0, shotsAttemptedArray);
	
	for (var i = 0; i < 26; i++) {
		shotAccuracyArray[i] = Math.round(100*shotsMadeArray[i]/shotsAttemptedArray[i]);
		shotFrequencyArray[i] = Math.round(1000*shotsAttemptedArray[i]/totalShotAttempts)/1000;
	}

	for (var i = 0; i < 4; i++) {
		shotAccuracyArray[i] = Math.round(1.5*shotAccuracyArray[i]);
		shotAccuracyArray[i+13] = Math.round(1.5*shotAccuracyArray[i+13]);
	}

	for (var i = 0; i < 26; i++) {
		if (shotFrequencyArray[i] === 0) {
			shotFrequencyAdjustedArray[i] = 0;
		}
		else {
			shotFrequencyAdjustedArray[i] = Math.round(100*map(shotFrequencyArray[i],min(shotFrequencyArray),max(shotFrequencyArray),.30,.99))/100;
		}
	}
   

	shotsMade3pt = getSum(0, shotsMadeArray.slice(0,4)) + getSum(0, shotsMadeArray.slice(13,17));
	shotsMade2pt = getSum(0, shotsMadeArray.slice(4,13)) + getSum(0, shotsMadeArray.slice(17,26));
	shotsAttempted3pt = getSum(0, shotsAttemptedArray.slice(0,4)) + getSum(0, shotsAttemptedArray.slice(13,17));
	shotsAttempted2pt = getSum(0, shotsAttemptedArray.slice(4,13)) + getSum(0, shotsAttemptedArray.slice(17,26));

	if (shotsAttempted3pt === 0) {
		accuracy3pt = "n/a";
	}
	else {
		accuracy3pt = Math.round(100*1.5*shotsMade3pt/shotsAttempted3pt) + " %";
	}

	if (shotsAttempted2pt === 0) {
		accuracy3pt = "n/a"
	}
	else {
		accuracy2pt = Math.round(100*shotsMade2pt/shotsAttempted2pt) + " %";
	}

	if ((ftMade + ftMissed) === 0) {
		accuracyFT = "n/a";
	}
	else {
		accuracyFT = Math.round(100*ftMade/(ftMade + ftMissed)) + " %";
	}

	if (pressure !== "Drill") {
		for (var i = 0; i < 26; i++) {
			passMadeTotalArray[i] = passMadeArray[i] + advantagePassArray[i] + assistArray[i];
			passAttemptedArray[i] = passMadeTotalArray[i] + passMissedArray[i];
			totalActionsArray[i] = shotsAttemptedArray[i] + passAttemptedArray[i] + turnoverArray[i];
		}
		
		totalPassAttempts = getSum(0, passAttemptedArray);
		totalTurnovers = getSum(0, turnoverArray);

		
		for (var i = 0; i < 26; i++) {
			passAccuracyArray[i] = Math.round(100*passMadeTotalArray[i]/passAttemptedArray[i]);
			passFrequencyArray[i] = Math.round(1000*passAttemptedArray[i]/totalPassAttempts);
			turnoverPercentArray[i] = Math.round(100*turnoverArray[i]/totalActionsArray[i]);
			turnoverFrequencyArray[i] = Math.round(1000*turnoverArray[i]/totalTurnovers);
		}

		for (var i = 0; i < 26; i++) {
			if (passFrequencyArray[i] === 0) {
				passFrequencyAdjustedArray[i] = 0;
			}
			else {
				passFrequencyAdjustedArray[i] = Math.round(100*map(passFrequencyArray[i],min(passFrequencyArray),max(passFrequencyArray),.30,.99))/100;
			}
			if (turnoverFrequencyArray[i] === 0) {
				turnoverFrequencyAdjustedArray[i] = 0;
			}
			else {
				turnoverFrequencyAdjustedArray[i] = Math.round(100*map(turnoverFrequencyArray[i],min(turnoverFrequencyArray),max(turnoverFrequencyArray),.30,.99))/100;
			}
		}

		totalShotsMade = shotsMade3pt + shotsMade2pt;
		totalShotsMissed = (shotsAttempted3pt - shotsMade3pt) + (shotsAttempted2pt - shotsMade2pt);
		totalPassMade = getSum(0, passMadeArray);
		totalPassMissed = getSum(0, passMissedArray);
		totalAdvantagePass = getSum(0, advantagePassArray);
		totalAssist = getSum(0, assistArray);
	}
}

function getSum(startingindex, array) {
	var total = 0;
	if (typeof array == 'object') {
		for (var i = startingindex; i < array.length; i++) {
			total += array[i];
		}
	}
	return total;
}


function displayAccuracies() {

    var displayplayerpressure = document.createElement("h3");
    displayplayerpressure.setAttribute("id", "label");
    titletext.appendChild(displayplayerpressure);
    displayplayerpressure.innerHTML = capitalizeName(player) + " - " + pressure;

    var display3ptaccuracy = document.createElement("p");
    display3ptaccuracy.setAttribute("id", "3ptefg");
    display3ptaccuracy.innerHTML = "3pt eFG: " + accuracy3pt;
    titletext.appendChild(display3ptaccuracy);

    var display2ptaccuracy = document.createElement("p");
    display2ptaccuracy.setAttribute("id", "2ptefg");
    display2ptaccuracy.innerHTML = "2pt eFG: " + accuracy2pt;
    titletext.appendChild(display2ptaccuracy);


    var freethrowacc = document.createElement("p");
    freethrowacc.setAttribute("id", "ftperc");
    freethrowacc.innerHTML = "FT Accuracy: " + accuracyFT;
    titletext.appendChild(freethrowacc);
}

//This block creates the pie charts and the heat maps

function pieChart() {
	if (pressure != "Drill" && (totalShotAttempts != 0 || totalTurnovers != 0 || totalPassAttempts != 0)) {

		d3.select("#piechart1div")
			.attr("width","500px")
			.attr("height","500px")
			.attr("position","relative");

		d3.select("#piechart2div")
			.attr("width","500px")
			.attr("height","500px")
			.attr("position","relative");

		var w = 800;
		var h = 500;

		var dataset = [{value: totalShotAttempts, label: "Shots"}, {value: totalPassAttempts, label: "Passes"}, {value: totalTurnovers, label: "Turnovers"}];
		var dataset2 = [{value: totalShotsMade, label: "Shots Made"}, {value: totalShotsMissed, label: "Shots Missed"}, {value: totalAssist, label: "Assists"}, {value: totalAdvantagePass, label: "Advantage Passes"}, {value: totalPassMade, label: "Passes Made"}, {value: totalPassMissed, label: "Passes Missed"}, {value: totalTurnovers, label: "Turnovers"}];

		var outerRadius = h / 3;
		var innerRadius = 65;

		var arc = d3.arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius);

		var pie = d3.pie()
		.value(function(d) {
			return d.value;
		})
		.sort(null);

		var color =  d3.scaleOrdinal(["rgb(31, 119, 180)", "rgb(255, 127, 14)", "rgb(44, 160, 44)"]);
		var color2 = d3.scaleOrdinal([ "rgb(31, 119, 180)", "rgb(158, 202, 225)", "rgb(230, 85, 13)", "rgb(253, 141, 60)", "rgb(253, 174, 107)", "rgb(253, 208, 162)", "rgb(49, 163, 84)"]);


	    //Create SVG element
	    var svg = d3.select("#piechart1div")
	    .append("svg")
	    .attr("width", w)
	    .attr("height", h)
	    .attr("id", "piechart1");

	    var svg2 = d3.select("#piechart2div")
	    .append("svg")
	    .attr("width", w)
	    .attr("height", h)
	    .attr("id", "piechart2");

	    //Set up groups
	    var arcs = svg.selectAll("g.arc")
	    .data(pie(dataset))
	    .enter()
	    .append("g")
	    .attr("class", "arc")
	    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

	    var arcs2 = svg2.selectAll("g.arc")
	    .data(pie(dataset2))
	    .enter()
	    .append("g")
	    .attr("class", "arc")
	    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

	    //Draw arc paths
	    
	    arcs.append("path")
	    .attr("fill", function(d, i) {
	    	return color(i);
	    })
	    .attr("d", arc);

	    arcs2.append("path")
	    .attr("fill", function(d, i) {
	    	return color2(i);
	    })
	    .attr("d", arc);

	    //Labels
	    arcs.append("text")
	    .attr("transform", function(d) {
	    	return "translate(" + arc.centroid(d) + ")";
	    })
	    .attr("text-anchor", "middle")
	    .text(function(d) {
	    	if (d.value == 0) {
	    		return "";
	    	}
	    	else {
	    		return d.value;
	    	}
	    });

	    arcs2.append("text")
	    .attr("transform", function(d) {
	    	return "translate(" + arc.centroid(d) + ")";
	    })
	    .attr("text-anchor", "middle")
	    .text(function(d) {
	    	if (d.value == 0) {
	    		return "";
	    	}
	    	else {
	    		return d.value;
	    	}
	    });

	    var ordinal = d3.scaleOrdinal()
	    .domain(["Shots", "Passes", "Turnovers"])
	    .range([ "rgb(31, 119, 180)", "rgb(255, 127, 14)", "rgb(44, 160, 44)"]);

	    var svg = d3.select("svg");

	    svg.append("g")
	    .attr("class", "legendOrdinal")
	    .attr("transform", "translate(400,20)");

	    var legendOrdinal = d3.legendColor()
	    .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
	    .shapePadding(10)
	    .scale(ordinal);

	    svg.select(".legendOrdinal")
	    .call(legendOrdinal);

	    
	    var ordinal2 = d3.scaleOrdinal()
	    .domain(["Shots Made", "Shots Missed", "Assists", "Advantage Passes", "Passes Made", "Passes Missed", "Turnovers"])
	    .range([ "rgb(31, 119, 180)", "rgb(158, 202, 225)", "rgb(230, 85, 13)", "rgb(253, 141, 60)", "rgb(253, 174, 107)", "rgb(253, 208, 162)", "rgb(49, 163, 84)"]);

	    var svg2 = d3.select("#piechart2");

	    svg2.append("g")
	    .attr("class", "legendOrdinal")
	    .attr("transform", "translate(400,20)");

	    var legendOrdinal2 = d3.legendColor()
	    .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
	    .shapePadding(10)
	    .scale(ordinal2);

	    svg2.select(".legendOrdinal")
	    .call(legendOrdinal2);


	    var tooltip = d3.select('#piechart1div')          
		  .append('div')                             
		  .attr('class', 'tooltip')
		  .attr('id','tooltip');                 

		tooltip.append('div')                        
		  .attr('class', 'label');                   

		tooltip.append('div')                        
		  .attr('class', 'count');                   

		tooltip.append('div')                        
		  .attr('class', 'percent');  


	    var tooltip2 = d3.select('#piechart2div')          
		  .append('div')                             
		  .attr('class', 'tooltip2')
		  .attr('id','tooltip2');                 

		tooltip2.append('div')                        
		  .attr('class', 'label');                   

		tooltip2.append('div')                        
		  .attr('class', 'count');                   

		tooltip2.append('div')                        
		  .attr('class', 'percent'); 


		arcs.on('mouseover', function (d) {
			var total = d3.sum(dataset.map(function(d) {
			  return d.value;
			}));
			var percent = Math.round(1000 * d.data.value / total) / 10;
			tooltip.select('.label').html(d.data.label);
			tooltip.select('.count').html(d.data.value + " out of " + total + " total actions");
			tooltip.select('.percent').html(percent + '%');
			tooltip.style('display', 'block');
			tooltip.style('left', "" + .1*windowWidth + "px");
			tooltip.style('top', "" + .11*windowWidth + "px");
			tooltip.style('width', "" + .12*windowWidth + "px");
	    });

	    arcs.on('mouseout', function(d){
  			tooltip.style('display', 'none');
	    });


		arcs2.on('mouseover', function (d) {
			var total = d3.sum(dataset2.map(function(d) {
			  return d.value;
			}));
			var percent = Math.round(1000 * d.data.value / total) / 10;
			tooltip2.select('.label').html(d.data.label);
			tooltip2.select('.count').html(d.data.value + " out of " + total + " total actions");
			tooltip2.select('.percent').html(percent + '%');
			tooltip2.style('display', 'block');
			tooltip2.style('left', "" + .1*windowWidth + "px");
			tooltip2.style('top', "" + .11*windowWidth + "px");
			tooltip2.style('width', "" + .12*windowWidth + "px");

	    });

	    arcs2.on('mouseout', function(d){
  			tooltip2.style('display', 'none');
	    });

	d3.select("#piechart1div")
	  	.attr("display","block");

	d3.select("#piechart2div")
		.attr("display","block")    
	}
}

function heatMap() {
	if (totalShotAttempts != 0) {
		d3.select("#shotmapdiv")
			.attr("width","" + windowWidth + "")
			.attr("height","" + .479*windowWidth + "");

		d3.select("#shotheatmap")
			.attr("width",""+windowWidth+"")
			.attr("height",""+.479*windowWidth+"")
			.attr("display","block");

		for (var i = 0; i < 26; i++) {
			var color = "hsl(" + shotAccuracyArray[i] + ",100%,50%)";
			push();
			d3.select("#shotzone" + zoneNames[i] + "")
				.attr("transform","translate(" + ((768*zonecenterx[i]) - (768*zonecenterx[i]*shotFrequencyAdjustedArray[i])) + "," + ((369*zonecentery[i]) - (369*zonecentery[i]*shotFrequencyAdjustedArray[i])) +"), scale(" + shotFrequencyAdjustedArray[i] + ")")
				.attr("fill", color);
			pop();
		}

		d3.select("#shotmap")
			.attr("transform","scale(" + windowWidth/768 + "," + .479*windowWidth/369 + ")");

		d3.select("#shotcolor")
			.style("display","block")
			.style("left","" + .57*windowWidth + "px")
			.style("top","" + .90*.479*windowWidth + "px")
			.style("width","" + .11*windowWidth + "px");

			//1139, 546
	}

	if (pressure != "Drill") {
		if (totalPassAttempts != 0) {
			d3.select("#passmapdiv")
			.attr("width","" + windowWidth + "")
			.attr("height","" + .479*windowWidth + "");

			d3.select("#passheatmap")
				.attr("width",""+windowWidth+"")
				.attr("height",""+.479*windowWidth+"")
				.attr("display","block");

			for (var i = 0; i < 26; i++) {
				var color = "hsl(" + passAccuracyArray[i] + ",100%,50%)";
				push();
				d3.select("#passzone" + zoneNames[i] + "")
					.attr("transform","translate(" + ((768*zonecenterx[i]) - (768*zonecenterx[i]*passFrequencyAdjustedArray[i])) + "," + ((369*zonecentery[i]) - (369*zonecentery[i]*passFrequencyAdjustedArray[i])) +"), scale(" + passFrequencyAdjustedArray[i] + ")")
					.attr("fill", color);
				pop();
			}

			d3.select("#passmap")
				.attr("transform","scale(" + windowWidth/768 + "," + .479*windowWidth/369 + ")");

			d3.select("#passcolor")
			.style("display","block")
			.style("left","" + .57*windowWidth + "px")
			.style("top","" + .90*.479*windowWidth + "px")
			.style("width","" + .11*windowWidth + "px");
		}

		if (totalTurnovers != 0) {
			d3.select("#tovmapdiv")
			.attr("width","" + windowWidth + "")
			.attr("height","" + .479*windowWidth + "");

			d3.select("#tovheatmap")
				.attr("width",""+windowWidth+"")
				.attr("height",""+.479*windowWidth+"")
				.attr("display","block");

			for (var i = 0; i < 26; i++) {
				var color = "hsl(" + (100-turnoverPercentArray[i]) + ",100%,50%)";
				push();
				d3.select("#tovzone" + zoneNames[i] + "")
					.attr("transform","translate(" + ((768*zonecenterx[i]) - (768*zonecenterx[i]*turnoverFrequencyAdjustedArray[i])) + "," + ((369*zonecentery[i]) - (369*zonecentery[i]*turnoverFrequencyAdjustedArray[i])) +"), scale(" + turnoverFrequencyAdjustedArray[i] + ")")
					.attr("fill", color);
				pop();
			}

			d3.select("#tovmap")
				.attr("transform","scale(" + windowWidth/768 + "," + .479*windowWidth/369 + ")");

			d3.select("#tovcolor")
			.style("display","block")
			.style("left","" + .57*windowWidth + "px")
			.style("top","" + .90*.479*windowWidth + "px")
			.style("width","" + .11*windowWidth + "px");
		}
	}
}

//This block is for showing the further breakdown of each section when you hover over it

function displayShotTooltip(zone) {
	var acc = shotAccuracyArray[zoneNames.indexOf(zone)];
	var shotstaken = shotsAttemptedArray[zoneNames.indexOf(zone)];
	var shotsmade = shotsMadeArray[zoneNames.indexOf(zone)];

	d3.select(".shotmaptooltip")
		.style("display","block")
		.style("left","" + zonecenterx[zoneNames.indexOf(zone)]*windowWidth + "px")
		.style("top", "" + zonecentery[zoneNames.indexOf(zone)]*.479*windowWidth + "px");

	d3.select("#shotsaccuracy")
		.text("eFG%: " + acc + "%");

	d3.select("#shots")
		.text(shotsmade + " made out of " + shotstaken);

	d3.select("#shotsfrequency")
		.text(shotstaken + " shots taken out of " + totalShotAttempts + " total attempts");
		
}

function hideShotTooltip() {
	d3.select(".shotmaptooltip")
		.style("display","none");
}

function displayPassTooltip(zone) {
	var acc = passAccuracyArray[zoneNames.indexOf(zone)];
	var passtaken = passAttemptedArray[zoneNames.indexOf(zone)];
	var passmade = passMadeTotalArray[zoneNames.indexOf(zone)];

	d3.select(".passmaptooltip")
		.style("display","block")
		.style("left","" + zonecenterx[zoneNames.indexOf(zone)]*windowWidth + "px")
		.style("top", "" + zonecentery[zoneNames.indexOf(zone)]*.479*windowWidth + "px");

	d3.select("#passaccuracy")
		.text("Completion %: " + acc + "%");

	d3.select("#passes")
		.text(passmade + " completed out of " + passtaken);

	d3.select("#passfrequency")
		.text(passtaken + " passes out of " + totalPassAttempts + " total attempts");
		
}

function hidePassTooltip() {
	d3.select(".passmaptooltip")
		.style("display","none");
}

function displayTovTooltip(zone) {
	var perc = turnoverPercentArray[zoneNames.indexOf(zone)];
	var action = totalActionsArray[zoneNames.indexOf(zone)];
	var tov = turnoverArray[zoneNames.indexOf(zone)];

	d3.select(".tovmaptooltip")
		.style("display","block")
		.style("left","" + zonecenterx[zoneNames.indexOf(zone)]*windowWidth + "px")
		.style("top", "" + zonecentery[zoneNames.indexOf(zone)]*.479*windowWidth + "px");

	d3.select("#tovpercent")
		.text(perc + "% of actions in this zone are turnovers");

	d3.select("#tov")
		.text(tov + " turnovers out of " + action + " total actions");

	d3.select("#tovfrequency")
		.text(tov + " turnovers out of " + totalTurnovers + " total turnovers");
		
}

function hideTovTooltip() {
	d3.select(".tovmaptooltip")
		.style("display","none");
}