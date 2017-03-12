var util = {}

util.random = function(max, min) {
	return Math.floor(Math.random() * (max - min)) + min;
}

util.randomDecimal = function(max, min) {
	return Math.random() * (max - min) + min;
}

util.toRadians = function(deg) {
	return deg * Math.PI / 180;
}

util.toDegrees = function(rad) {
  return rad * 180 / Math.PI;
}

module.exports = util;