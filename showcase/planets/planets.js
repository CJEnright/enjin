/* Planets showcase for github.com/CJEnright/enjin */

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

var spaceObjects = [];

function SpaceObject(name, radius, vel, distToParent, parentName, color) {
	this.name = name;
	this.parentName = parentName;
	this.angle = Math.random() * (Math.PI * 2);
	this.x = canvas.width/2 + Math.sin(this.angle) * this.distToParent;
	this.y = canvas.height/2 + Math.cos(this.angle) * this.distToParent;
	this.vel = vel;
	this.radius = radius;
	this.distToParent = distToParent;
	this.color = color
}

SpaceObject.prototype.update = function(dt) {
	if(this.parentName) { // It's a moon
		this.angle += this.vel*dt;
		this.x = spaceObjects[this.parentName].x + Math.sin(this.angle) * this.distToParent;
		this.y = spaceObjects[this.parentName].y + Math.cos(this.angle) * this.distToParent;

	}
	else { // It's a planet
		this.angle += this.vel*dt;
		this.x = canvas.width/2  + Math.sin(this.angle) * this.distToParent;
		this.y = canvas.height/2 + Math.cos(this.angle) * this.distToParent;
	}
}

SpaceObject.prototype.draw = function() {
	ctx.save();

	if(this.parentName) {
		//draw orbit path
		ctx.beginPath();
		ctx.arc(spaceObjects[this.parentName].x, spaceObjects[this.parentName].y, this.distToParent, 0, 2*Math.PI, false);
		ctx.stroke();
	}
	else {
		ctx.beginPath();
		ctx.arc(canvas.width/2, canvas.height/2, this.distToParent, 0, 2*Math.PI, false);
		ctx.stroke();
	}

	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius + 5, 0, 2*Math.PI, false);
	ctx.fillStyle = "#fff";
	ctx.fill();

	//drawing object
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
	ctx.fillStyle = this.color;
	ctx.fill();

	ctx.restore();
}

// For panning around
canvas.onmousedown = function(e) {
	mouseX = e.offsetX;
	mouseY = e.offsetY;
	canvas.onmousemove = function(e) {
		dx = (mouseX - e.offsetX) * (1/camera.scale);
		dy = (mouseY - e.offsetY) * (1/camera.scale);

		camera.move(dx, dy);

		mouseX = e.offsetX;
		mouseY = e.offsetY;
	}
}

canvas.onmouseup = function() {
	canvas.onmousemove = function() {}
}

canvas.onmousewheel = function(e) {
	delta = e.wheelDelta/120
	var factor = Math.pow(1.1, delta);
	camera.scaleToPoint(factor, e.offsetX, e.offsetY);
}

var camera = new enjin.Camera(canvas.width/2, canvas.height/2);

// Our state
var gameState = {
	enter: function() {
		// init objects
		spaceObjects['sun'] = new SpaceObject('Sun', 75, 0, 0, null, '#f39c12');

		spaceObjects['mercury'] = new SpaceObject('Mercury', 10, .15, 125, 'sun', '#bdc3c7');

		spaceObjects['venus'] = new SpaceObject('Venus', 20, .12, 275, 'sun', '#8e44ad');

		spaceObjects['earth'] = new SpaceObject('Earth', 20, .11, 425, 'sun', '#3498db');
		spaceObjects['moon'] = new SpaceObject('Moon', 6.6667, .51, 75, 'earth', '#bdc3c7');

		spaceObjects['mars'] = new SpaceObject('Mars', 17.5, .1, 575, 'sun', '#e74c3c');
		spaceObjects['phobos'] = new SpaceObject('Phobos', 7.5, .5, 60, 'mars', '#bdc3c7');
		spaceObjects['deimos'] = new SpaceObject('Deimos', 5, .5, 90, 'mars', '#95a5a6');


		spaceObjects['jupiter'] = new SpaceObject('Jupiter', 35, .09, 1000, 'sun', '#f1c40f');
		spaceObjects['io'] = new SpaceObject('Io', 10, .5, 60, 'neptune', '#bdc3c7');
		spaceObjects['europa'] = new SpaceObject('Europa', 10, .5, 90, 'jupiter', '#95a5a6');
		spaceObjects['ganymede'] = new SpaceObject('Ganymede', 10, .5, 120, 'jupiter', '#7f8c8d');
		spaceObjects['callisto'] = new SpaceObject('Callisto', 10, .5, 150, 'jupiter', '#bdc3c7');

		// I know I know I'm missing some moons but this is just a test
		spaceObjects['saturn'] = new SpaceObject('Saturn', 30, .08, 1200, 'sun', '#d35400');

		spaceObjects['uranus'] = new SpaceObject('Uranus', 25, .07, 1400, 'sun', '#2ecc71');

		spaceObjects['neptune'] = new SpaceObject('Neptune', 24, .06, 1600, 'sun', '#2980b9');
	},
	update: function(dt) {
		var keys = Object.keys(spaceObjects);

		for(var i = 0; i < keys.length; i++) {
			spaceObjects[keys[i]].update(dt);
		}
	},

	render: function() {
		var keys = Object.keys(spaceObjects);

		camera.apply();
		for(var i = 0; i < keys.length; i++) {
			spaceObjects[keys[i]].draw();
		}
		camera.remove();
	}
}

// Switch to that state
enjin.state.switch(gameState);

enjin.start()