if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var scale = 2.50e+11;
var dT = 25000;
var G = 6.67e-11;

var lines = [];


/******************** Helpers ****************/

//rounds the number to the nearest multiple of 25.
var round25 = function(num) {
    var mod = num%25;
    if (mod < 12.5) {
        return num - mod;
    } else {
        return num + (25 - mod);
    }
};

var createPlanet = function (x,y,velx,vely,mass,radius,img) {
    planets.push(new Body(x,y,velx,vely,mass,radius,img));
};

/**********************************************************/

/*Simulation class*/
/************************************************************/
function Simulation () {
    this.planets = [];
    this.run();
}

Simulation.prototype.run = function () {

    init();
    animate();

    function init () {

    var container = document.createElement( 'div' );
    document.body.appendChild(container);

    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    this.camera.position.z = 800;
    this.camera.position.y = 200;
    this.camera.rotation.x = -Math.PI/8;

    scene.add( new THREE.AmbientLight( 0x404040 ) );
    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 0 );
    scene.add(light);

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( this.renderer.domElement );

    window.addEventListener( 'resize', this.onWindowResize, false );

    }

    function animate() {
        requestAnimationFrame( animate );
        simulationStep();
        computeWarping();
        this.renderer.render( scene, this.camera );
    }
};

var simulationStep = function () {
    //N-Body simulation
    for (var i=0; i < planets.length; i++) {
        for (var j=0; j< planets.length; j++) {
            if (i != j) {
                var gravity = planets[i].calculateAttraction(planets[j]);
                planets[i].applyForce(gravity);
            }
        }
    }

    //position updates
    for (var i=0; i < planets.length; i++) {
        planets[i].run();
    }
};

var createSpaceTime = function (direction) {
    var color = new THREE.LineBasicMaterial( { color: new THREE.Color(1,0,0) } );
    var floor = 0;
    var step = 25;
    for (var i = 0; i <= 40; i++ ) {
        var geometry = new THREE.Geometry();
        for (var j = 0; j<= 40; j++) {
            var sum = 0;
            for (var k = 0; k < planets.length; k++) {
                var nodePosition = new THREE.Vector2((i-20)*25,(j-20)*25);
                var x = planets[k].position.x/scale * 500;
                var y = planets[k].position.y/scale * 500;
                var planetPosition = new THREE.Vector2(x,y);
                var distance = planetPosition.distanceTo(nodePosition);
                sum -= 100/(Math.pow(distance,1/2));
            }
            if (direction.toLowerCase() == "x") {
                geometry.vertices.push( new THREE.Vector3( - 500 + j*step, sum, -500 + i*step ));
            } else if (direction.toLowerCase() == "z") {
                geometry.vertices.push( new THREE.Vector3( - 500 + i*step, sum, -500 + j*step ));
            }
        }
        var line = new THREE.Line( geometry, color );
       
        lines.push(line);
        scene.add(line);
    }
};

var computeWarping = function () {
    //remove all
    for (var i = 0; i < lines.length; i++) {
        for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
           scene.remove(lines[i]);
        }
    }
    createSpaceTime("Z");
    createSpaceTime("X");
};

//responds to change of window dimensions
Simulation.prototype.onWindowResize = function () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
};


/******************************************************************/



/* script - "main fuction"*/
/******************************************************************/


var scene = new THREE.Scene();
var planets = [];


createPlanet(1.4960e+11, 0.0000e+00, 0.0000e+00, 2.9800e+04, 5.9740e+24, 10, "img/earthmap1k.jpg");//earth.gif
createPlanet(2.2790e+11, 0.0000e+00, 0.0000e+00, 2.4100e+04, 6.4190e+23, 10, "img/mars_1k_color.jpg");//mars.gif
createPlanet(5.7900e+10, 0.0000e+00, 0.0000e+00, 4.7900e+04, 3.3020e+23, 8, "img/mercurymap.jpg");// mercury.gif
createPlanet(0.0000e+00, 0.0000e+00, 0.0000e+00, 0.0000e+00, 1.9890e+30, 23, "img/sunmap.jpg"); //  sun.gif
createPlanet(1.0820e+11, 0.0000e+00, 0.0000e+00, 3.5000e+04, 4.8690e+24, 9, "img/venusmap.jpg");// venus.gif


var simulation = new Simulation();






