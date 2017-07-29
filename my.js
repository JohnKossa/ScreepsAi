let objToArray = require("./utils").objToArray;
let my = {
	creeps: function () {
		return objToArray(Game.creeps);
	},
	spawns: function () {
		return objToArray(Game.spawns);
	},
	structures: function(){
		return objToArray(Game.structures);
	},
	constructionSites: function(){
		return objToArray(Game.constructionSites);
	},
	rooms: function(){
		return objToArray(Game.rooms);
	}
};
module.exports = my;