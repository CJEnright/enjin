(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.enjin = {
	version: "0.2508",
	//60 fps
	defaultDelay: 1000/60,
	
	/**
	 * Attach the enjin instance to a canvas
	 * @param {Object} Canvas Canvas for game to be played on
	 */
	attach: function(canvas) {
		this.canvas = canvas;
		this.width = canvas.width || 0;
		this.height = canvas.height || 0;
		this.ctx = this.canvas.getContext("2d");

		// Create the default state (basically trying to prevent errors incase user is stupid)
		this.currentState = {
			update: function(dt) {},
			render: function(dt) {}
		};
	},

	/**
	 * Request initial frame and begin looping
	 */
	start: function() {
		enjin.previous = performance.now();
		enjin.frameID = requestAnimFrame(enjin.loop);

		// Let the currentState know we're starting (resuming)
		if(enjin.currentState.resume) {
			enjin.currentState.resume();
		}
	},

	//A potentially better way to loop is here http://gameprogrammingpatterns.com/game-loop.html#play-catch-up
	/**
	 * Loop called by requestAnimFrame, finds dt then calls updates and renders
	 */
	loop: function() { 
		// Can't use "this" here because it's being called in the window's context
		enjin.now = performance.now();
		enjin.dt = (enjin.now - enjin.previous)/1000 || 0;
		enjin.previous = enjin.now;

		enjin.timer.updateAll(enjin.dt);

		enjin.ctx.save(); //save the current canvas drawing "settings"
		enjin.ctx.setTransform(1, 0, 0, 1, 0, 0); //reset all canvas transforms so it clears correctly
		enjin.ctx.clearRect(0, 0, enjin.width, enjin.height);
		enjin.ctx.restore(); //restore the previous canvas drawing "settings"

		enjin.currentState.update(enjin.dt);
		enjin.currentState.render(enjin.dt);
		
		//this thing is pretty smart, it should use the monitors refresh rate as the fps
		enjin.frameID = requestAnimFrame(enjin.loop);
	},

	/**
	 * Stop calling requestAnimFrame, stopping the game loop
	 */
	stop: function() {
		cancelAnimFrame(this.frameID);

		// Let the currentState know we're stopping (pausing)
		if(enjin.currentState.pause) {
			enjin.currentState.pause();
		}
	},

	watchForResize: function(func) {
		window.onresize = func;
	}
};


enjin.Camera = require('./libs/camera'); //kool
enjin.timer = require('./libs/timer'); //not kool
enjin.collision = require('./libs/collision'); //kool
enjin.state = require('./libs/state');





/* ----------[ POLLYFILLS ]---------- */

window.requestAnimFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || window.mozRequestAnimationFrame 
    || window.oRequestAnimationFrame  
    || function(callback) { return window.setTimeout(callback, enjin.defaultDelay); }; 

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
},{"./libs/camera":2,"./libs/collision":3,"./libs/state":4,"./libs/timer":5}],2:[function(require,module,exports){
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
	var centerX = enjin.width/(2*this.scale);
	var centerY = enjin.height/(2*this.scale);

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
 * Scale Camera by a certain amount
 * @param {Number} Scalar Number to multiply the Camera's scale by
 */
Camera.prototype.scaleBy = function(scalar) {
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
 * Scale Camera by a certain amount to a specific point
 * @param {Number} Scalar Number to multiply the Camera's scale by
 * @param {Number} PointX X coordinate to scale to
 * @param {Number} PointY Y coordinate to scale to
 */
Camera.prototype.scaleToPoint = function(scalar, pointx, pointy) {
	var goodx = enjin.canvas.width/2 - pointx
	var goody = enjin.canvas.height/2 - pointy
	var movex = (goodx/(this.scale * scalar) - goodx/this.scale);
	var movey = (goody/(this.scale * scalar) - goody/this.scale);
	this.move(movex, movey)
	this.scaleBy(scalar)
};

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
// Naive collisions
// If you're a nerd, maybe figure out hashmapping for EFFICIENT CODE
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
var state = {};

state.stack = [];

/**
 * Switch from the currentState to a new state
 * @param {Object} NewState The new state object to switch to
 */ 
state.switch = function(newState) {
	if(enjin.currentState.leave) {
		enjin.currentState.leave();
	}

	if(newState.enter) {
		newState.enter();
	}

	enjin.currentState = newState;
}

/**
 * Switch to a new state and add it to the stack
 * @param {Object} NewState The new state object to switch to
 */	
state.push = function(newState) {
	this.stack.push(newState);
	enjin.currentState = this.stack[this.stack.length-1];
}

/**
 * Remove the current state from the stack and switch to the previous one
 */
state.pop = function() {
	this.stack.pop();
	enjin.currentState = this.stack[this.stack.length-1];
}

module.exports = state;
},{}],5:[function(require,module,exports){
var timer = {};

/**
 * Tracks time elapsed and calls callback functions
 * @param {Number} Duration How long in seconds the timer will last for
 * @param {Function} Callback Function to call once the update is finished
 * @param {Function} UpdateCallback Function to call every time the Timer is updated
 */
timer.Timer = function(duration, callback, updateCallback) {
	this.started = Date.now();
	this.duration = duration;
	this.elapsed = 0;
	this.isDone = false;
	this.callback = callback || function() {};
	this.updateCallback = updateCallback || function() {};
}

/**
 * update a timer and see if it's done
 * @param {Number} DeltaTime Time since last update
 */
timer.Timer.prototype.update = function(dt) {
	this.elapsed += dt;
	this.updateCallback(dt);

	if(this.elapsed >= this.duration) {
		this.stop(true);
	}
}

/**
 * Stop a Timer from executing, and optionally call its callback function
 * @param {Number} DeltaTime Time since last update, if present it means we want to call the Timer's callback 
 */
timer.Timer.prototype.stop = function(dt) {
	if(dt) {
		this.callback(dt);
	}
	// Set variables to cleanly delete (mainly stop calling functions)
	this.callback = function() {};
	this.updateCallback = function() {};
	this.isDone = true; // Mark as finished

	// Being able to self delete would be best practice, but you can't do that in js :/
}

timer.timers = [];

/**
 * Helper function to update all timers, delete them if they're done
 * @param {Number} DeltaTime Time since last update
 */
timer.updateAll = function(dt) {
	for(var i=0; i<this.timers.length; i++) {
		this.timers[i].update(dt);

		if(this.timers[i].isDone) {
			this.timers.splice(i, 1); // Delete the finished Timer
		}
	}
}

/**
 * Call a function after a given time in seconds
 * @param {Number} Time How long to wait in seconds before calling the function
 * @param {Function} Callback Function to call once the time has passed
 */
timer.after = function(length, callback) {
	var timerObject = new this.Timer(length, callback);
	this.timers.push(timerObject);
	return timerObject;
}

/**
 * Call a function every frame for a certain period of time
 * @param {Number} Duration How long the update function should be called for in seconds
 * @param {Function} UpdateCallback Function to call every frame
 * @param {Function} Callback Function to call once the duration has elapsed
 * @return {Object} Timer The Timer object that was just made
 */
timer.during = function(duration, updateCallback, callback) {
	var timerObject = new this.Timer(duration, callback, updateCallback); 
	this.timers.push(timerObject);
	return timerObject;
}

// TWEENING!!! heads up, confusing ish ahead
/**
 * Change an object's value over time in a specific way
 * @param {Number} Duration Time in seconds the transition should take
 * @param {Object} Object Object we should be watching
 * @param {Object} Target Endstate of object we want to reach
 * @param {String} Method Tweening method to use
 * @param {Function} Callback Function to call once we're done
 */
timer.tween = function(duration, object, target, method, callback) {
	// Tweening is a lot like using the during method
	// If method is a function use that, otherwise assume a string and figure out what the user is saying
	var updateMethod = typeof(method) === "function" ? method : this._getUpdateFunction(method);

	var updateCallback = function(dt) {
		this.s = updateMethod(Math.min(1, this.elapsed/this.duration));
		this.ds = this.s - (this.prevS || 0);
		this.prevS = this.s;

		for(prop in target) {
			object[prop] += this.deltas[prop] * this.ds;
		}
	}

	var timerObject = new this.Timer(duration, callback, updateCallback);
	timerObject.deltas = {}

	// Set initial delta properties for multiplying by later
	for(prop in target) { 
		timerObject.deltas[prop] = target[prop] - object[prop];
	}

	this.timers.push(timerObject);
	return timerObject;
}

// Helper function to get update method
// this could be a lot cleaner (esp the in out part)
timer._getUpdateFunction = function(methodString) {
	// This is a lot of balogna that's p confusing.  dw about it
	if(this.tweenMethods[methodString]) {
		return this.tweenMethods[methodString];
	}
	// These are esp stupid and could be simplified really quickly (but y tho)
	else if(methodString.substr(0, 7) === "in-out-") {
		var method = this.tweenMethods[methodString.substr(7, methodString.length)];
		return this.tweenMethods.chain(method, this.tweenMethods.out(method));
	}
	else if(methodString.substr(0, 7) === "out-in-") {
		var method = this.tweenMethods[methodString.substr(7, methodString.length)];
		return this.tweenMethods.chain(this.tweenMethods.out(method), method);
	}
	else if(methodString.substr(0, 4) === "out-") {
		var method = this.tweenMethods[methodString.substr(4, methodString.length)];
		return this.tweenMethods.out(method);
	}
	else if(methodString.substr(0, 3) === "in-") {
		var method = this.tweenMethods[methodString.substr(3, methodString.length)];
		return method;
	}
}

timer.tweenMethods = {
	linear: function(s) { return s },
	quad: function(s) { return s*s },
	cubic: function(s) { return s*s*s },
	sin: function(s) { return 1-Math.cos(s*Math.PI/2) },
	expo: function(s) { return Math.pow(2, 10*(s-1)) },
	circ: function(s) { return 1 - Math.sqrt(1-s*s) },
	out: function(f) {
		// Reverses a function
		return function(s) {
			return 1 - f(1-s) 
		}
	},
	chain: function(f1, f2) {
		return function(s) { 
			return (s < .5 && f1(2*s) || 1 + f2(2*s-1)) * .5
		}
	}
}


module.exports = timer;

/*
so player = {x: 0, y:0}
tween player {x: 12 y: 6}
*/
},{}]},{},[1]);
