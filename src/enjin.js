function enjin(canvas) {
	this.version = '0.1'
	this.canvas = canvas;
	this.ctx = this.canvas.getContext("2d");
	this.delay = 1000/60;

	//timing
	this.frameID;
	this.prev = 0;
	this.now = 0;
	this.dt = 0;

	//entities
	this.entities = [];
	
	//performance


	//resource manager
};

enjin.prototype.getCanvas = function() {
	console.log(this);
	console.log(this.canvas);
	return this.canvas;
}

enjin.prototype.loop = function() {
	this.now = performance.now();
	this.dt = (this.now - this.prev)/1000;
	this.prev = this.now;

	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	ctx.restore();

	this.update(this.dt);
	this.draw(this.dt);
	
	var that = this;
	this.frameID = requestAnimFrame( function() { that.loop(); } );
};

enjin.prototype.start = function() {
	this.prev = performance.now();
	
	var that = this;
	this.frameID = requestAnimFrame( function() { that.loop(); } );
};

enjin.prototype.stop = function() {
	this.cancelAnimFrame(enjin.frameID);
};


//		----------[Camera]----------		//

/**
 * Create a new Camera instance
 * @param {Object} Params Params to start camera off with
 * @return {Object} A Camera Object with the given Params
 */
enjin.prototype.newCamera = function(params) {
	return new this.Camera(this.canvas, params);
}

/**
 * Create a new Camera instance
 * @param {Object} Canvas The canvas to draw onto
 * @param {Object} Params Params to start camera off with
 * @return {Object} A Camera Object with the given Params
 */
enjin.prototype.Camera = function(canvas, params) {
	this.canvas = canvas;
	this.ctx = this.canvas.getContext("2d");
	this.x = params.x || 0;
	this.y = params.y || 0;
	this.scale = params.scale || 1;
	this.rotation  = params.rotation || 0;
}

/**
 * Apply Camera's positioning
 */
enjin.prototype.Camera.prototype.attach = function() {
	var centerX = this.canvas.width/(2*this.scale),
		centerY = this.canvas.height/(2*this.scale);

	this.ctx.save();
	this.ctx.scale(this.scale, this.scale);
	this.ctx.translate(centerX, centerY);
	this.ctx.rotate(this.rot);
	this.ctx.translate(-this.x, -this.y);
}

/**
 * Remove Camera's positioning
 */
enjin.prototype.Camera.prototype.remove = function() {
	//save and restore use a stack so it should be good
	this.ctx.restore();
}

/**
 * Move Camera to a specific coordinate
 * @param {Number} X X coordinate of Camera
 * @param {Number} Y Y coordinate of Camera
 */
enjin.prototype.Camera.prototype.moveTo = function(x, y) {
 	this.x = x;
 	this.y = y;
}

/**
 * Move Camera a certain distance
 * @param {Number} DX Distance to move in the X direction
 * @param {Number} DY Distance to move in the Y direction
 */
enjin.prototype.Camera.prototype.move = function(dx, dy) {
	this.x = this.x + dx;
	this.y = this.y + dy;
}

/**
 * Rotate Camera a certain amount in radians
 * @param {Number} Radians Amount to rotate in radians
 */
enjin.prototype.Camera.prototype.rotate = function(rad) {
	this.rotation = this.rotation + rad;
}

/**
 * Rotate Camera to a specific value
 * @param {Number} Radians Radians to rotate to
 */
enjin.prototype.Camera.prototype.rotateTo = function(rad) {
	this.rotation = rad;
}

/**
 * Scale Camera a certain amount
 * @param {Number} Scalar Number to multiply the Camera's scale by
 */
enjin.prototype.Camera.prototype.scale = function(scalar) {
	this.scale = this.scale * scalar;
}

/**
 * Scale Camera to a specific value
 * @param {Number} Scale Number to scale Camera to
 */
enjin.prototype.Camera.prototype.scaleTo = function(scale) {
	this.scale = scale;
}

/**
 * Convert Camera coordinates to Map coordinates
 * @param {Number} X X coordinate of camera you wish to convert
 * @param {Number} X Y coordinate of camera you wish to convert
 * @return {Object} X and Y value in Map coordinates
 */
enjin.prototype.Camera.prototype.toMapCoords = function(x, y) {
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
enjin.prototype.Camera.prototype.toCameraCoords = function(x, y) {
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






//polyfills
window.requestAnimFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || window.mozRequestAnimationFrame 
    || window.oRequestAnimationFrame  
    || function(callback) { return window.setTimeout(callback, 16.667); }; 

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









































