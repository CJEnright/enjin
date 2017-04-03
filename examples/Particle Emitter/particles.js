/* Tweening example for github.com/CJEnright/enjin */

// Baseplate code
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth/2;
canvas.height = window.innerHeight/2;

enjin.watchForResize(function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

enjin.attach(canvas);

// Not yet finished (soon though :))