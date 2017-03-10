var util = {}

util.random = function(max, min) {
	return Math.floor(Math.random*(max-min)+min);
}

module.exports = util;