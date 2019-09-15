// This code is for the play input module. It uses the probabilities for game pressure data to predict the likelihood of success for a hypothetical play


//Here we declare the variables we will be using and load the necessary data files
var table = [];
var roster = JSON.parse(fs.readFileSync("data/roster.JSON", 'utf8'));

var prob;
var weakness;
var alt;

var totalShotMade = [];
var totalShotMiss = [];
var totalShotAttempt = [];
var shootingAccuracies = [];

var totalPassComplete = [];
var totalPassMiss = [];
var totalAdvantagePass = [];
var totalAssists = [];
var totalPassMade = [];
var totalPassAttempt = [];
var passingAccuracies = [];

for (var i = 0; i < roster.length; i ++) {
    table[i] = JSON.parse(fs.readFileSync("data/" + roster[i] + ".JSON", 'utf8'));
        
    
    totalShotMade[i] = table[i][10];
    totalShotMiss[i] = table[i][11];
    totalShotMade[i].shift();
    totalShotMiss[i].shift();

    totalPassComplete[i] = table[i][12];
    totalPassMiss[i] = table[i][13];
    totalAdvantagePass[i] = table[i][14];
    totalAssists[i] = table[i][11];
    totalPassComplete[i].shift();
    totalPassMiss[i].shift();
    totalAdvantagePass[i].shift();
    totalAssists[i].shift();

    totalShotAttempt[i] = [];
    shootingAccuracies[i] = [];
    totalPassMade[i] = [];
    totalPassAttempt[i] = [];
    passingAccuracies[i] = [];

    for (var j = 0; j < 26; j++) {
        totalShotAttempt[i][j] = totalShotMade[i][j] + totalShotMiss[i][j];
        if (totalShotAttempt[i][j] == 0) {
            shootingAccuracies[i][j] = "n/a";
        }
        else {
            shootingAccuracies[i][j] = Math.round(100*totalShotMade[i][j]/totalShotAttempt[i][j])/100;
        }
        totalPassMade[i][j] = totalPassComplete[i][j] + totalAdvantagePass[i][j] + totalAssists[i][j];
        totalPassAttempt[i][j] = totalPassMade[i][j] + totalPassMiss[i][j];
        if (totalPassAttempt[i][j] == 0) {
            passingAccuracies[i][j] = "n/a";
        }
        else {
            passingAccuracies[i][j] = Math.round(100*totalPassMade[i][j]/totalPassAttempt[i][j])/100;
        }
    }
}

var zones = []; 
var scale;

var zonecenterx = [0.4042, 0.2463, 0.1516, 0.1274, 0.4295, 0.2926, 0.2326, 0.2063, 0.4358, 0.3368, 0.2821, 0.4358, 0.3474, 0.5958, 0.7537, 0.8484, 0.8726, 0.5705, 0.7074, 0.7674, 0.7937, 0.5642, 0.6632, 0.7179, 0.5642, 0.6526];
var zonecentery = [0.6813, 0.5363, 0.3209, 0.1099, 0.5626, 0.4396, 0.2571, 0.0989, 0.4088, 0.3473, 0.1319, 0.1714, 0.1319, 0.6813, 0.5363, 0.3209, 0.1099, 0.5626, 0.4396, 0.2571, 0.0989, 0.4088, 0.3473, 0.1319, 0.1714, 0.1319];

var hoopx = .497;
var hoopy = .123;

var player;
var zone;
var action;

var eventArray = [];
var initialZone;
var finalZone;

var actionVector;
var x1;
var x2;
var y1;
var y2;

var play = [];

var head1;
var head2;

var column = [];
var index;
var min;

var head1Points;
var head2Points;


var i = 0;

var zoneSelected = 0;

var probWeakestLink = [];
var weakestEvent;

var playerInitials = [];


//This block loads the base images and updates the dropdown menu based on the roster file

function preload() {
    base = loadImage("Assets/base3.png");
    for (var i = 0; i < 26; i++) {
        zones[i]=loadImage("Assets/" + zoneNames[i]+".png");
    }
}

function setup() {
    cnv = createCanvas(windowWidth,.479*windowWidth);
    background(255);
    colorMode(HSB,360,100,80);


    cnv.mouseClicked(colorZone)
    console.log(windowWidth,.479*windowWidth)

    scale = (windowWidth/864)


    noTint();
    image(base,0,0,windowWidth,.479*windowWidth);
}

window.onload = function initialize() {
    roster = JSON.parse(fs.readFileSync("data/roster.JSON", 'utf8'));

    for (var i = 0; i < roster.length; i++) {
        var dropdown = document.getElementById("myDropdown");
        var selectedplayer = document.createElement("a");
        selectedplayer.setAttribute("onclick", "choosePlayer('" + roster[i] + "')");
        selectedplayer.innerHTML = capitalizeName(roster[i]);
        dropdown.appendChild(selectedplayer);
    }

    for (var i = 0; i < roster.length; i++) {
        roster = JSON.parse(fs.readFileSync("data/roster.JSON", 'utf8'));

        playerInitials[i] = roster [i];

        if(playerInitials[i].includes(" ")) {
                var x = playerInitials[i].split(" ");
                var a = x[0].slice(0,1).toUpperCase();
                var b = x[1].slice(0,1).toUpperCase();
                playerInitials[i] =  a.concat(b);
            }

        else {
            var a = playerInitial[i].slice(0,1).toUpperCase();
            playerInitials[i] =  a;
        }
    }
}

//This block adjusts variables based on the player and action

function choosePlayer(choice) {
    player = choice;
    console.log(player);
    myFunction();
}

function chooseAction(choice) {
    action = choice;
    console.log(action);
    myFunction2();
}

/*This block is for adding the data of who performed the action, where it was performed from, and what action was performed. 
It also shows where the pass/dribble was to and who received the pass. */

function addInitialData() {
    eventArray[0] = player;
    eventArray[1] = zone;
    eventArray[2] = action;
    loadZone();

    ellipseSettings();
    ellipse(zonecenterx[zoneNames.indexOf(zone)]*windowWidth,zonecentery[zoneNames.indexOf(zone)]*windowWidth*.479,.037*windowWidth);
    textSettings();
    text(playerInitials[roster.indexOf(player)],zonecenterx[zoneNames.indexOf(zone)]*windowWidth,zonecentery[zoneNames.indexOf(zone)]*windowWidth*.479);

    console.log(eventArray);

    if(action == "Shot") {
        x1 = zonecenterx[zoneNames.indexOf(eventArray[1])]*windowWidth;
        y1 = zonecentery[zoneNames.indexOf(eventArray[1])]*windowWidth*.479;
        x2 = hoopx*windowWidth;
        y2 = hoopy*windowWidth*.479; 

        stroke(0,100,100);
        drawArrows(null);

        zoneSelected = 2;

        append(play, eventArray);
        eventArray = [];
    }

    makeArrowGraphic();

    if(action == "Pass") {
        player = "";
    }
}

function addFinalData() {
    switch(action) {
        case("Pass"):
            eventArray[3] = zone;
            eventArray[4] = player;
            append(play, eventArray);
            loadZone();

            ellipseSettings();
            ellipse(zonecenterx[zoneNames.indexOf(eventArray[1])]*windowWidth,zonecentery[zoneNames.indexOf(eventArray[1])]*windowWidth*.479,.037*windowWidth);
            ellipse(zonecenterx[zoneNames.indexOf(eventArray[3])]*windowWidth,zonecentery[zoneNames.indexOf(eventArray[3])]*windowWidth*.479,.037*windowWidth);
            textSettings();
            text(playerInitials[roster.indexOf(eventArray[0])],zonecenterx[zoneNames.indexOf(eventArray[1])]*windowWidth,zonecentery[zoneNames.indexOf(eventArray[1])]*windowWidth*.479);
            text(playerInitials[roster.indexOf(eventArray[4])],zonecenterx[zoneNames.indexOf(eventArray[3])]*windowWidth,zonecentery[zoneNames.indexOf(eventArray[3])]*windowWidth*.479);

            eventArray = [];
            makeArrowGraphic();
        break;

        case("Dribble"):
            eventArray[3] = zone;
            append(play, eventArray);
            loadZone();

            ellipseSettings();
            ellipse(zonecenterx[zoneNames.indexOf(eventArray[1])]*windowWidth,zonecentery[zoneNames.indexOf(eventArray[1])]*windowWidth*.479,.037*windowWidth);
            ellipse(zonecenterx[zoneNames.indexOf(eventArray[3])]*windowWidth,zonecentery[zoneNames.indexOf(eventArray[3])]*windowWidth*.479,.037*windowWidth);
            textSettings();
            text(playerInitials[roster.indexOf(eventArray[0])],zonecenterx[zoneNames.indexOf(eventArray[1])]*windowWidth,zonecentery[zoneNames.indexOf(eventArray[1])]*windowWidth*.479);
            text(playerInitials[roster.indexOf(eventArray[0])],zonecenterx[zoneNames.indexOf(eventArray[3])]*windowWidth,zonecentery[zoneNames.indexOf(eventArray[3])]*windowWidth*.479);

            eventArray = [];
            makeArrowGraphic();
        break;
    }
}

/*This block calculates the probability of success of the play by multiplying the probabilities of each event together. 
It also shows the weakest link in the play and suggests an alternative player*/

function calcProbSuccess() {
    var probSuccess = 1;
    prob = document.getElementById("probabilityOfSuccessid");

    for (var i = 0; i<play.length; i++) {
        if (play[i][2] == "Shot") {
            if (shootingAccuracies[roster.indexOf(play[i][0])][zoneNames.indexOf(play[i][1])] == "n/a") {
                probSuccess = "No Data for this Play";
                break;
            }
            else {
                probSuccess = probSuccess*shootingAccuracies[roster.indexOf(play[i][0])][zoneNames.indexOf(play[i][1])];
            }
        }
        else if (play[i][2] == "Pass") {
            if (passingAccuracies[roster.indexOf(play[i][0])][zoneNames.indexOf(play[i][1])] == "n/a") {
                probSuccess = "No Data for this Play";
                break;
            }
            else {
                probSuccess = probSuccess*passingAccuracies[roster.indexOf(play[i][0])][zoneNames.indexOf(play[i][1])];
            }
        }
    }


    prob.innerHTML = probSuccess;
}

function weakestLink() {
    for (var i = 0; i<play.length; i++) {
        var prob;
        if (play[i][2] == "Shot") {
            prob = float(shootingAccuracies[roster.indexOf(play[i][0])][zoneNames.indexOf(play[i][1])]);
        }
        else if (play[i][2] == "Pass") {
            prob = float(passingAccuracies[roster.indexOf(play[i][0])][zoneNames.indexOf(play[i][1])]);
        }
        else {
            prob = 1;
        }
        probWeakestLink[i] = prob;
    }

    weakness = document.getElementById("weakestLinkid");
    weakness.innerHTML = "";

    var indexProb = min(probWeakestLink);

    weakestEvent = play[probWeakestLink.indexOf(indexProb)];

    weakness.innerHTML = weakestEvent;
    console.log(join(weakestEvent," "));
}

function alternativePlayer() {
    var column = [];
    if (weakestEvent[2] == "Shot") {
        for (var i = 0; i < roster.length; i ++) {
            column[i] = shootingAccuracies[i][weakestEvent[1]];
        }
    }
    else if (weakestEvent[2] == "Pass") {
        for (var i = 0; i < roster.length; i ++) {
            column[i] = passingAccuracies[i][weakestEvent[1]];
        }
    }
    
    var min = Math.min.apply(null, column);
    
    var index = column.indexOf(min);

    alt = document.getElementById("alternativePlayerid");
    alt.innerHTML = "";

    var alternativePlayer = roster[index];

    alt.innerHTML = alternativePlayer;
    console.log(alternativePlayer);
}

//This set of code is for the dropdown menus and for keyboard shortcuts

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function myFunction2() {
    document.getElementById("actionDropdown").classList.toggle("show");
}

function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

$(document).keypress(function(e) {
    if (e.which == 13) {
        switch(i) {
            case(0):
            addInitialData();
            i=1;
            break;

            case(1):
            addFinalData();
            i=0;
            break;
        }
    }

    else if (e.which == 120) {
        noTint();
        image(zones[zoneNames.indexOf(zone)],0,0,windowWidth,.479*windowWidth);
        zoneSelected = 0;
    }


    else if (e.which == 49) {
        action = "Shot";
        console.log(action);
    }
    else if (e.which == 50) {
        action = "Pass";
        console.log(action);
    }
    else if (e.which == 51) {
        action = "Dribble";
        console.log(action);
    }
    
    else if (e.which == 97) {
        console.log(player + " " + zone + " " + action + rplayer + rzone);
    }
});

//This block of code is for drawing the arrows and the circles around the player's initials

function ellipseSettings() {
    ellipse(CENTER);
    stroke(0);
    fill(100);
}

function textSettings() {
    textSize(.014*windowWidth);
    textAlign(CENTER,CENTER);
    noStroke();
    fill(0);
}

function drawArrows(events) {
    var u = createVector(x2-x1,y2-y1);
    u.normalize();
    u.setMag(.5*.037*windowWidth);
    actionVector = u.array();

    strokeWeight(2);

    switch(events) {
        case("Pass"):
            stroke(120,100,100);
        break;

        case("Dribble"):
            stroke(240,100,100);
        break;
    }

    line(x1+actionVector[0],y1+actionVector[1],x2-actionVector[0],y2-actionVector[1]);
        
    head1 = createVector(x1-x2,y1-y2);
    head1.normalize();
    head1.setMag(.02*windowWidth);

    head2 = createVector(x1-x2,y1-y2);
    head2.normalize();
    head2.setMag(.02*windowWidth);

    head1.rotate(Math.PI/6);
    head2.rotate(11*Math.PI/6)

    head1Points = head1.array();
    head2Points = head2.array();
    
    line(x2-actionVector[0],y2-actionVector[1],x2-actionVector[0]+head1Points[0],y2-actionVector[1]+head1Points[1]);
    line(x2-actionVector[0],y2-actionVector[1],x2-actionVector[0]+head2Points[0],y2-actionVector[1]+head2Points[1]);
}

function makeArrowGraphic() {
    for (var i = 0; i <play.length; i++) {
        initialZone = zoneNames.indexOf(play[i][1]);
        finalZone = zoneNames.indexOf(play[i][3]);

        x1 = zonecenterx[initialZone]*windowWidth;
        y1 = zonecentery[initialZone]*windowWidth*.479;

        playerInit = playerInitials[roster.indexOf(play[i][0])];
        
        ellipseSettings();
        ellipse(x1,y1,.037*windowWidth);
        textSettings();
        text(playerInit,x1,y1);
        
        x2 = zonecenterx[finalZone]*windowWidth;
        y2 = zonecentery[finalZone]*windowWidth*.479; 

        drawArrows(play[i][2]);
    }
}