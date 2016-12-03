var timer = {};

timer.after = function(interval, func) {
	return window.setTimeout(func, interval);
};

timer.every = function(interval, func) {
	return window.setInterval(func, interval);
};

timer.clear = function(timer) {
	//kinda bodged but should still be fine
	window.clearTimeout(timer);
	window.clearInterval(timer);
};

module.exports = timer;