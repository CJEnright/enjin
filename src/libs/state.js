var state = {};

state.stack = [];

/**
 * Switch from the currentState to a new state
 * @param {Object} NewState The new state object to switch to
 */ 
state.switch = function(newState) {
	if(enjin.currentState.leave) {
		enjin.currentState.leave();
	}

	if(newState.enter) {
		newState.enter();
	}

	enjin.currentState = newState;
}

/**
 * Switch to a new state and add it to the stack
 * @param {Object} NewState The new state object to switch to
 */	
state.push = function(newState) {
	this.stack.push(newState);
	enjin.currentState = this.stack[this.stack.length-1];
}

/**
 * Remove the current state from the stack and switch to the previous one
 */
state.pop = function() {
	this.stack.pop();
	enjin.currentState = this.stack[this.stack.length-1];
}

module.exports = state;