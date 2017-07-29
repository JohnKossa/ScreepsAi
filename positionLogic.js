function spiralPositions(x, y, count){
	function addCoords(firstPair, otherPair){
		return [firstPair[0]+otherPair[0], firstPair[1]+otherPair[1]];
	}
	let directions = [[1, 0], [0, -1], [-1, 0], [0, 1]];
	let positions = [];
	let currPair = [x, y];
	let currentDirection = 0;
	let len = 1;
	while(positions.length < count){
		//console.log(positions);
		currPair = addCoords(currPair, directions[currentDirection]);
		positions.push(currPair);
		if(positions.length >= count){
			break;
		}
		currentDirection = (currentDirection + 1) % 4;
		currPair = addCoords(currPair, directions[currentDirection]);
		positions.push(currPair);
		currentDirection = (currentDirection + 1) % 4;
		len++;
	}
	return positions;
}
function canBuildAt(room, x, y){
	let terrainIsOkay = Game.map.getTerrainAt(x, y, room.name) === "plain";
	let freeOfStructures = !room.lookForAt(LOOK_STRUCTURES , x, y).length;
	let freeOfConstruction = !room.lookForAt(LOOK_CONSTRUCTION_SITES , x, y).length;
	return terrainIsOkay && freeOfStructures && freeOfConstruction;
}
module.exports.canBuildAt = canBuildAt;
module.exports.spiralPositions = spiralPositions;