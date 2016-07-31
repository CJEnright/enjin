var enjin = {};
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//using x=x+y because its faster is most cases
//are get methods really needed?
var Camera = function(x, y, scale, rotation, smoother) {
	//Movement interpolators (for camera locking/windowing)
	this.smooth = {};

	this.x = x || 0;
	this.y = y || 0;
	this.scale = scale || 1;
	this.rotation  = rotation || 0;
}

Camera.prototype.focus = function() {
	var centerX = enjin.canvas.width/(2*this.scale),
		centerY = enjin.canvas.height/(2*this.scale);

	enjin.ctx.save();
	enjin.ctx.scale(this.scale, this.scale);
	enjin.ctx.translate(centerX, centerY);
	enjin.ctx.rotate(this.rot);
	enjin.ctx.translate(-this.x, -this.y);
}

Camera.prototype.unfocus = function() {
	//save and restore use a stack so it should be good
	enjin.ctx.restore();
}

Camera.prototype.lookAt = function(x, y) {
 	this.x = x;
 	this.y = y;
}

Camera.prototype.moveTo = function(dx, dy) {
	this.x = this.x + dx;
	this.y = this.y + dy;
}

Camera.prototype.getPosition = function() {
	return {
		x: this.x, 
		y: this.y
	};
}

Camera.prototype.getX = function() {
	return this.x;
}

Camera.prototype.getY = function() {
	return this.y;
}

Camera.prototype.rotate = function(rad) {
	this.rotation = this.rotation + rad;
}

Camera.prototype.rotateTo = function(rad) {
	this.rotation = rad;
}

Camera.prototype.getRotation = function(rad) {
	return this.rotation;
}

Camera.prototype.scale = function(scalar) {
	this.scale = this.scale * scalar;
}

Camera.prototype.scaleTo = function(scale) {
	this.scale = scale;
}

Camera.prototype.getScale = function(scale) {
	return this.scale;
}

Camera.prototype.toWorldCoords = function(x, y) {
	x = (x - this.canvas.getWidth/2) / this.scale;
	y = (y - this.canvas.getHeight/2) / this.scale;

	var cos = Math.cos(-this.rotation),
		sin = Math.sin(-this.rotation);

	x = cos*x - sin*y;
	y = sin*x + cos*y;

	return {
		x: x+this.x,
		y: y+this.y
	}
}

Camera.prototype.toCameraCoords = function(x, y) {
	x = x - this.x;
	y = y - this.y;
	var cos = Math.cos(this.rotation),
		sin = Math.sin(this.rotation);

	x = cos*x - sin*y;
	y = sin*x + cos*y;

	return {
		x: x*this.scale + this.canvas.getWidth/2,
		y: y*this.scale + this.canvas.getHeight/2
	};
}

module.exports = Camera;
},{}],2:[function(require,module,exports){
//all times are in ms
var Timer = function() {}

Timer.prototype.after = function(interval, func) {
	return window.setTimeout(func(), interval);
};

Timer.prototype.every = function(interval, func) {
	return window.setInterval(func(), interval);
};

Timer.prototype.clear = function(timer) {
	//kinda bodged but should still be fine
	window.clearTimeout(timer);
	window.clearInterval(timer);
};

module.exports = Timer;
},{}],3:[function(require,module,exports){
var Tween = function(time, start, finish, method, done) {

}

Tween.prototype.update = function(first_argument) {
	// body...
};


module.exports = Tween;
/*
local Timer = {}
Timer.__index = Timer

local function _nothing_() end

function Timer:update(dt)
	local to_remove = {}
	for handle, delay in pairs(self.functions) do
		delay = delay - dt
		if delay <= 0 then
			to_remove[#to_remove+1] = handle
		end
		self.functions[handle] = delay
		handle.func(dt, delay)
	end
	for _,handle in ipairs(to_remove) do
		self.functions[handle] = nil
		handle.after(handle.after)
	end
end

function Timer:during(delay, func, after)
	local handle = {func = func, after = after or _nothing_}
	self.functions[handle] = delay
	return handle
end

function Timer:after(delay, func)
	return self:during(delay, _nothing_, func)
end

function Timer:every(delay, func, count)
	local count, handle = count or math.huge -- exploit below: math.huge - 1 = math.huge

	handle = self:after(delay, function(f)
		if func(func) == false then return end
		count = count - 1
		if count > 0 then
			self.functions[handle] = delay
		end
	end)
	return handle
end

function Timer:cancel(handle)
	self.functions[handle] = nil
end

function Timer:clear()
	self.functions = {}
end

function Timer:script(f)
	local co = coroutine.wrap(f)
	co(function(t)
		self:after(t, co)
		coroutine.yield()
	end)
end

Timer.tween = setmetatable({
	-- helper functions
	out = function(f) -- 'rotates' a function
		return function(s, ...) return 1 - f(1-s, ...) end
	end,
	chain = function(f1, f2) -- concatenates two functions
		return function(s, ...) return (s < .5 and f1(2*s, ...) or 1 + f2(2*s-1, ...)) * .5 end
	end,

	-- useful tweening functions
	linear = function(s) return s end,
	quad   = function(s) return s*s end,
	cubic  = function(s) return s*s*s end,
	quart  = function(s) return s*s*s*s end,
	quint  = function(s) return s*s*s*s*s end,
	sine   = function(s) return 1-math.cos(s*math.pi/2) end,
	expo   = function(s) return 2^(10*(s-1)) end,
	circ   = function(s) return 1 - math.sqrt(1-s*s) end,

	back = function(s,bounciness)
		bounciness = bounciness or 1.70158
		return s*s*((bounciness+1)*s - bounciness)
	end,

	bounce = function(s) -- magic numbers ahead
		local a,b = 7.5625, 1/2.75
		return math.min(a*s^2, a*(s-1.5*b)^2 + .75, a*(s-2.25*b)^2 + .9375, a*(s-2.625*b)^2 + .984375)
	end,

	elastic = function(s, amp, period)
		amp, period = amp and math.max(1, amp) or 1, period or .3
		return (-amp * math.sin(2*math.pi/period * (s-1) - math.asin(1/amp))) * 2^(10*(s-1))
	end,
}, {

-- register new tween
__call = function(tween, self, len, subject, target, method, after, ...)
	-- recursively collects fields that are defined in both subject and target into a flat list
	local function tween_collect_payload(subject, target, out)
		for k,v in pairs(target) do
			local ref = subject[k]
			assert(type(v) == type(ref), 'Type mismatch in field "'..k..'".')
			if type(v) == 'table' then
				tween_collect_payload(ref, v, out)
			else
				local ok, delta = pcall(function() return (v-ref)*1 end)
				assert(ok, 'Field "'..k..'" does not support arithmetic operations')
				out[#out+1] = {subject, k, delta}
			end
		end
		return out
	end

	method = tween[method or 'linear'] -- see __index
	local payload, t, args = tween_collect_payload(subject, target, {}), 0, {...}

	local last_s = 0
	return self:during(len, function(dt)
		t = t + dt
		local s = method(math.min(1, t/len), unpack(args))
		local ds = s - last_s
		last_s = s
		for _, info in ipairs(payload) do
			local ref, key, delta = unpack(info)
			ref[key] = ref[key] + delta * ds
		end
	end, after)
end,

-- fetches function and generated compositions for method `key`
__index = function(tweens, key)
	if type(key) == 'function' then return key end

	assert(type(key) == 'string', 'Method must be function or string.')
	if rawget(tweens, key) then return rawget(tweens, key) end

	local function construct(pattern, f)
		local method = rawget(tweens, key:match(pattern))
		if method then return f(method) end
		return nil
	end

	local out, chain = rawget(tweens,'out'), rawget(tweens,'chain')
	return construct('^in%-([^-]+)$', function(...) return ... end)
	       or construct('^out%-([^-]+)$', out)
	       or construct('^in%-out%-([^-]+)$', function(f) return chain(f, out(f)) end)
	       or construct('^out%-in%-([^-]+)$', function(f) return chain(out(f), f) end)
	       or error('Unknown interpolation method: ' .. key)
end})

-- the module
local function new()
	local timer = setmetatable({functions = {}, tween = Timer.tween}, Timer)
	return setmetatable({
		new    = new,
		update = function(...) return timer:update(...) end,
		during = function(...) return timer:during(...) end,
		after  = function(...) return timer:after(...) end,
		every  = function(...) return timer:every(...) end,
		script = function(...) return timer:script(...) end,
		cancel = function(...) return timer:cancel(...) end,
		clear  = function(...) return timer:clear(...) end,
		tween  = setmetatable({}, {
			__index    = Timer.tween,
			__newindex = function(_,k,v) Timer.tween[k] = v end,
			__call     = function(t,...) return timer:tween(...) end,
		})
	}, {__call = new})
end

return new()
*/
},{}],4:[function(require,module,exports){
//this is the core, enjin can run using only this file if you want just a super minimal engine
//thats why there's stuff dealing with time not in the timer file
//any module you don't want to use comment out or delete and then build with "npm start"

enjin.camera = require('./libs/camera');
enjin.timer = require('./libs/timer');
enjin.tween = require('./libs/tween');
//enjin.network = require('./libs/network');
//enjin.text = require('./libs/text');
//enjin.

/**
 * Initialize Enjin and start if a state was given
 * @param {Object} canvas
 */
enjin.init = function(canvas) {
	enjin.canvas = canvas;
	enjin.ctx = canvas.getContext("2d");

	//time between interval calls in ms
	enjin.updateInterval = 1;
}

/**
 * Initialize and Start looping over 
 */
enjin.start = function() {
	enjin.load();

	//initial lastUpdate so dt isn't undefined
	enjin.lastUpdate = Date.now();

	enjin.interval = window.setInterval(function() {
		//update dt
		enjin.now = Date.now();
	    enjin.dt = (enjin.now - enjin.lastUpdate) / 1000;
	    enjin.lastUpdate = enjin.now;

	    //reset transformations so it always clears correctly
	    ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	    enjin.ctx.clearRect(0, 0, enjin.canvas.width, enjin.canvas.height)
	    ctx.restore();

	    //method calls
	    enjin.update(enjin.dt);
	    enjin.draw();
	}, enjin.updateInterval);
}

/**
 * Stop Enjin's loop
 */
enjin.stop = function() {
	window.clearInterval(enjin.interval);
}

enjin.resume = function() {
	//fill this in later
}
},{"./libs/camera":1,"./libs/timer":2,"./libs/tween":3}]},{},[4]);
