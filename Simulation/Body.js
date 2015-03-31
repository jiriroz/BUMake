
                     /* Body class */

/***********************************************************/
//Planet body
function Body (x, y, velx, vely, mass, radius, img, scene) {
    this.position = new THREE.Vector2(x,y);
    this.velocity = new THREE.Vector2(velx,vely);
    this.acceleration = new THREE.Vector2(0,0);
    this.mass = mass;
    this.createImage(radius, img, scene);
}

//creates a uniformly colored sphere
Body.prototype.createImage = function (radius, img, scene) {
    var map = THREE.ImageUtils.loadTexture(img);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;
    map.repeat.set(4,4);
    var geometry = new THREE.SphereGeometry( radius, 20, 20 );
    var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide });
    this.image = new THREE.Mesh( geometry , material );
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
    var accelScaled = new THREE.Vector2(this.acceleration.x,this.acceleration.y);
    accelScaled.multiplyScalar(dT);
    this.velocity.add(accelScaled);
    var velScaled = new THREE.Vector2(this.velocity.x,this.velocity.y);
    velScaled.multiplyScalar(dT);
    this.position.add(velScaled);
    this.acceleration.multiplyScalar(0);
};

//a = F / m
Body.prototype.applyForce = function (force) {
    force.divideScalar(this.mass);
    this.acceleration.add(force);
};

//gets distance to another body
Body.prototype.getDistanceTo = function (body2) {
    return this.position.distanceTo(body2.position);
};

//calculates the attraction force to another body
Body.prototype.calculateAttraction = function (body2) {
    var force = new THREE.Vector2(0,0);
    force.subVectors(body2.position,this.position);
    var distance = force.length();
    force.normalize();
    var strength = (G * this.mass * body2.mass) / (distance * distance);
    force.multiplyScalar(strength);
    return force;
};

