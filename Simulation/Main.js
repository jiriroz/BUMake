/*

Main function of the simulation.

*/

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var scale = 2.50e+11;
var dT = 25000;
var G = 6.67e-11;

var simulation = new Simulation();

simulation.createPlanet(1.4960e+11, 0.0000e+00, 0.0000e+00, 2.9800e+04, 5.9740e+24, 10, "img/earthmap1k.jpg");//earth.gif
simulation.createPlanet(2.2790e+11, 0.0000e+00, 0.0000e+00, 2.4100e+04, 6.4190e+23, 10, "img/mars_1k_color.jpg");//mars.gif
simulation.createPlanet(5.7900e+10, 0.0000e+00, 0.0000e+00, 4.7900e+04, 3.3020e+23, 8, "img/mercurymap.jpg");// mercury.gif
simulation.createPlanet(0.0000e+00, 0.0000e+00, 0.0000e+00, 0.0000e+00, 1.9890e+30, 23, "img/sunmap.jpg"); //  sun.gif
simulation.createPlanet(1.0820e+11, 0.0000e+00, 0.0000e+00, 3.5000e+04, 4.8690e+24, 9, "img/venusmap.jpg");// venus.gif
