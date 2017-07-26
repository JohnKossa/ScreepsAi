var my = require("./my");
var templates = require("./templates");
var templateMatchesProfile = require("./templateUtils").templateMatchesProfile;
var templateToBodyArray = require("./templateUtils").templateToBodyArray;

var jobs = {
	spawns:{
		spawnCreep: function(spawn, templateType, templatelevel, profile){
			spawn.memory.job = "spawnCreep";
			var templateArr = templates[templateType][templatelevel];
			if(!templateMatchesProfile(templateArr, profile)){
				console.log("This template cannot support the requested profile.");
				return false;
			}
			var tryMakeCreep = spawn.createCreep(templateToBodyArray(templateArr));
			switch (tryMakeCreep){
				case ERR_BUSY:
				case ERR_NAME_EXISTS:
					//that's fine
					return false;
				case ERR_NOT_ENOUGH_ENERGY:
					console.log("Uh Oh, not enough power.");
					return false;
				case ERR_INVALID_ARGS:
					console.log("Uh Oh, Body is invalid.");
					return false;
				default:
					Game.creeps[tryMakeCreep].memory.profile = profile.name;
					Game.creeps[tryMakeCreep].memory.template = templateType+":"+templatelevel;
					Game.creeps[tryMakeCreep].memory.working = false;
					console.log("New Creep Spawned: ", tryMakeCreep);
					spawn.memory.job = "spawnCreep:done";
					return true;
			}
		}
	},
	creeps:{
		mineUntilFull: function (creep) {
			creep.memory.job = "mineUntilFull";
			if(creep.carry.energy < creep.carryCapacity){
				var source = creep.pos.findClosestByPath(FIND_SOURCES);
				if(creep.harvest(source) == ERR_NOT_IN_RANGE){
					creep.moveTo(source);
				}
			}else{
				console.log(creep.name+" finished task: mineUntilFull");
				creep.memory.job = "mineUntilFull:done";
			}
		},
		dropOffResources: function(creep){
			creep.memory.job = "dropOffResources";
			//TODO: If the spawn is full and there are unfilled storage containers, use one of those instead
			var nonEmptySpawns = my.spawns().filter((spawn)=> spawn.energy < spawn.energyCapacity);
			if(nonEmptySpawns.length > 0){
				var closestNonEmptySpawns = nonEmptySpawns.sort((first, second) => creep.pos.getRangeTo(first) - creep.pos.getRangeTo(second));
				var target = closestNonEmptySpawns[0];
				let transferAttempt = creep.transfer(target, RESOURCE_ENERGY);
				switch(transferAttempt){
					case ERR_NOT_IN_RANGE:
						creep.moveTo(target);
						break;
					case ERR_FULL:
						//console.log(creep.name+" says: Dropoff target is full");
						break;
					case ERR_INVALID_TARGET:
						//console.log(creep.name+" says: No valid drop points found");
						break;
					default:
						if(transferAttempt<0){
							console.log("Transfer attempt failed and uncaught with exit code: "+transferAttempt);
						}
				}
			}else{
				var nonEmptyStorage = creep.room.find(FIND_MY_STRUCTURES, {
					filter: (structure) => structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
				}).sort((first, second) => creep.pos.getRangeTo(first) - creep.pos.getRangeTo(second));
				if(nonEmptyStorage.length > 0){
					let target = nonEmptyStorage[0];
					let transferAttempt = creep.transfer(target, RESOURCE_ENERGY);
					switch(transferAttempt){
						case ERR_NOT_IN_RANGE:
							creep.moveTo(target);
							break;
						case ERR_FULL:
							//console.log(creep.name+" says: Dropoff target is full");
							break;
						case ERR_INVALID_TARGET:
							//console.log(creep.name+" says: No valid drop points found");
							break;
						default:
							if(transferAttempt<0){
								console.log("Transfer attempt failed and uncaught with exit code: "+transferAttempt);
							}
					}
				}else{
					var nonEmptyContainer = creep.room.find(FIND_MY_STRUCTURES, {
						filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
					}).sort((first, second) => creep.pos.getRangeTo(first) - creep.pos.getRangeTo(second));
					if(nonEmptyContainer.length > 0){
						let target = nonEmptyContainer[0];
						let transferAttempt = creep.transfer(target, RESOURCE_ENERGY);
						switch(transferAttempt){
							case ERR_NOT_IN_RANGE:
								creep.moveTo(target);
								break;
							case ERR_FULL:
								//console.log(creep.name+" says: Dropoff target is full");
								break;
							case ERR_INVALID_TARGET:
								//console.log(creep.name+" says: No valid drop points found");
								break;
							default:
								if(transferAttempt<0){
									console.log("Transfer attempt failed and uncaught with exit code: "+transferAttempt);
								}
						}
					}
				}
				console.log(creep.name+" finished task: dropOffResources");
				creep.memory.job = "dropOffResources:done"; //no valid targets, job is done
			}
			//var closestFriendlySpawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
			if(creep.carry.energy == 0){
				console.log(creep.name+" finished task: dropOffResources");
				creep.memory.job = "dropOffResources:done";
			}
		},
		autoAttack: function(creep){
			//check room for hostile creeps
			//if any, lock on and attack
			//if none, job is finished
			creep.memory.job = "autoAttack";
			var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
			if(target){
				//move to and attack
				var attackAttempt = creep.attack(target);
				switch (attackAttempt){
					case ERR_NOT_IN_RANGE:
						creep.moveTo(target);
						break;
					default:
						if(attackAttempt<0){
							console.log("Attack attempt failed and uncaught with exit code: "+attackAttempt);
						}
				}
			}else{
				console.log(creep.name+" finished task: autoAttack");
				creep.memory.job = "autoAttack:done";
			}
		},
		buildBuildings: function(creep){
			creep.memory.job = "buildBuildings";
			const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
			if(target) {
				if(creep.build(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}
			}else{
				console.log(creep.name+" finished task: buildBuildings");
				creep.memory.job = "buildBuildings:done";
			}
		}
	}
};
module.exports = jobs;