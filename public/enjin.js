(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Enjin, a small JavaScript game engine */

// enjin namespace does need to be reserved
window.enjin = {
	version: "0.2.5",
	//60 fps, only used if requestAnimFrame isn't supported
	defaultDelay: 1000/60,
	
	/**
	 * Attach the enjin instance to a canvas
	 * @param {Object} Canvas Canvas for game to be played on
	 */
	attach: function(canvas) {
		enjin.canvas = canvas;
		enjin.width = canvas.width || 0;
		enjin.height = canvas.height || 0;
		enjin.ctx = enjin.canvas.getContext("2d");

		// Create the default state (basically trying to prevent errors)
		enjin.currentState = {
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
		if(enjin.currentState.start) {
			enjin.currentState.start();
		}
	},

	/**
	 * Loop called by requestAnimFrame, finds dt then calls updates and renders
	 */
	loop: function() { 
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
		
		//this thing is pretty smart, it should use the monitor's refresh rate as the fps
		enjin.frameID = requestAnimFrame(enjin.loop);
	},

	/**
	 * Stop calling requestAnimFrame, stopping the game loop
	 */
	stop: function() {
		cancelAnimFrame(this.frameID);

		// Let the currentState know we're stopping (pausing)
		if(enjin.currentState.stop) {
			enjin.currentState.stop();
		}
	},

	/**
	 * Helper for watching window resizing
	 * @param {Function} Callback Function to call when the window changes size
	 */
	watchForResize: function(func) {
		window.onresize = func;
	}
};

// Library requires
enjin.util = require('./libs/util');
enjin.Camera = require('./libs/camera');
enjin.timer = require('./libs/timer');
enjin.collision = require('./libs/collision');
enjin.state = require('./libs/state');
enjin.particle = require('./libs/particle');





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
},{"./libs/camera":2,"./libs/collision":3,"./libs/particle":4,"./libs/state":5,"./libs/timer":6,"./libs/util":7}],2:[function(require,module,exports){
/**
 * Create a new Camera instance
 * @param {Number} X X coordinate of camera center
 * @param {Number} Y Y coordinate of camera center
 * @param {Number} Scale Scale of camera
 * @param {Number} Rotation Rotation of camera (in radians)
 * @return {Object} A Camera Object with the given Params
 */
var Camera = function(x, y, scale, rotation) {
	if(!enjin.ctx) {
		console.error("enjin needs a rendering context before it can have a Camera, did you enjin.atach(canvas)?");
		return;
	}
	//everything needed for default camera
	this.x = x || 0;
	this.y = y || 0;
	this.scale = scale || 1;
	this.rotation = rotation || 0;
	this.layers = {
		"main": new this.Layer(1)
	};
}

/**
 * Create a new Layer instance
 * @param {Number} TranslationScale Scalar to mulitply translation by
 */
Camera.prototype.Layer = function(translationScale) {
	this.translationScale = translationScale;
}

/**
 * Apply Layer's positioning (Don't call this directly, use Camera.apply("LayerName"))
 * @param {Object} Camera Camera whose positioning we should apply
 */
Camera.prototype.Layer.prototype.apply = function(camera) {
	var centerX = enjin.width/(2*camera.scale);
	var centerY = enjin.height/(2*camera.scale);

	enjin.ctx.save();
	enjin.ctx.scale(camera.scale, camera.scale);
	enjin.ctx.translate(centerX, centerY);
	enjin.ctx.rotate(camera.rot);
	enjin.ctx.translate(-camera.x * this.translationScale, -camera.y * this.translationScale);
};

/**
 * Create a new Camera Layer the easy way
 * @param {String} LayerName Name of layer
 * 2param {Number} TranslationScale Scalar to mulitply translation by
 */
Camera.prototype.newLayer = function(layerName, translationScale) {
	this.layers[layerName] = new this.Layer(translationScale);
};

/**
 * Apply Camera's positioning
 * @param {String} LayerName Name of Layer to apply
 */
Camera.prototype.apply = function(layerName) {
	if(layerName) { // If we're given a specific layer to draw
		this.layers[layerName].apply(this);
	}
	else { // Otherwise just draw the main layer
		this.layers["main"].apply(this);
	}
}

/**
 * Remove Camera's positioning
 */
Camera.prototype.remove = function() {
	// Remove is a pretty generic call and so it doesn't nee to be the Camera.Layer class
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
	var relCenterX = enjin.canvas.width/2 - pointx
	var relCenterY = enjin.canvas.height/2 - pointy
	var moveX = (relCenterX/(this.scale * scalar) - relCenterX/this.scale);
	var moveY = (relCenterY/(this.scale * scalar) - relCenterY/this.scale);
	this.move(moveX, moveY);
	this.scaleBy(scalar);
}

/**
 * Convert Camera coordinates to Map coordinates
 * @param {Number} X X coordinate of camera you want to convert
 * @param {Number} X Y coordinate of camera you want to convert
 * @return {Object} X and Y value in Map coordinates
 */
Camera.prototype.toMapCoords = function(x, y) {
	x = (x - this.canvas.getWidth/2) / this.scale;
	y = (y - this.canvas.getHeight/2) / this.scale;

	var cos = Math.cos(-this.rotation);
	var sin = Math.sin(-this.rotation);

	x = cos*x - sin*y;
	y = sin*x + cos*y;

	return {
		x: x+this.x,
		y: y+this.y
	}
}

/**
 * Convert Map coordinates to Camera coordinates
 * @param {Number} X X coordinate of Map you want to convert
 * @param {Number} Y Y coordinate of Map you want to convert
 * @return {Object} X and Y value in Camera coordinates
 */
Camera.prototype.toCameraCoords = function(x, y) {
	x = x - this.x;
	y = y - this.y;
	var cos = Math.cos(this.rotation);
	var sin = Math.sin(this.rotation);

	x = cos*x - sin*y;
	y = sin*x + cos*y;

	return {
		x: x*this.scale + this.canvas.getWidth/2,
		y: y*this.scale + this.canvas.getHeight/2
	}
}

module.exports = Camera;
},{}],3:[function(require,module,exports){
// Naive collisions, as in inefficient
// For better results look into spatial hashing or quadtrees
var collision = {}

/**
 * Axis aligned bounding box collision check
 * @param {Number} X1 X coordinate of top left corner of first object
 * @param {Number} Y1 Y coordinate of top left corner of first object
 * @param {Number} Width Width of first object
 * @param {Number} Height Height of first object
 * @param {Number} X2 X coordinate of top left corner of second object
 * @param {Number} Y2 Y coordinate of top left corner of second object
 * @param {Number} Width2 Width of second object
 * @param {Number} Height2 Height of second object
 * @return {Boolean} Whether or not two rectangles have collided
 */
collision.AABB = function(x1, y1, w1, h1, x2, y2, w2, h2) {
	return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2);
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

module.exports = collision;
},{}],4:[function(require,module,exports){
var particle = {};

/**
 * Creates a particle to be spawned by an Emitter
 * @param {Object} Options Object with options you need (look at source for all availible)
 */
particle.Particle = function(options) {
	// If we're passed an update function use that
	if(options.update) {
		this.updateFunc = options.update;
	}
	else {
		this.lifeTimeVariance = options.lifeTimeVariance || 0;
		this.lifeTime = (options.lifeTime || options.life || 5) + (options.lifeTime || options.life || 5) * enjin.util.randomDecimal(-this.lifeTimeVariance, this.lifeTimeVariance);
		this.isAlive = true;
		this.elapsedTime = 0;

		this.direction = enjin.util.randomDecimal(options.mindirection, options.maxdirection);
		this.directionCos = Math.cos(this.direction);
		this.directionSin = Math.sin(this.direction);

		// Linear position
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.velx = (options.velx || options.vel || 0) * this.directionCos;
		this.vely = (options.vely || options.vel || 0) * this.directionSin;
		this.velVariance = options.velVariance || options.variance || 0.005;
		this.accelx = (options.accelx || options.accel || 0) * this.directionCos;
		this.accely = (options.accely || options.accel || 0) * this.directionSin;
		this.accelVariance = options.accelVariance || options.variance || 0.005;
	}

	// Drawing
	this.drawFunc = options.draw || function(ctx) { ctx.fillRect(this.x, this.y, 10, 10); }
}

/**
 * Update a Particle's position
 * @param {Number} DeltaTime Time since last update
 */
particle.Particle.prototype.update = function(dt) {
	this.accelx += this.accelx * enjin.util.randomDecimal(-this.accelVariance, this.accelVariance);
	this.accely += this.accely * enjin.util.randomDecimal(-this.accelVariance, this.accelVariance);
	this.velx += this.accelx * dt;
	this.vely += this.accely * dt;
	this.velx += this.velx * enjin.util.randomDecimal(-this.velVariance, this.velVariance);
	this.vely += this.vely * enjin.util.randomDecimal(-this.velVariance, this.velVariance);
	this.x += this.velx * dt;
	this.y += this.vely * dt;

	this.elapsedTime += dt;
	if(this.elapsedTime >= this.lifeTime) {
		this.isAlive = false;
	}
}

/**
 * Draw a single particle
 */
particle.Particle.prototype.draw = function() {
	this.drawFunc(enjin.ctx);
}

/**
 * Creates an Emitter to spawn Particles
 * @param {Number} X X coordinate to spawn particles at
 * @param {Number} Y Y coordinate to spawn particles at
 * @param {Object} ParticleOptions Particle options to spawn particle with
 * @param {Number} Direction The angle to send the particles off at
 * @param {Number} Spread Angle of spread for the particles
 */
particle.Emitter = function(x, y, particleOptions, maxAlive, spawnRate, direction, spread) {
	this.x = x;
	this.y = y;

	this.maxAlive = maxAlive;
	this.aliveParticles = [];
	this.spawnRate = 1 / (spawnRate || this.maxAlive / (particleOptions.lifeTime || particleOptions.life || 5));
	this.timeSinceLastSpawn = 0;

	this.particleOptions = particleOptions;
	this.particleOptions.x = x;
	this.particleOptions.y = y;

	this.direction = direction || 0;
	this.spread = spread || Math.PI;
	this.particleOptions.mindirection = this.direction - this.spread / 2;
	this.particleOptions.maxdirection = this.direction + this.spread / 2;
}

/**
 * Update an Emitter's particles
 * @param {Number} DeltaTime Time since last update
 */
particle.Emitter.prototype.update = function(dt) {
	this.timeSinceLastSpawn += dt;

	// Update position and kill
	for(var i=0; i<this.aliveParticles.length; i++) {
		this.aliveParticles[i].update(dt);
		
		if(!this.aliveParticles[i].isAlive) {
			this.aliveParticles.splice(i, 1);
		}
	}	

	// Spawn new Particles
	while(this.timeSinceLastSpawn > this.spawnRate && this.aliveParticles.length < this.maxAlive) {
		this.aliveParticles.push(new enjin.particle.Particle(this.particleOptions));
		this.timeSinceLastSpawn -= this.spawnRate;
	}
}

/**
 * Draw an Emitter's particles
 */
particle.Emitter.prototype.draw = function() {
	for(var i=0; i<this.aliveParticles.length; i++) {
		this.aliveParticles[i].draw();
	}
}

// A pulse is a single "burst" of particles
/**
 * Creates a pulse to spawn a group of particles
 * @param {Number} X X coordinate to spawn particles at
 * @param {Number} Y Y coordinate to spawn particles at
 * @param {Object} ParticleOptions Particle options to spawn particle with
 * @param {Number} NumberToSpawn Total number of particles to spawn
 * @param {Number} Direction The angle to send the particles off at
 * @param {Number} Spread Angle of spread for the particles
 */
particle.Pulse = function(x, y, particleOptions, numberToSpawn, direction, spread) {
	this.x = x;
	this.y = y;

	this.numberToSpawn = numberToSpawn;
	this.particles = [];

	this.particleOptions = particleOptions;
	this.particleOptions.x = x;
	this.particleOptions.y = y;

	this.direction = direction || 0;
	this.spread = spread || Math.PI;
	this.particleOptions.mindirection = this.direction - this.spread / 2;
	this.particleOptions.maxdirection = this.direction + this.spread / 2;

	// Init particles
	for(var i=0; i<this.numberToSpawn; i++) {
		this.particles.push(new enjin.particle.Particle(this.particleOptions));
	}
}

/**
 * Update a Pulse's particles
 * @param {Number} DeltaTime Time since last update
 */
particle.Pulse.prototype.update = function(dt) {
	for(var i=0; i<this.particles.length; i++) {
		this.particles[i].update(dt);

		if(!this.particles[i].isAlive) {
			this.particles.splice(i, 1);
		}
	}
}

/**
 * Draw an Pulse's particles
 */
particle.Pulse.prototype.draw = function() {
	for(var i=0; i<this.particles.length; i++) {
		this.particles[i].draw();
	}
}


// N.B. While you can make particles yourself, I'd reccomend using the library calls instead.
module.exports = particle;

},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
}

// Users either create their own Timers, or use methods below
// If they do the latter, they created Timers will be put in this array
timer.timers = [];

/**
 * Helper function called internally to update all timers and delete them if they're done
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
 * @param {Number} Delay How long to wait in seconds before calling the function
 * @param {Function} Callback Function to call once the time has passed
 */
timer.after = function(delay, callback) {
	var timerObject = new this.Timer(delay, callback);
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

/* TWEENING */

/**
 * Change an object's value over time in a specific way
 * @param {Number} Duration Time in seconds the transition should take
 * @param {Object} Object Object we should be tweening
 * @param {Object} Target Endstate of object we want to reach
 * @param {String} Method Tweening method to use (or make custom with a function)
 * @param {Function} Callback Function to call once we're done
 */
timer.tween = function(duration, object, target, method, callback) {
	// Tweening is a lot like using the during method
	// If method is a function use that, otherwise assume a string and figure out what the user is saying
	var updateMethod = typeof(method) === "function" ? method : this.__getUpdateFunction(method);

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

// Functions based on HUMP's tweening methods, can be found here: https://github.com/vrld/hump
// Helper function to get update method
// Don't exposed to generated docs
timer.__getUpdateFunction = function(methodString) {
	if(this.tweenMethods[methodString]) {
		return this.tweenMethods[methodString];
	}
	else if(methodString.substr(0, 7) === "in-out-") {
		var method = this.tweenMethods[methodString.substr(7, methodString.length)];
		return this.tweenMethods.chain(method, this.tweenMethods.out(method));
	}
	else if(methodString.substr(0, 7) === "out-in-") {
		var method = this.tweenMethods[methodString.substr(7, methodString.length)];
		return this.tweenMethods.chain(this.tweenMethods.out(method), method);
	}
	else if(methodString.substr(0, 3) === "in-") {
		var newMethodString = methodString.substr(3, methodString.length);
		return this.__getUpdateFunction(newMethodString);
	}
	else if(methodString.substr(0, 4) === "out-") {
		var newMethodString = methodString.substr(4, methodString.length);
		return this.tweenMethods.out(this.__getUpdateFunction(newMethodString));
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
},{}],7:[function(require,module,exports){
var util = {}

util.random = function(max, min) {
	return Math.floor(Math.random() * (max - min)) + min;
}

util.randomDecimal = function(max, min) {
	return Math.random() * (max - min) + min;
}

util.toRadians = function(deg) {
	return deg * Math.PI / 180;
}

util.toDegrees = function(rad) {
  return rad * 180 / Math.PI;
}

module.exports = util;
},{}]},{},[1]);
