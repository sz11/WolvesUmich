// This file contains many common functions we created that we will refer back to throughout all the modules

// This block is a set of arrays we will refer to when saving data and creating heat maps
var zoneNames = ["1L","2L","3L","4L","5L","6L","7L","8L","9L","10L","11L","12L","13L","1R","2R","3R","4R","5R","6R","7R","8R","9R","10R","11R","12R","13R"];
var zonecenterx = [0.4042, 0.2463, 0.1516, 0.1274, 0.4295, 0.2926, 0.2326, 0.2063, 0.4358, 0.3368, 0.2821, 0.4358, 0.3474, 0.5958, 0.7537, 0.8484, 0.8726, 0.5705, 0.7074, 0.7674, 0.7937, 0.5642, 0.6632, 0.7179, 0.5642, 0.6526];
var zonecentery = [0.6813, 0.5363, 0.3209, 0.1099, 0.5626, 0.4396, 0.2571, 0.0989, 0.4088, 0.3473, 0.1319, 0.1714, 0.1319, 0.6813, 0.5363, 0.3209, 0.1099, 0.5626, 0.4396, 0.2571, 0.0989, 0.4088, 0.3473, 0.1319, 0.1714, 0.1319]; 
var basicDataTitles = ["","Personal Foul","Technical Foul","Flagrant Foul","Defensive Rebound","Offensive Rebound","Blocks","Blocks Against","Steals","2pt Made","2pt Missed","3pt Made","3pt Missed","FT Made","FT Missed"];


// This function capitalizes words
function capitalizeName(name) {
	var newname;
	if (typeof name == 'string') {
		if(name.includes(" ")) {
			var x = name.split(" ");
			var a = x[0].slice(0,1).toUpperCase();
			var b = x[0].slice(1);
			var c = a + b + " ";
			var d = x[1].slice(0,1).toUpperCase();
			var e = x[1].slice(1);
			var f = d + e;
			newname =  c.concat(f);
		}
		
		else {
			var a = name.slice(0,1).toUpperCase();
			var b = name.slice(1);
			newname = a + b;
		}
		return newname;
	}
}

const fs = window.nodeRequire("fs");

//This function clears the coloring of each zone
function loadZone() {
    noTint();
    image(zones[zoneNames.indexOf(zone)],0,0,windowWidth,.479*windowWidth);
    zoneSelected = 0;
}

//This function outlines the limits of each zone so that when a user clicks on the screen the function knows which zone they clicked 
function colorZone() {
    if (zoneSelected == 1) {
        loadZone();
    }

    if (zoneSelected == 0) {
        switch(true) {
        case (245*scale<mouseY && mouseY<311*scale && mouseX>278*scale && mouseX<5.70*mouseY-5.70*245*scale+278*scale && mouseX<432*scale && mouseX>7*mouseY-7*289*scale+278*scale):
        tint(100,100,100);
        image(zones[0],0,0,windowWidth,.479*windowWidth);
        zone = "1L";
        zoneSelected = 1;
        console.log(zone);
        break;
        case (245*scale<mouseY && mouseY<311*scale && mouseX<586*scale && mouseX>-5.70*mouseY+5.70*245*scale+586*scale && mouseX>432*scale && mouseX<-7*mouseY+7*289*scale+586*scale):
        tint(100,100,100);
        image(zones[13],0,0,windowWidth,.479*windowWidth);
        zone = "1R";
        zoneSelected = 1;
        console.log(zone);
        break;


        case (158*scale<mouseY && mouseY<289*scale && mouseX>-1.58*mouseY+1.58*158*scale+190*scale && mouseX<1.13*mouseY-1.13*158*scale+190*scale && mouseX>1.64*mouseY-1.64*196*scale+130*scale && mouseX<278*scale):
        tint(100,100,100);
        image(zones[1],0,0,windowWidth,.479*windowWidth);
        zone = "2L";
        zoneSelected = 1;
        console.log(zone);
        break;
        case (158*scale<mouseY && mouseY<289*scale && mouseX<1.58*mouseY-1.58*158*scale+674*scale && mouseX>-1.13*mouseY+1.13*158*scale+674*scale && mouseX<-1.64*mouseY+1.64*196*scale+734*scale && mouseX>586*scale):
        tint(100,100,100);
        image(zones[14],0,0,windowWidth,.479*windowWidth);
        zone = "2R";
        zoneSelected = 1;
        console.log(zone);
        break;


        case (89*scale<mouseY && mouseY<196*scale && mouseX>.5*mouseY-.5*89*scale+76*scale && mouseX<.52*mouseY-.52*89*scale+154*scale && mouseX<-1.58*mouseY+1.58*158*scale+190*scale):
        tint(100,100,100);
        image(zones[2],0,0,windowWidth,.479*windowWidth);
        zone = "3L";
        zoneSelected = 1;
        console.log(zone);
        break;
        case (89*scale<mouseY && mouseY<196*scale && mouseX<-.5*mouseY+.5*89*scale+788*scale && mouseX>-.52*mouseY+.52*89*scale+710*scale && mouseX>1.58*mouseY-1.58*158*scale+674*scale):
        tint(100,100,100);
        image(zones[15],0,0,windowWidth,.479*windowWidth);
        zone = "3R";
        zoneSelected = 1;
        console.log(zone);
        break;


        case (1*scale<mouseY && mouseY<89*scale && mouseX>76*scale && mouseX<.28*mouseY-.28*47*scale+140*scale && mouseX<141*scale):
        tint(100,100,100)
        image(zones[3],0,0,windowWidth,.479*windowWidth)
        zone = "4L";
        zoneSelected = 1;
        console.log(zone);
        break;
        case (1*scale<mouseY && mouseY<89*scale && mouseX<788*scale && mouseX>-.28*mouseY+.28*47*scale+724*scale && mouseX>723*scale):
        tint(100,100,100);
        image(zones[16],0,0,windowWidth,.479*windowWidth);
        zone = "4R";
        zoneSelected = 1;
        console.log(zone);
        break;


        case (203*scale<mouseY && mouseY<272*scale && mouseX>-1.79*mouseY+1.79*203*scale+330*scale && mouseX>3.71*mouseY-3.71*231*scale+280*scale && mouseX<432*scale):
        tint(100,100,100);
        image(zones[4],0,0,windowWidth,.479*windowWidth);
        zone = "5L";
        zoneSelected = 1;
        console.log(zone);
        break;
        case (203*scale<mouseY && mouseY<272*scale && mouseX<1.79*mouseY-1.79*203*scale+534*scale && mouseX<-3.71*mouseY+3.71*231*scale+584*scale && mouseX>432*scale):
        tint(100,100,100);
        image(zones[17],0,0,windowWidth,.479*windowWidth);
        zone = "5R";
        zoneSelected = 1;
        console.log(zone);
        break;


        case (124*scale<mouseY && mouseY<231*scale && mouseX>-1.5*mouseY+1.5*124*scale+240*scale && mouseX<1.14*mouseY-1.14*124*scale+240*scale && mouseX>1.17*mouseY-1.17*156*scale+192*scale && mouseX<-1.79*mouseY+1.79*203*scale+330*scale):
        tint(100,100,100);
        image(zones[5],0,0,windowWidth,.479*windowWidth);
        zone = "6L";
        zoneSelected = 1;
        console.log(zone);
        break;
        case (124*scale<mouseY && mouseY<231*scale && mouseX<1.5*mouseY-1.5*124*scale+624*scale && mouseX>-1.14*mouseY+1.14*124*scale+624*scale && mouseX<-1.17*mouseY+1.17*156*scale+672*scale && mouseX>1.79*mouseY-1.79*203*scale+534*scale):
        tint(100,100,100);
        image(zones[18],0,0,windowWidth,.479*windowWidth);
        zone = "6R";
        zoneSelected = 1;
        console.log(zone);
        break;


        case (64*scale<mouseY && mouseY<156*scale && mouseX>-2.5*mouseY+2.5*64*scale+216*scale && mouseX<.4*mouseY-.4*64*scale+216*scale && mouseX>.53*mouseY-.53*88*scale+156*scale && mouseX<-1.5*mouseY+1.5*124*scale+240*scale):
        tint(100,100,100);
        image(zones[6],0,0,windowWidth,.479*windowWidth);
        zone = "7L";
        zoneSelected = 1;
        console.log(zone);
        break;
        case (64*scale<mouseY && mouseY<156*scale && mouseX<2.5*mouseY-2.5*64*scale+648*scale && mouseX>-.4*mouseY+.4*64*scale+648*scale && mouseX<-.53*mouseY+.53*88*scale+708*scale && mouseX>1.5*mouseY-1.5*124*scale+624*scale):
        tint(100,100,100);
        image(zones[19],0,0,windowWidth,.479*windowWidth);
        zone = "7R";
        zoneSelected = 1;
        console.log(zone);
        break;


        case (1*scale<mouseY && mouseY<88*scale && mouseX>.13*mouseY-.13*1*scale+145*scale && mouseX<-2.5*mouseY+2.5*64*scale+216*scale && mouseX<.11*mouseY-.11*1*scale+209*scale):
        tint(100,100,100);
        image(zones[7],0,0,windowWidth,.479*windowWidth);
        zone = "8L";
        zoneSelected = 1;
        console.log(zone);
        break;
        case (1*scale<mouseY && mouseY<88*scale && mouseX<-.13*mouseY+.13*1*scale+719*scale && mouseX>2.5*mouseY-2.5*64*scale+648*scale && mouseX>.11*mouseY+.11*1*scale+655*scale):
        tint(100,100,100);
        image(zones[20],0,0,windowWidth,.479*windowWidth);
        zone = "8R";
        zoneSelected = 1;
        console.log(zone);
        break;


        case (136*scale<mouseY && mouseY<203*scale && 330*scale<mouseX && mouseX<432*scale):
        tint(100,100,100);
        image(zones[8],0,0,windowWidth,.479*windowWidth);
        zone = "9L";
        zoneSelected = 1;
        console.log(zone);
        break;
        case (136*scale<mouseY && mouseY<203*scale && 432*scale<mouseX && mouseX<534*scale):
        tint(100,100,100);
        image(zones[21],0,0,windowWidth,.479*windowWidth);
        zone = "9R";
        zoneSelected = 1;
        console.log(zone);
        break;


        case (97*scale<mouseY && mouseY<203*scale && mouseX>-1.48*mouseY+1.48*97*scale+284*scale && mouseX>1.09*mouseY-1.09*124*scale+244*scale && mouseX<1.18*mouseY-1.18*97*scale+284*scale && mouseX<330*scale):
        tint(100,100,100);
        image(zones[9],0,0,windowWidth,.479*windowWidth);
        zone = "10L";
        zoneSelected = 1;
        console.log(zone);
        break;
        case (97*scale<mouseY && mouseY<203*scale && mouseX<1.48*mouseY-1.48*97*scale+580*scale && mouseX<-1.09*mouseY+1.09*124*scale+620*scale && mouseX>-1.18*mouseY+1.18*97*scale+580*scale && mouseX>534*scale):
        tint(100,100,100);
        image(zones[22],0,0,windowWidth,.479*windowWidth);
        zone = "10R";
        zoneSelected = 1;
        console.log(zone);
        break;


        case (1*scale<mouseY && mouseY<124*scale && mouseX>.26*mouseY-.26*1*scale+212*scale && mouseX<.16*mouseY-.16*1*scale+269*scale && mouseX<-1.48*mouseY+1.48*97*scale+284*scale):
        tint(100,100,100);
        image(zones[10],0,0,windowWidth,.479*windowWidth);
        zone = "11L";
        zoneSelected = 1;
        console.log(zone);
        break;
        case (1*scale<mouseY && mouseY<124*scale && mouseX<-.26*mouseY+.26*1*scale+652*scale && mouseX>-.16*mouseY+.16*1*scale+595*scale && mouseX>1.48*mouseY-1.48*97*scale+580*scale):
        tint(100,100,100);
        image(zones[23],0,0,windowWidth,.479*windowWidth);
        zone = "11R";
        zoneSelected = 1;
        console.log(zone);
        break;


        case (1*scale<mouseY && mouseY<136*scale && 330*scale<mouseX && mouseX<432*scale):
        tint(100,100,100);
        image(zones[11],0,0,windowWidth,.479*windowWidth);
        image(base,0,0,windowWidth,.479*windowWidth);
        zone = "12L";
        zoneSelected = 1;
        console.log(zone);
        break;
        case (1*scale<mouseY && mouseY<136*scale && 432*scale<mouseX && mouseX<534*scale):
        tint(100,100,100);
        image(zones[24],0,0,windowWidth,.479*windowWidth);
        image(base,0,0,windowWidth,.479*windowWidth);
        zone = "12R";
        zoneSelected = 1;
        console.log(zone);
        break;

        case (1*scale<mouseY && mouseY<136*scale && mouseX>.16*mouseY-.16*1*scale+269*scale && mouseX>1.1*mouseY-1.1*94*scale+284*scale && mouseX<330*scale):
        tint(100,100,100);
        image(zones[12],0,0,windowWidth,.479*windowWidth);
        zone = "13L";
        zoneSelected = 1;
        console.log(zone);
        break;
        case (1*scale<mouseY && mouseY<136*scale && mouseX<-.16*mouseY+.16*1*scale+595*scale && mouseX<-1.1*mouseY+1.1*94*scale+580*scale && mouseX>534*scale):
        tint(100,100,100);
        image(zones[25],0,0,windowWidth,.479*windowWidth);
        zone = "13R";
        zoneSelected = 1;
        console.log(zone);
        break;
        }
    }
}