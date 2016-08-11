function enjin(canvas) {
	this.canvas = canvas;
	this.ctx = canvas.getRenderingContext("2d");
}

enjin.prototype.version = "0.0.1";

/*		----------[Essential Packages]----------		*/
enjin.prototype.timer = require('./libs/timer');
//do i want a state thing? 
enjin.prototype.state = require('./libs/state');

/*		----------[Non-Essential Packages]----------		*/
enjin.prototype.camera = require('./libs/camera'); //k
enjin.prototype.collision = require('./libs/collision'); //n

/*
General notes:
enjin should be createable
window.enjin = enjin?

 window.getTime = (function() {
 73     var origin;
 74     if (window.performance && window.performance.now) {
 75         origin = Date.now();
 76         return function() {
 77             return origin + window.performance.now();
 78         };
 79     } else if (window.performance && window.performance.webkitNow) {
 80         origin = Date.now();
 81         return function() {
 82             return origin + window.performance.webkitNow();
 83         };
 84     } else {
 85         return Date.now;
 86     }
 87 }());


  window.requestAnimationFrame =
 91     window.requestAnimationFrame ||
 92     window.mozRequestAnimationFrame ||
 93     window.webkitRequestAnimationFrame ||
 94     window.msRequestAnimationFrame ||
 95     (function() {
 96         var lastTime = window.getTime();
 97         var frame = 1000 / 60;
 98         return function(func) {
 99             var _id = setTimeout(function() {
100                 lastTime = window.getTime();
101                 func(lastTime);
102             }, Math.max(0, lastTime + frame - window.getTime()));
103             return _id;
104         };
105     }());
*/