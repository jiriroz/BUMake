var Gravity = Gravity || {};

/*************** Medium Class ***********/

Gravity.Medium = function(N) {
    this.size = N;
    this.segments = [];
    for (var i = 0; i < this.size; i++) {
        this.segments[i] = 0;
    }
}

Gravity.Medium.prototype.update() {
    for (var i = 1; i < this.size - 1; i++) {
        var avg = this.segments[i-1] + this.segments[i] + this.segments[i+1];
        avg /= 3;
        this.segments[i] = avg; 
    }
}

Gravity.Medium.prototype.ripple(index, weight) {
    this.segments[index] = weight;
}

/***************** Vector Class ***********/

Gravity.Vector = function(xp,yp,zp) {
    this.x = xp;
    this.y = yp;
    this.z = zp;
}

Gravity.Vector.prototype.copy = function() {
    return new Vector(this.x, this.y, this.z);
}

Gravity.Vector.prototype.sub = function(other) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
}

Gravity.Vector.sub = function(v1, v2) {
    var v3 = v1.copy();
    v3.sub(v2);
    return v3;
}

Gravity.Vector.prototype.add = function(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
}

Gravity.Vector.add = function(v1, v2) {
    var v3 = v1.copy();
    v3.add(v2);
    return v3;
}

Gravity.Vector.prototype.mult = function(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
}

Gravity.Vector.mult = function(v1, scalar) {
    var v3 = v1.copy();
    v3.mult(scalar);
    return v3;
}

Gravity.Vector.prototype.div = function(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
}

Gravity.Vector.div = function(v1, scalar) {
    var v3 = v1.copy();
    v3.div(scalar);
    return v3;
}

Gravity.Vector.prototype.mag = function() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this,z,2));
}

Gravity.Vector.prototype.normalize = function() {
    this.div(mag);
}

Gravity.Vector.dist = function(v1, v2) {
    var v3 = Gravity.Vector.sub(v2,v1);
    return v3.mag();    
}
