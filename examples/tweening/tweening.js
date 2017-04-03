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

/* Tweening example */

var inOrOut = "in-"
var tweenFunction = "linear"
var tweenMethod = inOrOut + tweenFunction;
var currentTween;

var tweenable = {
	x: enjin.width/10,
	y: enjin.height/10
}

// Functions for watching HTML changes
function inOutChange() {
	currentTween.stop();
	inOrOut = document.getElementById('inOutSelect').value;
	tweenMethod = inOrOut + tweenFunction;
	tweenFrom();
}

function tweenMethodChange() {
	currentTween.stop();
	tweenFunction = document.getElementById('tweenMethodSelect').value;
	tweenMethod = inOrOut + tweenFunction;
	tweenFrom();
}

// Our state
var gameState = {
	enter: function() {},
	update: function(dt) {
		// All timer and game updating is taken care of by enjin
	},

	render: function() {
		// Draw the rectangle we'll be moving around
		ctx.fillRect(tweenable.x, tweenable.y, 10, 10);
	}
}

// Switch to that state
enjin.state.switch(gameState);

// Functions to create our tweens from one point to another
function tweenTo() {
	currentTween = enjin.timer.tween(3, tweenable, {x: enjin.width/10, y: enjin.height/10}, tweenMethod, function() {
		tweenFrom();
	});
}

function tweenFrom() {
	currentTween = enjin.timer.tween(3, tweenable, {x: enjin.width/1.1, y: enjin.height/1.1}, tweenMethod, function() {
		tweenTo();
	});
}

// Start tweening process
tweenFrom();

// Start enjin looping
enjin.start();