var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

enjin.watchForResize(function(e) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
})

enjin.attach(canvas);

var player2 = {
	x: 10, 
	y: 10,
	speed: 45
};

var player = {
	x: 20, 
	y: 20,
	speedx: 75,
	speedy: 50
};


var background = new Image();
background.src="http://www.strandedsoft.com/contenidos/uploads/2015/03/Captura-de-pantalla-2015-03-09-a-las-21.17.30.png";


var camera = new enjin.Camera({
	x:player.x,
	y:player.y
});

/*
var partydude = new enjin.particle.Emitter(50, 50, {
	//accel: 2,
	vel: 45,
	accely: -9.8,
	velVariance: 0.05,
	lifeTime: 2
}, 25);
*/

var gameState = {
	update: function(dt) {
		//player.x += Math.random() * player.speedx * dt;
		//player.y += Math.random() * player.speedy * dt;

		player2.x += Math.random() * player.speedx * dt;
		player2.y += Math.random() * player.speedy * dt;
		partydude.update(dt);

		//camera.moveTo(player2.x, player2.y);
	},

	render: function() {
		camera.attach();

		ctx.drawImage(background, 0, 0); 
		ctx.fillRect(player.x, player.y, 10, 10);
		ctx.fillRect(player2.x, player2.y, 10, 10);
		partydude.draw();

		camera.detach();
	}
}

enjin.state.switch(gameState);

//timer testing

enjin.timer.during(1.5, function(dt) {
	//console.log(dt);
}, function() {
	console.log("dogs are done");
})

enjin.timer.tween(2, player, {x: 120, y: 320}, "in-out-quad", function() {
	enjin.timer.tween(2, player, {x: 0, y: 0}, "in-out-quad", function() {
		enjin.timer.tween(2, player, {x: 120, y: 320}, "in-out-quad")
	})
});


//start looping
enjin.start();


/*var canvas = document.getElementById("gameCanvas"),
	ctx = canvas.getContext("2d");

enjin.init(canvas);

var player = {
	x: 20, 
	y: 20,
	speed: 0
};
var player2 = {
	x: 10, 
	y: 10,
	speed: 45
};

var camera;

var background = new Image();
background.src="http://www.strandedsoft.com/contenidos/uploads/2015/03/Captura-de-pantalla-2015-03-09-a-las-21.17.30.png";

//register functions
enjin.load = function() {
	player = {
		x: 20, 
		y: 20,
		speedx: 75,
		speedy: 50
	};

	camera = new enjin.Camera(player.x, player.y)
}

enjin.update = function(dt) {
	player.x += Math.random() * player.speedx * dt;
	player.y += Math.random() * player.speedy * dt;

	player2.x += Math.random() * player.speedx * dt;
	player2.y += Math.random() * player.speedy * dt;

	camera.moveTo(player.x, player.y);
}

enjin.draw = function() {
	camera.attach();

	ctx.drawImage(background, 0, 0); 
	ctx.fillRect(player.x, player.y, 10, 10);
	ctx.fillRect(player2.x, player2.y, 10, 10);

	camera.remove();
}

//start looping
enjin.start()








*/











