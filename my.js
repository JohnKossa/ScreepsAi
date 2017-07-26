var objToArray = require("./utils").objToArray;
var my = {
	creeps: function () {
		return objToArray(Game.creeps);
	},
	spawns: function () {
		return objToArray(Game.spawns);
	},
	structures: function(){
		return objToArray(Game.structures);
	}
};
module.exports = my;