//you can make a game with these functions alone
//however the others will help
//random dev thing to add: http://stackoverflow.com/questions/15313418/javascript-assert, for debugging
//if you do add ^ make sure it's not in minified releases.

window.enjin = {
	version: "0.0.1",
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

		enjin.update = function(dt) {
			//default game updating function
		}

		enjin.render = function(dt) {
			//default game rendering function
		}
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
enjin.timer = require('./libs/timer'); //kool
require('./libs/src');





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