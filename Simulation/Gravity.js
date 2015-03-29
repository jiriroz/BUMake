if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var scale = 7.50e12;
var dT = 25000;
var G = 6.67e-11;

var lines = [];


/***************** Vector Class ***********/

var Vector = function(xp,yp) {
    this.x = xp;
    this.y = yp;
};

Vector.prototype.copy = function() {
    return new Vector(this.x, this.y);
};

Vector.prototype.sub = function(other) {
    this.x -= other.x;
    this.y -= other.y;
};

Vector.sub = function(v1, v2) {
    var v3 = v1.copy();
    v3.sub(v2);
    return v3;
};

Vector.prototype.add = function(other) {
    this.x += other.x;
    this.y += other.y;
};

Vector.add = function(v1, v2) {
    var v3 = v1.copy();
    v3.add(v2);
    return v3;
};

Vector.prototype.mult = function(scalar) {
    this.x *= scalar;
    this.y *= scalar;
};

Vector.mult = function(v1, scalar) {
    var v3 = v1.copy();
    v3.mult(scalar);
    return v3;
};

Vector.prototype.div = function(scalar) {
    this.x /= scalar;
    this.y /= scalar;
};

Vector.div = function(v1, scalar) {
    var v3 = v1.copy();
    v3.div(scalar);
    return v3;
};

Vector.prototype.mag = function() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};

Vector.prototype.normalize = function() {
    this.div(this.mag());
};

Vector.dist = function(v1, v2) {
    var v3 = Vector.sub(v2,v1);
    return v3.mag();    
};

/******************** Helpers ****************/

var round25 = function(num) {
    var mod = num%25;
    if (mod < 12.5) {
        return num - mod;
    } else {
        return num + (25 - mod);
    }
}

/**********************************************************/

                     /* Body class */

/***********************************************************/

//Planet body
var Body = function (x, y, velx, vely, mass, radius, col) {
    this.position = new Vector(x,y);
    this.velocity = new Vector(velx,vely);
    this.acceleration = new Vector(0,0);
    this.mass = mass;
    this.createImage(radius);
    this.color = col;
};

//creates a uniformly colored sphere
Body.prototype.createImage = function (radius) {
    var geometry = new THREE.SphereGeometry( radius, 20, 20 );
    var material = new THREE.MeshBasicMaterial( { color: new THREE.Color(Math.random(),Math.random(),Math.random()) });
    this.image = new THREE.Mesh( new THREE.SphereGeometry( radius, 20, 20 ), material );
    /*Never modify a y-position of an image!!!*/
    this.image.position.set( this.position.x, 0, this.position.y );
    scene.add(this.image);
};

//wraps all methods that are run every step of the
//simulation
Body.prototype.run = function () {
    this.update();
    this.display();
};

//displays the body
Body.prototype.display = function () {
    this.image.position.set(this.position.x / scale * 500, 0, this.position.y / scale * 500);
};

//gets called for every step of the animation,
//updates the properties of the body
Body.prototype.update = function () {
    this.velocity.add(Vector.mult(this.acceleration, dT));
    this.position.add(Vector.mult(this.velocity, dT));
    this.acceleration.mult(0);
};

//a = F / m
Body.prototype.applyForce = function (force) {
    force.div(this.mass);
    this.acceleration.add(force);
};

//gets distance to another body
Body.prototype.getDistanceTo = function (body2) {
    return this.position.dist(body2.position);
};

//calculates the attraction force to another body
Body.prototype.calculateAttraction = function (body2) {
    var force = Vector.sub(body2.position,this.position);
    var distance = force.mag();
    force.normalize();
    var strength = (G * this.mass * body2.mass) / (distance * distance);
    force.mult(strength);
    return force;
};
/************************************************************/


/*Simulation class*/
/************************************************************/
function Simulation () {
    this.planets = [];
    this.run();
}

var createPlanet = function (x,y,velx,vely,mass,radius) {
    planets.push(new Body(x,y,velx,vely,mass,radius));
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


Simulation.prototype.run = function () {

    init();
    animate();

function init () {
		var container;
		container = document.createElement( 'div' );
		document.body.appendChild( container );

		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
		this.camera.position.z = 800;
                this.camera.position.y = 200;
                this.camera.rotation.x = -Math.PI/8;
                    

                var line_material = new THREE.LineBasicMaterial( { color: 0x3399ff } );

                createSpaceTime();
		var light, object;

		scene.add( new THREE.AmbientLight( 0x404040 ) );

		light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 0, 1, 0 );
		scene.add( light );

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
        render();
	function render() {
		this.renderer.render( scene, this.camera );

	}
}

};

var createSpaceTime = function () {
    var color = new THREE.LineBasicMaterial( { color: new THREE.Color(1,0,0) } );
    var floor = 0;
    var step = 25;
    for (var i = 0; i <= 40; i++ ) {
        var geometry = new THREE.Geometry();
        for (var j = 0; j<= 40; j++) {
            var sum = 0;
            for (var k = 0; k < planets.length; k++) {
            
                var dist = computeDistance(planets[k].position,[(i-20)*25,(j-20)*25]);
                if (dist < 200) {
                    sum -= 100/(Math.sqrt(dist));
                }
            }
            geometry.vertices.push( new THREE.Vector3( - 500 + i*step, sum, -500 + j*step ));
        }
        var line = new THREE.Line( geometry, color );
        lines.push(line);
        scene.add(line);
    }
};



var computeWarping = function () {
    var neighborhood = 3;
    //reset all to 0
    for (var i = 0; i < lines.length; i++) {
        for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
           scene.remove(lines[i]);
        }
    }
    createSpaceTime();
    //update all

    /*for (var i = 0; i < lines.length; i++) {
        for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
            lines[i].geometry.vertices[j].y = Math.random() * 10;
        }
    }*/

    
    /*for (var i=0; i<planets.length; i++) {
        var x = round25(planets[i].position.x/scale*500)/25;
        var y = round25(planets[i].position.y/scale*500)/25;

        for (var j = -neighborhood+x; j <= neighborhood+x; j++) {
            for (var k = -neighborhood+y; k <= neighborhood+y; k++) {
                if (j > -20 && k > -20 && j < 20 && k < 20) {
                    var weight = computeWeight(planets[i].position,[j*25,k*25]);
                    lines[j+20].geometry.vertices[k+20].y -= weight;
                    //console.log(weight);
                    console.log("Updated");
                }

            }
        }
    }
    for (var i = 0; i < lines.length; i++) {
        for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
            //lines[i].geometry.vertices[j].y = Math.random() * 10;
        }
    }*/
};

var computeDistance = function (positionPlanet,positionNode) {
    var dx = (positionPlanet.x/scale*500) - positionNode[0];
    var dy = (positionPlanet.y/scale*500) - positionNode[1];
    return Math.sqrt(dx*dx + dy*dy);
};

var createSpace = function () {

    var geometry = new THREE.Geometry();
    var floor = -75;
    var step = 25;
        for ( var i = 0; i <= 40; i++ ) {

                geometry.vertices.push( new THREE.Vector3( - 500, floor, i * step - (500) ) );
                geometry.vertices.push( new THREE.Vector3(   (500), floor, i * step - (500) ) );

                geometry.vertices.push( new THREE.Vector3( i * step - (500), floor, -500 ) );
                geometry.vertices.push( new THREE.Vector3( i * step - (500), floor,  500 ) );

        }
    return geometry;

};





//responds to change of window dimensions
Simulation.prototype.onWindowResize = function () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
};

Simulation.prototype.render = function () {
    this.renderer.render( scene, this.camera );
};
/******************************************************************/



/* script - "main fuction"*/
/******************************************************************/


var scene = new THREE.Scene();
var planets = [];


createPlanet(1.496e11, 0.000e00, 0.000e00, 2.980e04, 5.974e24, 20);
createPlanet(6.579e12, 0.000e00, 3.410e05, 0.000e00, 1.3055e22, 20);
createPlanet(5.790e10, 0.000e00, 0.000e00, 4.790e04, 3.302e23, 10);
createPlanet(0.000e00, 0.000e00, 0.000e00, 0.000e00, 1.989e30, 20);
createPlanet(1.082e11, 0.000e00, 0.000e00, 3.500e04, 4.869e24, 13)
createPlanet(3.59e13, 0.000e00,  -1.641e06, 0.000e00, 6.419e33, 10);
createPlanet(2.279e11, 0.000e00, 0.000e00, 2.410e04, 6.419e23, 20);
createPlanet(7.779e11, 0.000e00, 0.000e00, 1.307e04, 1.899e27, 30);
createPlanet(1.427e12, 0.000e00, 0.000e00, 9.639e03, 5.6846e26, 20)


var simulation = new Simulation();






