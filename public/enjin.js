(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//you can make a game with these functions alone
//however the others will help a lot
window.enjin = {};

enjin.Camera = require('./libs/camera'); //k
enjin.timer = require('./libs/timer');
enjin.State = require('./libs/state');
enjin.collision = require('./libs/collision'); //n
//enjin.network = require('./libs/network');

/**
 * Initialize necessary values for enjin
 * @param {Object} Canvas Canvas for game to be played on
 */
enjin.init = function(canvas) {
	enjin.version = "0.0.1";
	enjin.canvas = canvas;
	enjin.ctx = enjin.canvas.getContext("2d");
	enjin.delay = 1000/60;

	enjin.update = function(dt) {
		//default game
	}

	enjin.draw = function() {
		//default game
	}
}

/**
 * Call initial frame
 */
enjin.start = function() {
	if(typeof enjin.load === "function") {
		enjin.load();
	}
	if(typeof enjin.update === "function") {
		enjin.prev = performance.now();
		enjin.frameID = requestAnimFrame(enjin.loop);
	}
}

/**
 * Loop to be called by requestAnimFrame
 */
enjin.loop = function() { 
	enjin.now = performance.now();
	enjin.dt = (enjin.now - enjin.prev)/1000;
	enjin.prev = enjin.now;

	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	enjin.ctx.clearRect(0, 0, enjin.canvas.width, enjin.canvas.height)
	ctx.restore();

	enjin.update(enjin.dt);
	enjin.draw(enjin.dt);
	
	//this thing is pretty smart, it should use the monitors refresh rate as the fps
	enjin.frameID = requestAnimFrame(enjin.loop)
}

/**
 * Stop calling requestAnimFrame
 */
enjin.stop = function() {
	cancelAnimFrame(enjin.frameID);
}

window.requestAnimFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || window.mozRequestAnimationFrame 
    || window.oRequestAnimationFrame  
    || function(callback) { return window.setTimeout(callback, enjin.delay); }; 

window.cancelAnimFrame = window.cancelAnimationFrame
    || window.webkitCancelAnimationFrame 
    || window.msCancelAnimationFrame 
    || window.mozCancelAnimationFrame 
    || window.oCancelAnimationFrame 
    || function(id) { clearTimeout(id); };

window.performance.now = performance.now
	|| performance.webkitNow
	|| performance.msNow
	|| performance.mozNow
	|| function() { return Date.now() || +(new Date()); };
},{"./libs/camera":2,"./libs/collision":3,"./libs/state":4,"./libs/timer":5}],2:[function(require,module,exports){
/**
 * Create a new Camera instance
 * @param {Object} Params Params to start camera off with
 * @return {Object} A Camera Object with the given Params
 */
var Camera = function(params) {
	//Movement interpolators (for camera locking/windowing)
	this.smooth = {};

	this.x = params.x || 0;
	this.y = params.y || 0;
	this.scale = params.scale || 1;
	this.rotation  = params.rotation || 0;
}

/**
 * Apply Camera's positioning
 */
Camera.prototype.attach = function() {
	var centerX = enjin.canvas.width/(2*this.scale),
		centerY = enjin.canvas.height/(2*this.scale);

	enjin.ctx.save();
	enjin.ctx.scale(this.scale, this.scale);
	enjin.ctx.translate(centerX, centerY);
	enjin.ctx.rotate(this.rot);
	enjin.ctx.translate(-this.x, -this.y);
}

/**
 * Remove Camera's positioning
 */
Camera.prototype.remove = function() {
	//save and restore use a stack so it should be good
	enjin.ctx.restore();
}

/**
 * Move Camera to a specific coordinate
 * @param {Number} X X coordinate of Camera
 * @param {Number} Y Y coordinate of Camera
 */
Camera.prototype.moveTo = function(x, y) {
 	this.x = x;
 	this.y = y;
}

/**
 * Move Camera a certain distance
 * @param {Number} DX Distance to move in the X direction
 * @param {Number} DY Distance to move in the Y direction
 */
Camera.prototype.move = function(dx, dy) {
	this.x = this.x + dx;
	this.y = this.y + dy;
}

/**
 * Rotate Camera a certain amount in radians
 * @param {Number} Radians Amount to rotate in radians
 */
Camera.prototype.rotate = function(rad) {
	this.rotation = this.rotation + rad;
}

/**
 * Rotate Camera to a specific value
 * @param {Number} Radians Radians to rotate to
 */
Camera.prototype.rotateTo = function(rad) {
	this.rotation = rad;
}

/**
 * Scale Camera a certain amount
 * @param {Number} Scalar Number to multiply the Camera's scale by
 */
Camera.prototype.scale = function(scalar) {
	this.scale = this.scale * scalar;
}

/**
 * Scale Camera to a specific value
 * @param {Number} Scale Number to scale Camera to
 */
Camera.prototype.scaleTo = function(scale) {
	this.scale = scale;
}

/**
 * Convert Camera coordinates to Map coordinates
 * @param {Number} X X coordinate of camera you wish to convert
 * @param {Number} X Y coordinate of camera you wish to convert
 * @return {Object} X and Y value in Map coordinates
 */
Camera.prototype.toMapCoords = function(x, y) {
	x = (x - this.canvas.getWidth/2) / this.scale;
	y = (y - this.canvas.getHeight/2) / this.scale;

	var cos = Math.cos(-this.rotation),
		sin = Math.sin(-this.rotation);

	x = cos*x - sin*y;
	y = sin*x + cos*y;

	return {
		x: x+this.x,
		y: y+this.y
	}
}

/**
 * Convert Map coordinates to Camera coordinates
 * @param {Number} X X coordinate of Map you wish to convert
 * @param {Number} Y Y coordinate of Map you wish to convert
 * @return {Object} X and Y value in Camera coordinates
 */
Camera.prototype.toCameraCoords = function(x, y) {
	x = x - this.x;
	y = y - this.y;
	var cos = Math.cos(this.rotation),
		sin = Math.sin(this.rotation);

	x = cos*x - sin*y;
	y = sin*x + cos*y;

	return {
		x: x*this.scale + this.canvas.getWidth/2,
		y: y*this.scale + this.canvas.getHeight/2
	};
}

module.exports = Camera;
},{}],3:[function(require,module,exports){
//this checks for collisions and maybe returns data
//idk what SAT is but i think its needed...
var collision = {}

/**
 * Axis aligned bounding box collision check
 * @param {Number} X X coordinate of top left corner of first object
 * @param {Number} Y Y coordinate of top left corner of first object
 * @param {Number} Width Width of first object
 * @param {Number} Height Height of first object
 * @param {Number} X X coordinate of top left corner of second object
 * @param {Number} Y Y coordinate of top left corner of second object
 * @param {Number} Width Width of second object
 * @param {Number} Height Height of second object
 * @return {Boolean} Whether or not two rectangles have collided
 */
collision.AABB = function(x1, y1, w1, h1, x2, y2, w2, h2) {
	return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2);
}

/**
 * Axis aligned bounding box collision check using objects
 * @param {Object} Object1 First object with attributes x, y, width (or w), and height (or h)
 * @param {Object} Object2 Second object with attributes x, y, width (or w), and height (or h)
 * @return {Boolean} Whether or not two objects have collided
 */
collision.AABBObject = function(obj1, obj2) {
	return (obj1.x < obj2.x + (obj2.width || obj2.w) && obj1.x + (obj1.width || obj1.w) > obj2.x && obj1.y < obj2.y + (obj2.height || obj2.h) && (obj1.height || obj1.h) + obj1.y > obj2.y);
}

/**
 * Bounding circle collision check
 * @param {Number} X X coordinate of center of first object
 * @param {Number} Y Y coordinate of center of first object
 * @param {Number} Radius Radius of first object
 * @param {Number} X X coordinate of center of second object
 * @param {Number} Y Y coordinate of center of second object
 * @param {Number} Radius Radius of second object
 * @return {Boolean} Whether or not two circles have collided
 */
collision.circle = function(x1, y1, r1, x2, y2, r2) {
	return (x2-x1)^2 + (y1-y2)^2 <= (r1+r2)^2;
}

/**
 * Bounding circle collision check using objects
 * @param {Object} Object1 First object with attributes x, y, and radius (or r)
 * @param {Object} Object2 First object with attributes x, y, and radius (or r)
 * @return {Boolean} Whether or not two objects have collided
 */
collision.circle = function(obj1, obj2) {
	return (obj2.x-obj1.x)^2 + (obj1.y-obj2.y)^2 <= ((obj1.radius || obj1.r)+(obj2.radius || obj2.r))^2;
}

module.exports = collision;
},{}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
//all times are in ms
var Timer = {};

Timer.update = function() {
	
}

Timer.after = function(interval, func) {
	return window.setTimeout(func, interval);
};

Timer.every = function(interval, func) {
	return window.setInterval(func, interval);
};

Timer.clear = function(timer) {
	//kinda bodged but should still be fine
	window.clearTimeout(timer);
	window.clearInterval(timer);
};

module.exports = Timer;
},{}]},{},[1]);
