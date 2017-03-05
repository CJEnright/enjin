/*
To add:
height 
*/
var text = {};

text.getWidth = function(string) {
	return ctx.measureText(string).width;
}

module.exports = text;