/*//tween is require, something should execute that adds 
var Tween =  {
	tweens: [],
	_count: 0,
	methods: {
		linear: function(s) { return s },
		quad: function(s) { return ss },
		cubic: function(s) { return sss },
		quart: function(s) { return ssss },
		quint: function(s) { return sssss },
		sine: function(s) { return 1-math.cos(smath.pi/2) },
		//i think i need math.pow here
		expo: function(s) { return 2^(10(s-1)) },
		//muy expensivo
		circ: function(s) { return 1 - Math.sqrt(1-ss) }
	}
}

Tween.new = function(params) {
	var tween = {};

	tween.time = params.time || 1;
	//subject is what is actually changed
	tween.subject = params.initial || 0;
	//initial and final are just in betweens for it
	tween.initial = params.initial || 0;
	tween.final = params.final || 1;
	tween.method = enjin.tween.methods[params.method] || enjin.tween.methods.linear;
	tween.finished = params.finished || enjin._nothing;

	var id = enjin.tween._count
	enjin.tween.tweens.id = tween;

	enjin.tween._count++;
}

/
Tween.update = function(dt) {
	for(var i = 0; i < this.tweens.length; i++) {
		this.tweens[i].time -= dt;

		//updating actual values will be hard
		//this.tweens[i].initial = 		

		if(this.tweens[i].time <= 0){
			this.tweens[i].finished();
			//remove it from the array
			this.tweens.splice(i, 1);
		}
	}
};/
/
module.exports = Tween;

enjin.moduleUpdates.push(function(dt) {
	for(var i = 0; i < enjin.tween.tweens.length; i++) {
		enjin.tween.tweens[i].time -= dt;

		//updating actual values will be hard  
		enjin.tween.tweens[i].initial = 

		if(enjin.tween.tweens[i].time <= 0){
			enjin.tween.tweens[i].finished();
			//remove it from the array
			enjin.tween.tweens.splice(i, 1);
		}
	}
});
/
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
		return function(s, ...) return (s < .5 and f1(2s, ...) or 1 + f2(2s-1, ...))  .5 end
	end,

	-- useful tweening functions
	linear = function(s) return s end,
	quad   = function(s) return ss end,
	cubic  = function(s) return sss end,
	quart  = function(s) return ssss end,
	quint  = function(s) return sssss end,
	sine   = function(s) return 1-math.cos(smath.pi/2) end,
	expo   = function(s) return 2^(10(s-1)) end,
	circ   = function(s) return 1 - math.sqrt(1-ss) end,

	back = function(s,bounciness)
		bounciness = bounciness or 1.70158
		return ss((bounciness+1)s - bounciness)
	end,

	bounce = function(s) -- magic numbers ahead
		local a,b = 7.5625, 1/2.75
		return math.min(as^2, a(s-1.5b)^2 + .75, a(s-2.25b)^2 + .9375, a(s-2.625b)^2 + .984375)
	end,

	elastic = function(s, amp, period)
		amp, period = amp and math.max(1, amp) or 1, period or .3
		return (-amp  math.sin(2math.pi/period  (s-1) - math.asin(1/amp)))  2^(10(s-1))
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
				local ok, delta = pcall(function() return (v-ref)1 end)
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
			ref[key] = ref[key] + delta  ds
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