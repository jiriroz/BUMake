
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
//var scene = new THREE.Scene();

//var Gravity = Gravity || {};

/***************** Vector Class ***********/

var Vector = function(xp,yp,zp) {
    this.x = xp;
    this.y = yp;
    this.z = zp;
};

Vector.prototype.copy = function() {
    return new Vector(this.x, this.y, this.z);
};

Vector.prototype.sub = function(other) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
};

Vector.sub = function(v1, v2) {
    var v3 = v1.copy();
    v3.sub(v2);
    return v3;
};

Vector.prototype.add = function(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
};

Vector.add = function(v1, v2) {
    var v3 = v1.copy();
    v3.add(v2);
    return v3;
};

Vector.prototype.mult = function(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
};

Vector.mult = function(v1, scalar) {
    var v3 = v1.copy();
    v3.mult(scalar);
    return v3;
};

Vector.prototype.div = function(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
};

Vector.div = function(v1, scalar) {
    var v3 = v1.copy();
    v3.div(scalar);
    return v3;
};

Vector.prototype.mag = function() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this,z,2));
};

Vector.prototype.normalize = function() {
    this.div(mag);
};

Vector.dist = function(v1, v2) {
    var v3 = Vector.sub(v2,v1);
    return v3.mag();    
};
/**********************************************************/

/* Body class */
/***********************************************************/
var G = 6.67e-11;

//Planet body
var Body = function (x, y, velx, vely, mass, radius) {
    this.position = new Vector(x,y) ;
    this.velocity = new Vector(velx,vely);
    this.acceleration = new Vector(0,0);
    this.mass = mass;
    this.createImage(radius);
};

//creates a uniformly colored sphere
Body.prototype.createImage = function (radius) {
    var geometry = new THREE.SphereGeometry( radius, 20, 20 );
    var material = new THREE.MeshBasicMaterial( { color: 0x3399ff });
    this.image = new THREE.Mesh( new THREE.SphereGeometry( 75, 20, 20 ), material );
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
    this.image.position.set(this.position.x, 0, this.position.y);
};

//gets called for every step of the animation,
//updates the properties of the body
Body.prototype.update = function () {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
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
    var force = Vector.sub(object.position,this.position);
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
    //this.init();
    //this.animate();
    this.run();
}

var createPlanet = function (x,y,velx,vely,mass,radius) {
    planets.push(new Body(x,y,velx,vely,mass,radius));
};


var simulationStep = function () {
    //N-Body simulation
    for (var i=0; i < planets.length; i++) {
        for (var j=0; j<planets.length; j++) {
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
		this.camera.position.z = 600;

                var line_material = new THREE.LineBasicMaterial( { color: 0x303030 } ),
                geometry = new THREE.Geometry(),
                floor = -75, step = 25;

                for ( var i = 0; i <= 40; i ++ ) {

                    geometry.vertices.push( new THREE.Vector3( - 500, floor, i * step - 500 ) );
                    geometry.vertices.push( new THREE.Vector3(   500, floor, i * step - 500 ) );

                    geometry.vertices.push( new THREE.Vector3( i * step - 500, floor, -500 ) );
                    geometry.vertices.push( new THREE.Vector3( i * step - 500, floor,  500 ) );

                }


                var line = new THREE.Line( geometry, line_material, THREE.LinePieces );
                scene.add( line );

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
		this.simulationStep();
                this.camera.rotation.y += 0.02;
		render();
	function render() {
		this.renderer.render( scene, this.camera );

	}
}

};


//responds to change of window dimensions
Simulation.prototype.onWindowResize = function () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
};

Simulation.prototype.render = function () {
    //var timer = Date.now() * 0.0001;
    this.renderer.render( scene, this.camera );
};
/******************************************************************/



/* script - "main fuction"*/
/******************************************************************/


var scene = new THREE.Scene();
var planets = [];
createPlanet(0,0,0,0,1,75);

document.addEventListener("DOMContentLoaded", function() {
    var simulation = new Simulation();
});

//simulation.createPlanet(0,0,0,0,1,75);
//simulation.animate();






