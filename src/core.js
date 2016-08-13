//you can make a game with these functions alone
//however the others will help a lot
window.enjin = {};

enjin.camera = require('./libs/camera'); //k
enjin.timer = require('./libs/timer');
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
	if(enjin.update) {
		enjin.prev = performance.now();
		enjin.frameID = requestAnimFrame(enjin.loop);
	}
}

/**
 * Loop to be called by requestAnimFrame
 */
enjin.loop = function() { 
	enjin.now = performance.now();
	enjin.dt = enjin.now - enjin.prev;
	enjin.prev = enjin.now;

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