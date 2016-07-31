//all times are in ms
var Timer = {};

Timer.after = function(interval, func) {
	return window.setTimeout(func, interval);
};

Timer.every = function(interval, func) {
	return window.setInterval(func, interval);
};

Timer.clear = function(timer) {
	//kinda bodged but should still be fine
	window.clearTimeout(timer);
	window.clearInterval(timer);
};

module.exports = Timer;