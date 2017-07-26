function creepMatchesProfile(creep, profile){
	profile.requiredSkills.forEach(function(skill){
		if(creep.getActiveBodyparts(skill.type) < skill.amt) {
			return false;
		}
	});
	return true;
}
function creepsAvailableForProfile(creepArray, profile){
	return creepArray.filter((creep) => creepMatchesProfile(creep, profile));
}
function creepsInProfile(creepArray, profile){
	return creepArray.filter((creep) => creep.memory.profile == profile.name);
}
module.exports.creepMatchesProfile = creepMatchesProfile;
module.exports.creepsAvailableForProfile = creepsAvailableForProfile;
module.exports.creepsInProfile = creepsInProfile;