//entites have components (variables) and use systems (functions)
//components is a key-value object like {health: 100, color:'yellow'}
//systems is a key-value object like {sayHi: function() {console.log("Hi");}}
//todo: add filters and required params?
//also maybe making multiple or cloning the same object to save mem?
var Entity = function(components, systems, label) {
	this.components = components;
	this.systems = systems;
	//idk if enjin should have all entites
	this.label = label || enjin.entites.length + 1 || Math.random() * 1000;
	//idk about this
	enjin.entites.push(this);
}

//component is a key-value object like {health: 100, color:'yellow'}
Entity.prototype.addComponent = function(name, value) {
	if(!this.components.name)
		this.components.name = value;
	else
		console.log("Entity " + this.label + " already has component " + name);
}

Entity.prototype.addSystem = function(name, func) {
	if(!this.systems.name)
		this.systems.name = func;
	else
		console.log("Entity " + this.label + " already has system " + name);
}

Entity.prototype.removeComponent = function(name) {
	if(this.components.name)
		this.components.name = undefined;
	else
		console.log("Entity " + this.label + " does not have component " + name);
}

Entity.prototype.removeSystem = function(name) {
	if(this.systems.name)
		this.systems.name = undefined;
	else
		console.log("Entity " + this.label + " does not have system " + name);
}

module.exports = Entity;