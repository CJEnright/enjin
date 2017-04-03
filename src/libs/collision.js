// Naive collisions, as in inefficient
// For better results look into spatial hashing or quadtrees
var collision = {}

/**
 * Axis aligned bounding box collision check
 * @param {Number} X1 X coordinate of top left corner of first object
 * @param {Number} Y1 Y coordinate of top left corner of first object
 * @param {Number} Width Width of first object
 * @param {Number} Height Height of first object
 * @param {Number} X2 X coordinate of top left corner of second object
 * @param {Number} Y2 Y coordinate of top left corner of second object
 * @param {Number} Width2 Width of second object
 * @param {Number} Height2 Height of second object
 * @return {Boolean} Whether or not two rectangles have collided
 */
collision.AABB = function(x1, y1, w1, h1, x2, y2, w2, h2) {
	return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2);
}

/**
 * Bounding circle collision check
 * @param {Number} X X coordinate of center of first object
 * @param {Number} Y Y coordinate of center of first object
 * @param {Number} Radius Radius of first object
 * @param {Number} X X coordinate of center of second object
 * @param {Number} Y Y coordinate of center of second object
 * @param {Number} Radius Radius of second object
 * @return {Boolean} Whether or not two circles have collided
 */
collision.circle = function(x1, y1, r1, x2, y2, r2) {
	return (x2-x1)^2 + (y1-y2)^2 <= (r1+r2)^2;
}

module.exports = collision;