function templateMatchesProfile(template, profile){
	var matches = true;
	profile.requiredSkills.forEach((skill) => {
		var relevantTemplate = template.filter((el) => el.type == skill.type);
		if(!relevantTemplate.length){
			matches = false; //template is missing that skill
		}
		if(relevantTemplate.amt < skill.level){
			matches = false; //template's amount is less than required
		}
	});
	return matches;
}
function templateToBodyArray(templateArr){
	var output = [];
	templateArr.forEach((templatePart) => {
		var fillType;
		switch(templatePart.type){
			case "work":
				fillType = WORK;
				break;
			case "move":
				fillType = MOVE;
				break;
			case "carry":
				fillType = CARRY;
				break;
			case "attack":
				fillType = ATTACK;
				break;
			default:
				console.log("Unrecognized fill type in body creation");
		}
		for(var i = 0; i < templatePart.amt; i++){
			output.push(fillType); //Have to do this instead of the fill trick because of dumb enum reasons
		}
	});
	return output;
}
function templateToCost(templateArr){
	var cost = 0;
	templateArr.forEach((templatePart)=>{
		switch (templatePart.type){
			case TOUGH:
				cost += 10 * templatePart.amt;
				break;
			case MOVE:
			case CARRY:
				cost += 50 * templatePart.amt;
				break;
			case ATTACK:
				cost += 80 * templatePart.amt;
				break;
			case WORK:
				cost += 100 * templatePart.amt;
				break;
			case RANGED_ATTACK:
				cost += 150 * templatePart.amt;
				break;
			case HEAL:
				cost += 250 * templatePart.amt;
				break;
			case CLAIM:
				cost += 600 * templatePart.amt;
				break;
			default:
				console.log("Cost not found for body type: "+templatePart.type)
		}
	});
	return cost;
}
module.exports.templateMatchesProfile = templateMatchesProfile;
module.exports.templateToBodyArray = templateToBodyArray;
module.exports.templateToCost = templateToCost;