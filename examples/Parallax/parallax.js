/* Parallax example for github.com/CJEnright/enjin */

// Baseplate code
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

enjin.watchForResize(function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

enjin.attach(canvas);

/* Parallax example */

// Create the camera and all its layers for Parallaxing
var camera = new enjin.Camera(canvas.width/2, canvas.height/2)
camera.newLayer("behind1", 0.75);
camera.newLayer("behind2", 0.6);
camera.newLayer("behind3", 0.4);
camera.newLayer("behind4", 0.25);

// Initial mouse values
var mouseX = 0;
var mouseY = 0;

// Actual deltas
var dx = 0;
var dy = 0;

// Watch for mouse drags and update dx, dy accordingly
canvas.onmousedown = function(e) {
	mouseX = e.offsetX;
	mouseY = e.offsetY;
	canvas.onmousemove = function(e) {
		dx = mouseX - e.offsetX;
		dy = mouseY - e.offsetY;

		camera.move(dx, dy);

		mouseX = e.offsetX;
		mouseY = e.offsetY;
	}
}

canvas.onmouseup = function() {
	canvas.onmousemove = function() {}
}

var gameState = {
	enter: function() {},
	update: function(dt) {
		// Translate based on distance mouse traveled (in mousemove func)
	},
	render: function() {
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

		// Draw layers and what they contain
		camera.apply("behind4");
		ctx.fillRect(0, 10, 75, 75);
		ctx.fillRect(20, 400, 75, 75);
		ctx.fillRect(320, 300, 75, 75);
		ctx.fillRect(-70, 200, 75, 75);
		ctx.fillRect(-250, 200, 75, 75);
		camera.remove();

		camera.apply("behind3");
		ctx.fillRect(300, 270, 75, 75);
		ctx.fillRect(690, 80, 75, 75);
		ctx.fillRect(890, 540, 75, 75);
		ctx.fillRect(450, 256, 75, 75);
		camera.remove();

		camera.apply("behind2");
		ctx.fillRect(0, 250, 75, 75);
		ctx.fillRect(200, 400, 75, 75);
		ctx.fillRect(-200, 600, 75, 75);
		ctx.fillRect(1200, 768, 75, 75);
		camera.remove();

		camera.apply("behind1");
		ctx.fillRect(20, 40, 75, 75);
		ctx.fillRect(200, 400, 75, 75);
		ctx.fillRect(600, 200, 75, 75);
		ctx.fillRect(1200, 768, 75, 75);
		camera.remove();
	}
}

// Switch to that state
enjin.state.switch(gameState);

// Start enjin looping
enjin.start()