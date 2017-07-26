var my = require("./my");
var jobs = require("./jobs");
var creepsAvailableForProfile = require("./creepUtils").creepsAvailableForProfile;
var creepMatchesProfile = require("./creepUtils").creepMatchesProfile;
var profiles = {
	creeps: {
		miner:{
			name: "miner",
			requiredSkills: [{type: "work", level: 1}, {type: "move", level: 1}],
			behavior: function(creep){
				switch(creep.memory.job){
					case "mineUntilFull:done":
					case "dropOffResources":
						jobs.creeps.dropOffResources(creep);
						break;
					case "mineUntilFull":
					case "dropOffResources:done":
					default:
						jobs.creeps.mineUntilFull(creep);
				}
			}
		},
		defender:{
			name: "defender",
			requiredSkills: [{type:"attack", level: 1}, {type: "move", level: 1}],
			behavior: function(creep){
				switch(creep.memory.job){
					case "autoAttack:done":
						if(creepMatchesProfile(creep, profiles.creeps.miner)){
							creep.memory.profile = "miner";
						}else {
							jobs.creeps.autoAttack(creep);
						}
						break;
					default:
						jobs.creeps.autoAttack(creep);
				}
			}
		},
		builder:{
			name: "builder",
			requiredSkills: [{type: "work", level: 1}, {type: "move", level: 1}, {type: "carry", level: 1}],
			behavior: function(creep){
				switch (creep.memory.job){
					case "mineUntilFull:done":
						jobs.creeps.buildBuildings(creep);
						break;
					case "buildBuildings:done":
					default:
						jobs.creeps.mineUntilFull(creep);
				}
				//Goes around building any jobs patterned by the spawn
				const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
				if(target) {
					if(creep.build(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target);
					}
				}
			}
		}
	},
	spawns:{
		default:{
			name: "default",
			priorities: [{type: "EnergyMin", amount: .1}, {type: "EnergyMax", amount: 1}],
			behavior: function(spawn){
				var findHostile = spawn.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
				if(findHostile){
					//There's an invader. Activate all defenders
					var possibleDefenders = creepsAvailableForProfile(my.creeps(), profiles.creeps.defender);
					possibleDefenders.forEach((creep)=>{creep.memory.profile = "defender"});
				}

				var constructionTarget = spawn.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
				if(constructionTarget) {
					var haveBuilder = creepsInProfile(my.creeps(), profiles["builder"]).length > 0;
					if(!haveBuilder && creepsInProfile(my.creeps(), profiles["miner"]).length > 1){
						//Unbuilt buildings but no builders, convert a worker to a builder
						console.log(spawn.name+" says: I need to convert a builder.");
						var viableBuilders = creepsAvailableForProfile(my.creeps(), profiles.creeps.builder);
						if(viableBuilders.length){
							console.log(spawn.name+" says: I converted a builder");
							viableBuilders[0].memory.profile = "builder";
						}
					}
				}

				if(Game.gcl >= 4 && spawn.room.storage == undefined){
					//We can get a storage container, but we don't have one yet
					console.log(spawn.name+" says: We don't have a storage container.");
					var testPositions = spiralPositions(spawn.pos.x, spawn.pos.y, 100);
					var firstViablePosition = testPositions.find((el)=> canBuildAt(spawn.room, el[0], el[1]));
					if(!firstViablePosition) {
						console.log("No viable building positions.");
					}else{
						var createSiteAttempt = spawn.room.createConstructionSite(firstViablePosition[0], firstViablePosition[1], STRUCTURE_STORAGE);
						switch (createSiteAttempt){
							case ERR_RCL_NOT_ENOUGH:
								break;
							default:
								console.log("Creating storage site at: "+firstViablePosition[0]+", "+firstViablePosition[1]);
						}
					}
				}

				//DETERMINE SPAWN ACTIONS
				if(spawn.spawning){
					return; //structure is busy
				}
				var potentialWorkers = creepsAvailableForProfile(my.creeps(), profiles.creeps.miner);
				if(potentialWorkers.length < 6){
					console.log("I have "+potentialWorkers.length+" workers. Making more.");
					if(jobs.spawns.spawnCreep(spawn, "worker", 0, profiles.creeps.miner)){
						return; //this is all we can do this cycle
					}
				}
				var potentialDefenders = creepsAvailableForProfile(my.creeps(), profiles.creeps.defender);
				if(potentialDefenders.length < 8){
					console.log("I have "+ potentialDefenders.length + " defenders. Making more.");
					if(jobs.spawns.spawnCreep(spawn, "militia", 0, profiles.creeps.defender)){
						return; //this is all we can do this cycle
					}
				}
				/*if(currentWorkerCount > 5){
				 //recycle workers
				 var nearbyCreeps = my.creeps().sort(function(creep){return spawn.pos.findInRange(FIND_MY_CREEPS, 1)})
				 spawn.recycleCreep(nearbyCreeps.pop());
				 }*/
			}
		}
	}
};
module.exports = profiles;