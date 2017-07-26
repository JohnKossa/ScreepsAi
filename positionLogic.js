function spiralPositions(x, y, count){
	function addCoords(firstPair, otherPair){
		return [firstPair[0]+otherPair[0], firstPair[1]+otherPair[1]];
	}
	var directions = [[1,0], [0,-1], [-1,0], [0,1]];
	var positions = [];
	var currPair = [x, y];
	var currentDirection = 0;
	var len = 1;
	while(positions.length < count){
		//console.log(positions);
		currPair = addCoords(currPair, directions[currentDirection]);
		positions.push(currPair);
		if(positions.length >= count){
			break;
		}
		currPair = addCoords(currPair, directions[currentDirection]);
		positions.push(currPair);
		currentDirection = (currentDirection + 1) % 4;
		len++;
	}
	return positions;
}
function canBuildAt(room, x, y){
	var terrainIsOkay = Game.map.getTerrainAt(x, y, room.name) == "plain";
	var freeOfStructures = !room.lookForAt(LOOK_STRUCTURES , x, y).length;
	var freeOfConstruction = !room.lookForAt(LOOK_CONSTRUCTION_SITES , x, y).length;
	return terrainIsOkay && freeOfStructures && freeOfConstruction;
}
module.exports.canBuildAt = canBuildAt;
module.exports.spiralPositions = spiralPositions;