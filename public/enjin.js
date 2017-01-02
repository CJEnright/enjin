(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//you can make a game with these functions alone
//however the others will help
//random dev thing to add: http://stackoverflow.com/questions/15313418/javascript-assert, for debugging
//if you do add ^ make sure it's not in minified releases.
//the enjin namespace needs to be kept open

window.enjin = {
	version: "0.0.1",
	//60 fps
	delay: 1000/60,
	
	/**
	 * Attach the enjin instance to a canvas
	 * @param {Object} Canvas Canvas for game to be played on
	 */
	attatch: function(canvas) {
		enjin.canvas = canvas;
		enjin.width = canvas.width || 0;
		enjin.height = canvas.height || 0;
		enjin.ctx = enjin.canvas.getContext("2d");

		enjin.update = function(dt) {}

		enjin.render = function(dt) {}
	},

	/**
	 * Request initial frame and begin looping
	 */
	start: function() {
		if(typeof enjin.load === "function") {
			enjin.load();
		}
		if(typeof enjin.update === "function") {
			enjin.prev = performance.now();
			enjin.frameID = requestAnimFrame(enjin.loop);
		}
	},

	//A potentially better way to loop is here http://gameprogrammingpatterns.com/game-loop.html#play-catch-up
	//but it is a little bulkier and this way should be fine.
	/**
	 * Loop to be called by requestAnimFrame
	 */
	loop: function() { 
		enjin.now = performance.now();
		enjin.dt = (enjin.now - enjin.previous)/1000 || 0;
		enjin.previous = enjin.now;

		ctx.save(); //save the current canvas drawing "settings"
		ctx.setTransform(1, 0, 0, 1, 0, 0); //reset all canvas transforms so it clears correctly
		enjin.ctx.clearRect(0, 0, enjin.width, enjin.height);
		ctx.restore(); //restore the previous canvas drawing "settings"

		enjin.update(enjin.dt);
		enjin.render(enjin.dt);
		
		//this thing is pretty smart, it should use the monitors refresh rate as the fps
		enjin.frameID = requestAnimFrame(enjin.loop)
	},

	/**
	 * Stop calling requestAnimFrame which stops the game loop
	 */
	stop: function() {
		cancelAnimFrame(enjin.frameID);
	}
};


enjin.Camera = require('./libs/camera'); //kool
enjin.timer = require('./libs/timer'); //not kool
enjin.collision = require('./libs/collision'); //kool





/* ----------[ POLLYFILLS ]---------- */
//with fallbacks!
//sorted by popularity, maybe sort by performance of browser (worst comes first)

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







/*


*/
},{"./libs/camera":2,"./libs/collision":3,"./libs/timer":4}],2:[function(require,module,exports){
//some notes:
//attatch and detach should have diff names
//try to find a way to potentially allow pic in pic
//make it look less like u stole it

/**
 * Create a new Camera instance
 * @param {Object} Params Params to start camera off with
 * @return {Object} A Camera Object with the given Params
 */
var Camera = function(params) {
	//everything needed for default camera
	this.x = params.x || 0;
	this.y = params.y || 0;
	this.scale = params.scale || 1;
	this.rotation = params.rotation || 0;
}

/**
 * Apply Camera's positioning
 */
Camera.prototype.attach = function() {
	var centerX = enjin.width/(2*this.scale),
		centerY = enjin.height/(2*this.scale);

	enjin.ctx.save();
	enjin.ctx.scale(this.scale, this.scale);
	enjin.ctx.translate(centerX, centerY);
	enjin.ctx.rotate(this.rot);
	enjin.ctx.translate(-this.x, -this.y);
}

/**
 * Detach Camera's positioning
 */
Camera.prototype.detach = function() {
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
var timer = {};

//basically different verbage
//oh spit actually should be based off the ticks of games

timer.after = function(interval, func) {
	return window.setTimeout(func, interval);
};

timer.every = function(interval, func) {
	return window.setInterval(func, interval);
};

timer.clear = function(timer) {
	window.clearTimeout(timer);
	window.clearInterval(timer);
};

module.exports = timer;
},{}]},{},[1]);
