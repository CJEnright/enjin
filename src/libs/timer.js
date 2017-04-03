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
		this.scalar = updateMethod(Math.min(1, this.elapsed/this.duration));
		this.ds = this.scalar - (this.prevS || 0);
		this.prevScalar = this.scalar;

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
	linear: function(scalar) { 
		return scalar 
	},
	quad: function(scalar) { 
		return scalar*scalar 
	},
	cubic: function(scalar) { 
		return scalar*scalar*scalar 
	},
	sin: function(scalar) { 
		return 1-Math.cos(scalar*Math.PI/2) 
	},
	expo: function(scalar) { 
		return Math.pow(2, 10*(scalar-1)) 
	},
	circ: function(scalar) { 
		return 1 - Math.sqrt(1-scalar*scalar) 
	},
	out: function(f) {
		return function(scalar) {
			return 1 - f(1-scalar) 
		}
	}
}


module.exports = timer;