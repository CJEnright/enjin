var timer = {};

//basically different verbage
//oh spit actually should be based off the ticks of games

timer.after = function(interval, func) {
	return window.setTimeout(func, interval);
};

timer.every = function(interval, func) {
	return window.setInterval(func, interval);
};

timer.clear = function(timer) {
	window.clearTimeout(timer);
	window.clearInterval(timer);
};

module.exports = timer;