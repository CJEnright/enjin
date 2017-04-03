/**
 * Create a new Camera instance
 * @param {Number} X X coordinate of camera center
 * @param {Number} Y Y coordinate of camera center
 * @param {Number} Scale Scale of camera
 * @param {Number} Rotation Rotation of camera (in radians)
 * @return {Object} A Camera Object with the given Params
 */
var Camera = function(x, y, scale, rotation) {
	if(!enjin.ctx) {
		console.error("enjin needs a rendering context before it can have a Camera, did you enjin.atach(canvas)?");
		return;
	}
	//everything needed for default camera
	this.x = x || 0;
	this.y = y || 0;
	this.scale = scale || 1;
	this.rotation = rotation || 0;
	this.layers = {
		"main": new this.Layer(1)
	};
}

/**
 * Create a new Layer instance
 * @param {Number} TranslationScale Scalar to mulitply translation by
 */
Camera.prototype.Layer = function(translationScale) {
	this.translationScale = translationScale;
}

/**
 * Apply Layer's positioning (Don't call this directly, use Camera.apply("LayerName"))
 * @param {Object} Camera Camera whose positioning we should apply
 */
Camera.prototype.Layer.prototype.apply = function(camera) {
	var centerX = enjin.width/(2*camera.scale);
	var centerY = enjin.height/(2*camera.scale);

	enjin.ctx.save();
	enjin.ctx.scale(camera.scale, camera.scale);
	enjin.ctx.translate(centerX, centerY);
	enjin.ctx.rotate(camera.rot);
	enjin.ctx.translate(-camera.x * this.translationScale, -camera.y * this.translationScale);
};

/**
 * Create a new Camera Layer the easy way
 * @param {String} LayerName Name of layer
 * 2param {Number} TranslationScale Scalar to mulitply translation by
 */
Camera.prototype.newLayer = function(layerName, translationScale) {
	this.layers[layerName] = new this.Layer(translationScale);
};

/**
 * Apply Camera's positioning
 * @param {String} LayerName Name of Layer to apply
 */
Camera.prototype.apply = function(layerName) {
	if(layerName) { // If we're given a specific layer to draw
		this.layers[layerName].apply(this);
	}
	else { // Otherwise just draw the main layer
		this.layers["main"].apply(this);
	}
}

/**
 * Remove Camera's positioning
 */
Camera.prototype.remove = function() {
	// Remove is a pretty generic call and so it doesn't nee to be the Camera.Layer class
	enjin.ctx.restore();
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
 * Scale Camera by a certain amount
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

/**
 * Scale Camera by a certain amount to a specific point
 * @param {Number} Scalar Number to multiply the Camera's scale by
 * @param {Number} PointX X coordinate to scale to
 * @param {Number} PointY Y coordinate to scale to
 */
Camera.prototype.scaleToPoint = function(scalar, pointx, pointy) {
	var relCenterX = enjin.canvas.width/2 - pointx
	var relCenterY = enjin.canvas.height/2 - pointy
	var moveX = (relCenterX/(this.scale * scalar) - relCenterX/this.scale);
	var moveY = (relCenterY/(this.scale * scalar) - relCenterY/this.scale);
	this.move(moveX, moveY);
	this.scaleBy(scalar);
}

/**
 * Convert Camera coordinates to Map coordinates
 * @param {Number} X X coordinate of camera you want to convert
 * @param {Number} X Y coordinate of camera you want to convert
 * @return {Object} X and Y value in Map coordinates
 */
Camera.prototype.toMapCoords = function(x, y) {
	x = (x - this.canvas.getWidth/2) / this.scale;
	y = (y - this.canvas.getHeight/2) / this.scale;

	var cos = Math.cos(-this.rotation);
	var sin = Math.sin(-this.rotation);

	x = cos*x - sin*y;
	y = sin*x + cos*y;

	return {
		x: x+this.x,
		y: y+this.y
	}
}

/**
 * Convert Map coordinates to Camera coordinates
 * @param {Number} X X coordinate of Map you want to convert
 * @param {Number} Y Y coordinate of Map you want to convert
 * @return {Object} X and Y value in Camera coordinates
 */
Camera.prototype.toCameraCoords = function(x, y) {
	x = x - this.x;
	y = y - this.y;
	var cos = Math.cos(this.rotation);
	var sin = Math.sin(this.rotation);

	x = cos*x - sin*y;
	y = sin*x + cos*y;

	return {
		x: x*this.scale + this.canvas.getWidth/2,
		y: y*this.scale + this.canvas.getHeight/2
	}
}

module.exports = Camera;