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
Camera.prototype.attach = function(ctx) {
	var centerX = enjin.width/(2*this.scale),
	var centerY = enjin.height/(2*this.scale);

	ctx.save();
	ctx.scale(this.scale, this.scale);
	ctx.translate(centerX, centerY);
	ctx.rotate(this.rot);
	ctx.translate(-this.x, -this.y);
}

/**
 * Detach Camera's positioning
 */
Camera.prototype.detach = function(ctx) {
	//save and restore use a stack so it should be good
	ctx.restore();
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
 * Scale Camera a certain amount
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

Camera.prototype.scaleToPoint = function(scalar, pointx, pointy) {
	var goodx = (app.canvas.width/2 - e.offsetX)
	var goody = app.canvas.height/2 - e.offsetY
	var movex = (goodx/(app.camera.scale * scalar) - goodx/app.camera.scale);
	var movey = (goody/(app.camera.scale * scalar) - goody/app.camera.scale);
	app.camera.move(movex, movey)
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