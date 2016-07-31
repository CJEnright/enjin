/*
To add:
height 
*/
var Text = {};

Text.getWidth = function(string) {
	return ctx.measureText(string).width;
}

module.exports = Text;