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