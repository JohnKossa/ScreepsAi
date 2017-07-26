var my = require("./my");
var profiles = require("./profiles");

module.exports.loop = function(){
	my.spawns().forEach((spawn)=>{
		profiles.spawns[spawn.memory.profile].behavior(spawn);
	});
	my.creeps().forEach((creep)=>{
		profiles.creeps[creep.memory.profile].behavior(creep);
	});
};