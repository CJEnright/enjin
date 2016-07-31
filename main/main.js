//this is the core, enjin can run using only this file if you want just a super minimal engine
//thats why there's stuff dealing with time not in the timer file
//any module you don't want to use comment out or delete and then build with "npm start"

//some modules (like tween) don't return an object but still need to be updated
//this is a list of those modules' update funcitons
enjin.moduleUpdates = [];

enjin.camera = require('./libs/camera'); //k
enjin.timer = require('./libs/timer'); //k
enjin.tween = require('./libs/tween'); //n
enjin.text = require('./libs/text'); //k
enjin.collision = require('./libs/collision'); //n
enjin.ecs = require('./libs/ecs'); 
//enjin.util = require('./libs/util'); 
//enjin.animation = require('./libs/animation');
//enjin.particle = require('./libs/particle');
//enjin.physics = require('./libs/physics');
//collision is just for collisions, physics is for dealing with collisions
//enjin.network = require('./libs/network');
//enjin.noise = require('./libs/nosie');
//enjin.shader = require('./libs/shader');


/**
 * Initialize Enjin and start if a state was given
 * @param {Object} canvas
 */
enjin.init = function(canvas) {
	enjin.canvas = canvas;
	enjin.ctx = canvas.getContext("2d");

	//time between interval calls in ms
	enjin.updateInterval = 1;
}

/**
 * Initialize and Start looping over 
 */
enjin.start = function() {
	enjin.load();

	//initial lastUpdate so dt isn't undefined
	enjin.lastUpdate = Date.now();

	enjin.interval = window.setInterval(function() {
		//update dt
		enjin.now = Date.now();
	    enjin.dt = (enjin.now - enjin.lastUpdate) / 1000;
	    enjin.lastUpdate = enjin.now;

	    //reset transformations so it always clears correctly
	    ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	    enjin.ctx.clearRect(0, 0, enjin.canvas.width, enjin.canvas.height)
	    ctx.restore();

	    //update modules
	    for(var i = 0; i < enjing.moduleUpdates.length; i++) {
	    	enjin.moduleUpdates[i](dt);
	    }

	    //main update method
	    enjin.update(enjin.dt);
	    //main draw
	    enjin.draw();
	}, enjin.updateInterval);
}

/**
 * Stop Enjin's loop
 */
enjin.stop = function() {
	window.clearInterval(enjin.interval);
}

enjin.resume = function() {
	//fill this in later
}

enjin._nothing = function() {
	//not much here
}