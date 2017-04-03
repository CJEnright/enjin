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
		this.lifeTimeVariance = options.lifeTimeVariance || 0;
		this.lifeTime = (options.lifeTime || options.life || 5) + (options.lifeTime || options.life || 5) * enjin.util.randomDecimal(-this.lifeTimeVariance, this.lifeTimeVariance);
		this.isAlive = true;
		this.elapsedTime = 0;

		this.direction = enjin.util.randomDecimal(options.mindirection, options.maxdirection);
		this.directionCos = Math.cos(this.direction);
		this.directionSin = Math.sin(this.direction);

		// Linear position
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.velx = (options.velx || options.vel || 0) * this.directionCos;
		this.vely = (options.vely || options.vel || 0) * this.directionSin;
		this.velVariance = options.velVariance || options.variance || 0.005;
		this.accelx = (options.accelx || options.accel || 0) * this.directionCos;
		this.accely = (options.accely || options.accel || 0) * this.directionSin;
		this.accelVariance = options.accelVariance || options.variance || 0.005;
	}

	// Drawing
	this.drawFunc = options.draw || function(ctx) { ctx.fillRect(this.x, this.y, 10, 10); }
}

/**
 * Update a Particle's position
 * @param {Number} DeltaTime Time since last update
 */
particle.Particle.prototype.update = function(dt) {
	this.accelx += this.accelx * enjin.util.randomDecimal(-this.accelVariance, this.accelVariance);
	this.accely += this.accely * enjin.util.randomDecimal(-this.accelVariance, this.accelVariance);
	this.velx += this.accelx * dt;
	this.vely += this.accely * dt;
	this.velx += this.velx * enjin.util.randomDecimal(-this.velVariance, this.velVariance);
	this.vely += this.vely * enjin.util.randomDecimal(-this.velVariance, this.velVariance);
	this.x += this.velx * dt;
	this.y += this.vely * dt;

	this.elapsedTime += dt;
	if(this.elapsedTime >= this.lifeTime) {
		this.isAlive = false;
	}
}

/**
 * Draw a single particle
 */
particle.Particle.prototype.draw = function() {
	this.drawFunc(enjin.ctx);
}

/**
 * Creates an Emitter to spawn Particles
 * @param {Number} X X coordinate to spawn particles at
 * @param {Number} Y Y coordinate to spawn particles at
 * @param {Object} ParticleOptions Particle options to spawn particle with
 * @param {Number} Direction The angle to send the particles off at
 * @param {Number} Spread Angle of spread for the particles
 */
particle.Emitter = function(x, y, particleOptions, maxAlive, spawnRate, direction, spread) {
	this.x = x;
	this.y = y;

	this.maxAlive = maxAlive;
	this.aliveParticles = [];
	this.spawnRate = 1 / (spawnRate || this.maxAlive / (particleOptions.lifeTime || particleOptions.life || 5));
	this.timeSinceLastSpawn = 0;

	this.particleOptions = particleOptions;
	this.particleOptions.x = x;
	this.particleOptions.y = y;

	this.direction = direction || 0;
	this.spread = spread || Math.PI;
	this.particleOptions.mindirection = this.direction - this.spread / 2;
	this.particleOptions.maxdirection = this.direction + this.spread / 2;
}

/**
 * Update an Emitter's particles
 * @param {Number} DeltaTime Time since last update
 */
particle.Emitter.prototype.update = function(dt) {
	this.timeSinceLastSpawn += dt;

	// Update position and kill
	for(var i=0; i<this.aliveParticles.length; i++) {
		this.aliveParticles[i].update(dt);
		
		if(!this.aliveParticles[i].isAlive) {
			this.aliveParticles.splice(i, 1);
		}
	}	

	// Spawn new Particles
	while(this.timeSinceLastSpawn > this.spawnRate && this.aliveParticles.length < this.maxAlive) {
		this.aliveParticles.push(new enjin.particle.Particle(this.particleOptions));
		this.timeSinceLastSpawn -= this.spawnRate;
	}
}

/**
 * Draw an Emitter's particles
 */
particle.Emitter.prototype.draw = function() {
	for(var i=0; i<this.aliveParticles.length; i++) {
		this.aliveParticles[i].draw();
	}
}

// A pulse is a single "burst" of particles
/**
 * Creates a pulse to spawn a group of particles
 * @param {Number} X X coordinate to spawn particles at
 * @param {Number} Y Y coordinate to spawn particles at
 * @param {Object} ParticleOptions Particle options to spawn particle with
 * @param {Number} NumberToSpawn Total number of particles to spawn
 * @param {Number} Direction The angle to send the particles off at
 * @param {Number} Spread Angle of spread for the particles
 */
particle.Pulse = function(x, y, particleOptions, numberToSpawn, direction, spread) {
	this.x = x;
	this.y = y;

	this.numberToSpawn = numberToSpawn;
	this.particles = [];

	this.particleOptions = particleOptions;
	this.particleOptions.x = x;
	this.particleOptions.y = y;

	this.direction = direction || 0;
	this.spread = spread || Math.PI;
	this.particleOptions.mindirection = this.direction - this.spread / 2;
	this.particleOptions.maxdirection = this.direction + this.spread / 2;

	// Init particles
	for(var i=0; i<this.numberToSpawn; i++) {
		this.particles.push(new enjin.particle.Particle(this.particleOptions));
	}
}

/**
 * Update a Pulse's particles
 * @param {Number} DeltaTime Time since last update
 */
particle.Pulse.prototype.update = function(dt) {
	for(var i=0; i<this.particles.length; i++) {
		this.particles[i].update(dt);

		if(!this.particles[i].isAlive) {
			this.particles.splice(i, 1);
		}
	}
}

/**
 * Draw an Pulse's particles
 */
particle.Pulse.prototype.draw = function() {
	for(var i=0; i<this.particles.length; i++) {
		this.particles[i].draw();
	}
}


// N.B. While you can make particles yourself, I'd reccomend using the library calls instead.
module.exports = particle;
