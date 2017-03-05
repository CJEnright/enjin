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