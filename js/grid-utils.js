function getDirection(pos1, pos2){
    if (pos1.y === pos2.y){
        return (pos1.x < pos2.x ? 0 : 2) //right - left
    } else {
        return (pos1.y < pos2.y ? 1 : 3) //down - up
    }
};

function isAdjacent(pos1,pos2){
    return (pos1.y === pos2.y && Math.abs(pos2.x - pos1.x) === 1) || (pos1.x === pos2.x && Math.abs(pos2.y - pos1.y) === 1)
}

function getStepPosition(step){
	return {x : levelPath[step].x * cellSize + startPosition.x, y : levelPath[step].y * cellSize + startPosition.y};
};

function getPathForCoordinates(coords){
    var steps = path.filter(function(step, index, children) {
        return step.pathPosition.x === coords.x && step.pathPosition.y === coords.y ;
    }, true);
    return steps.total > 0 ? steps.first : null;
}