/*

Simulation class

*/

function Simulation () {
    this.width = 500;
    this.step = 15;
    this.lineCount = this.width * 2 / this.step;
    this.scene = new THREE.Scene();
    this.planets = [];
    this.lines = [];
    this.init();
    this.animate();
}

//Initaliazes the scene
Simulation.prototype.init = function () {
    this.setupCamera();
    this.setupLight();
    this.setupRenderer();
    this.addToHTML();
    this.createSpaceTime("X");
    this.createSpaceTime("Z");
};

Simulation.prototype.setupCamera = function () {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.position.z = 800;
    this.camera.position.y = 200;
    this.camera.rotation.x = -Math.PI/8;
};

Simulation.prototype.setupLight = function () {
    this.scene.add( new THREE.AmbientLight(0x404040));
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 1, 0);
    this.scene.add(light);
};

Simulation.prototype.setupRenderer = function () {
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
};

Simulation.prototype.addToHTML = function () {
    var container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(this.renderer.domElement);
    window.addEventListener('resize', this.onWindowResize, false);
};

Simulation.prototype.animate = function () {
    this.simulationStep();
    this.computeWarping();
    this.renderer.render(this.scene, this.camera);
    //need to bind this to access the prototype
    window.requestAnimationFrame(this.animate.bind(this));
};

Simulation.prototype.simulationStep = function () {
    //Gravity calculation
    for (var i = 0; i < this.planets.length; i++) {
        for (var j = 0; j < this.planets.length; j++) {
            if (i != j) {
                var gravity = this.planets[i].calculateAttraction(this.planets[j]);
                this.planets[i].applyForce(gravity);
            }
        }
    }
    //position updates
    for (var i=0; i < this.planets.length; i++) {
        this.planets[i].run();
    }
};

Simulation.prototype.computeWarping = function () {
    //update spacetime
    this.updateSpaceTime();
};

Simulation.prototype.createSpaceTime = function (direction) {
    direction = direction.toLowerCase();
    var color = new THREE.LineBasicMaterial({ color: new THREE.Color(1,0.2,0.2) });
    for (var i = 0; i <= this.lineCount; i++ ) {
        var geometry = new THREE.Geometry();
        for (var j = 0; j<= this.lineCount; j++) {
            if (direction === "x") {
                geometry.vertices.push( new THREE.Vector3( -this.width + j*this.step, 0, -this.width + i*this.step ));
            } else if (direction === "z") {
                geometry.vertices.push( new THREE.Vector3( -this.width + i*this.step, 0, -this.width + j*this.step ));
            }
        }
        var line = new THREE.Line(geometry, color);
        this.lines.push(line);
        this.scene.add(line);
    }
};

Simulation.prototype.updateSpaceTime = function () {
    for (var i = 0; i < this.lines.length; i++) {
        for (var j = 0; j < this.lines[i].geometry.vertices.length; j++) {
            this.lines[i].geometry.vertices[j].y = 0;
            for (var k = 0; k < this.planets.length; k++) {
                var position3 = this.lines[i].geometry.vertices[j];
                var nodePosition = new THREE.Vector2(position3.x,position3.z);
                var x = this.planets[k].position.x/scale * this.width;
                var y = this.planets[k].position.y/scale * this.width;
                var mass = this.planets[k].mass;
                var planetPosition = new THREE.Vector2(x,y);
                var distance = planetPosition.distanceTo(nodePosition);
                distance = limit(distance,5,10000);
                distance = distance / this.width * scale;

                //actual
                //var field = 10000 * G * mass / Math.pow(distance, 2);

                //nice-looking
                var field = 1000 * Math.pow(mass,1/3) / Math.pow(distance, 1);

                //limit the depth so that we don't receive unreasonably
                //deep gravity wells (looks bad).
                field = limit(field,0,800);
                this.lines[i].geometry.verticesNeedUpdate = true;
                this.lines[i].geometry.vertices[j].y -= field;
            }
        }
    }
};

Simulation.prototype.createPlanet = function (x,y,velx,vely,mass,radius,img) {
    this.planets.push(new Body(x,y,velx,vely,mass,radius,img,this.scene));
};

//responds to change of window dimensions
Simulation.prototype.onWindowResize = function () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
};

/*
Helpers
*/

var limit = function (num, min, max) {
    if (min > max) {
        throw "Limit function error: Lower limit greater than upper imit.";
    }
    if (num > max) {
        return max;
    } else if (num < min) {
        return min;
    }
    return num;
};
