//this checks for collisions and maybe returns data
//idk what SAT is but i think its needed...
var collision = {}

collision.AABB = function(x1, y1, w1, h1, x2, y2, w2, h2) {
	return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2);
}

collision.circle = function(x1, y1, r1, x2, y2, r2) {
	return (x2-x1)^2 + (y1-y2)^2 <= (r1+r2)^2
}

collision.OBB = function(x1, y1, w1, h1, r1, x2, y2, w2, h2, r2) {
	return;
}

module.exports = collision;