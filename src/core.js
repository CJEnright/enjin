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

	/**
	 * Helper for watching window resizing
	 */
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