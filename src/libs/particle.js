var particle = {};

/**
 * Creates a particle to be spawned by an Emitter
 * @param {Object} Options Object with options you need (look at source for all availible)
 */
particle.Particle = function(options) {
	// If we're passed an update function use that
	if(options.update) {
		this.updateFunc = options.update;
	}
	else {
		this.lifeTime = options.lifeTime || options.life || 5;
		this.isAlive = true;
		this.elapsedTime = 0;

		// Linear position
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.velx = options.velx || options.vel || 0;
		this.vely = options.vely || options.vel || 0;
		this.velVariance = options.velVariance || options.variance || 0.005;
		this.accelx = options.accelx || options.accel || 0;
		this.accely = options.accely || options.accel || 0;
		this.accelVariance = options.accelVariance || options.variance || 0.005;

		// Radial position
		this.rotation = options.rotation || 0;
		this.rotationalVelocity = options.rotationalVelocity || options.rotvel || 0;
		this.rotationalVelocityVariance = options.rotationalVelocityVariance || options.rotvelVariance || options.variance || 0.005;
		this.rotationalAcceleration = options.rotationalAcceleration || options.rotaccel || 0;
		this.rotationalAccelerationVariance = options.rotationalAcceleration || options.rotaccelVariance || options.variance || 0.005;

		this.minVariance = options.minVariance || -0.005;
	}

	// Drawing
	this.drawFunc = options.draw || function(ctx) { ctx.fillRect(this.x, this.y, 10, 10); }
}

particle.Particle.prototype.update = function(dt) {
	this.accelx += this.accelx * enjin.util.randomDecimal(this.minVariance, this.accelVariance);
	this.accely += this.accely * enjin.util.randomDecimal(this.minVariance, this.accelVariance);
	this.velx += this.accelx * dt;
	this.vely += this.accely * dt;
	this.velx += this.velx * enjin.util.randomDecimal(this.minVariance, this.velVariance);
	this.vely += this.vely * enjin.util.randomDecimal(this.minVariance, this.velVariance);
	this.x += this.velx * dt;
	this.y += this.vely * dt;

	this.rotationalAcceleration += this.rotationalAcceleration * enjin.util.randomDecimal(this.minVariance, this.rotationalAccelerationVariance);
	this.rotationalVelocity += this.rotationalAcceleration * dt;
	this.rotationalVelocity += this.rotationalVelocity * enjin.util.randomDecimal(this.minVariance, this.rotationalVelocityVariance);
	this.rotation += this.rotationalVelocity * dt;

	this.elapsedTime += dt;
	if(this.elapsedTime >= this.lifeTime) {
		this.isAlive = false;
	}
}

particle.Particle.prototype.draw = function() {
	enjin.ctx.rotate(this.rotation);
	this.drawFunc(enjin.ctx);
	enjin.ctx.rotate(-this.rotation);
}

/**
 * Creates an Emitter to spawn Particles
 * @param {Number} X X coordinate to spawn particles at
 * @param {Number} Y Y coordinate to spawn particles at
 * @param {Object} Particle Particle object to spawn
 * @param {Number} MaxAlive Maximum number of particles to spawn
 */
particle.Emitter = function(x, y, particleOptions, maxAlive) {
	this.x = x;
	this.y = y;
	this.maxAlive = maxAlive;
	this.particleOptions = particleOptions;
	this.particleOptions.x = x;
	this.particleOptions.y = y;
	this.aliveParticles = [];
}

particle.Emitter.prototype.update = function(dt) {
	// Update position
	for(var i=0; i<this.aliveParticles.length; i++) {
		this.aliveParticles[i].update(dt);
		
		if(!this.aliveParticles[i].isAlive) {
			this.aliveParticles.splice(i, 1);
		}
	}	

	// Spawn new Particles
	if(this.aliveParticles.length < this.maxAlive) {
		var toSpawn = enjin.util.random(0, this.maxAlive - this.aliveParticles.length);
		
		for(var i=0; i<toSpawn; i++) {
			this.aliveParticles.push(new enjin.particle.Particle(this.particleOptions));
		}
	}
}

particle.Emitter.prototype.draw = function() {
	for(var i=0; i<this.aliveParticles.length; i++) {
		this.aliveParticles[i].draw();
	}
}

// Don't make particles yourself, leave that for the library

module.exports = particle;

/*

*/