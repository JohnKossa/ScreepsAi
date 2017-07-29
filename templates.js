function makeTemplate(pattern, level){
	let returnValue = [];
	for(let i = 0; i < pattern.length; i++){
		returnValue.push({amt: 1, type: pattern[i]});
	}
	for(let i = 0; i < level; i++){
		returnValue[i%pattern.length].amt = returnValue[i%pattern.length].amt+1;
	}
	return returnValue;
}

function makeTemplates(pattern, count){
	let retVal = [];
	for(let i = 0; i<count; i++){
		retVal.push(makeTemplate(pattern, i));
	}
	return retVal;
}

module.exports = {
	worker: makeTemplates([WORK, MOVE, CARRY], 20),
	militia: makeTemplates([WORK, MOVE, CARRY, ATTACK], 20)
};