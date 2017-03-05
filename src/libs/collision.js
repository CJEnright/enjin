// Naive collisions
// If you're a nerd, maybe figure out hashmapping for EFFICIENT CODE
var collision = {}

/**
 * Axis aligned bounding box collision check
 * @param {Number} X X coordinate of top left corner of first object
 * @param {Number} Y Y coordinate of top left corner of first object
 * @param {Number} Width Width of first object
 * @param {Number} Height Height of first object
 * @param {Number} X X coordinate of top left corner of second object
 * @param {Number} Y Y coordinate of top left corner of second object
 * @param {Number} Width Width of second object
 * @param {Number} Height Height of second object
 * @return {Boolean} Whether or not two rectangles have collided
 */
collision.AABB = function(x1, y1, w1, h1, x2, y2, w2, h2) {
	return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2);
}

/**
 * Axis aligned bounding box collision check using objects
 * @param {Object} Object1 First object with attributes x, y, width (or w), and height (or h)
 * @param {Object} Object2 Second object with attributes x, y, width (or w), and height (or h)
 * @return {Boolean} Whether or not two objects have collided
 */
collision.AABBObject = function(obj1, obj2) {
	return (obj1.x < obj2.x + (obj2.width || obj2.w) && obj1.x + (obj1.width || obj1.w) > obj2.x && obj1.y < obj2.y + (obj2.height || obj2.h) && (obj1.height || obj1.h) + obj1.y > obj2.y);
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

/**
 * Bounding circle collision check using objects
 * @param {Object} Object1 First object with attributes x, y, and radius (or r)
 * @param {Object} Object2 First object with attributes x, y, and radius (or r)
 * @return {Boolean} Whether or not two objects have collided
 */
collision.circle = function(obj1, obj2) {
	return (obj2.x-obj1.x)^2 + (obj1.y-obj2.y)^2 <= ((obj1.radius || obj1.r)+(obj2.radius || obj2.r))^2;
}

module.exports = collision;