//using x=x+y because its faster is most cases
//are get methods really needed?
var Camera = function(params) {
	//Movement interpolators (for camera locking/windowing)
	this.smooth = {};

	this.x = params.x || 0;
	this.y = params.y || 0;
	this.scale = params.scale || 1;
	this.rotation  = params.rotation || 0;
}

Camera.prototype.focus = function() {
	var centerX = enjin.canvas.width/(2*this.scale),
		centerY = enjin.canvas.height/(2*this.scale);

	enjin.ctx.save();
	enjin.ctx.scale(this.scale, this.scale);
	enjin.ctx.translate(centerX, centerY);
	enjin.ctx.rotate(this.rot);
	enjin.ctx.translate(-this.x, -this.y);
}

Camera.prototype.unfocus = function() {
	//save and restore use a stack so it should be good
	enjin.ctx.restore();
}

Camera.prototype.lookAt = function(x, y) {
 	this.x = x;
 	this.y = y;
}

Camera.prototype.moveTo = function(dx, dy) {
	this.x = this.x + dx;
	this.y = this.y + dy;
}

Camera.prototype.getPosition = function() {
	return {
		x: this.x, 
		y: this.y
	};
}

Camera.prototype.getX = function() {
	return this.x;
}

Camera.prototype.getY = function() {
	return this.y;
}

Camera.prototype.rotate = function(rad) {
	this.rotation = this.rotation + rad;
}

Camera.prototype.rotateTo = function(rad) {
	this.rotation = rad;
}

Camera.prototype.getRotation = function(rad) {
	return this.rotation;
}

Camera.prototype.scale = function(scalar) {
	this.scale = this.scale * scalar;
}

Camera.prototype.scaleTo = function(scale) {
	this.scale = scale;
}

Camera.prototype.getScale = function(scale) {
	return this.scale;
}

Camera.prototype.toWorldCoords = function(x, y) {
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