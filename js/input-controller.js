/**
 * Created by luna on 29/04/15.
 */


var minDistancePx = 10;

function beginSwipe(cellSprite){
    var currentStep = levelPath[cellSprite.objectRef.currentStep];
    if (currentStep.allowTarget){
        selectedCell = cellSprite.objectRef;
        cellSprite.frame = 9;
        startX = game.input.worldX;
        startY = game.input.worldY;

        cellSprite.events.onInputDown.remove(beginSwipe);
        cellSprite.events.onInputUp.add(endSwipe);
    }
}

function endSwipe(cellSprite){
    if (selectedCell){
        // saving mouse/finger coordinates
        endX = game.input.worldX;
        endY = game.input.worldY;
        // determining x and y distance travelled by mouse/finger from the start
        // of the swipe until the end
        var distX = startX-endX;
        var distY = startY-endY;
        // in order to have an horizontal swipe, we need that x distance is at least twice the y distance
        // and the amount of horizontal distance is at least minDistancePx pixels
        var currentPath = levelPath[selectedCell.currentStep];
        var targetCoords = {x:currentPath.x, y: currentPath.y};
        if(Math.abs(distX)>Math.abs(distY)*2 && Math.abs(distX)>minDistancePx){
            if(distX>0){ //left
                targetCoords.x--;
            } else{ //right
                targetCoords.x++;
            }
        }
        // in order to have a vertical swipe, we need that y distance is at least twice the x distance
        // and the amount of vertical distance is at least minDistancePx pixels
        if(Math.abs(distY)>Math.abs(distX)*2 && Math.abs(distY)>minDistancePx){
            if(distY>0){ //up
                targetCoords.y--;
            } else{ //down
                targetCoords.y++;
            }
        }
        var targetPath = getPathForCoordinates(targetCoords);
        if (targetPath){
            checkMovementToPath(targetPath);
        } else {
            deselectCell();
            selectedCell.shake();
        }
    }
    // stop listening for the player to release finger/mouse, let's start listening for the player to click/touch
    cellSprite.events.onInputDown.add(beginSwipe);
    cellSprite.events.onInputUp.remove(endSwipe);
}

function deselectCell(){
    if (selectedCell){
        selectedCell.sprite.frame = 0;
        selectedCell = null;
    }
}

function checkMovementToPath (step) {

    var cellOver = bloodMachine.getCellsInPath(step.pathPosition.index);
    if(!cellOver){
        //position is empty
        if (selectedCell) {
            if (isAdjacent(levelPath[selectedCell.currentStep],levelPath[step.pathPosition.index])){
                //Move to empty position
                if (Math.abs(selectedCell.currentStep - step.pathPosition.index) != 1) {
                    var backwardJump = selectedCell.currentStep > step.pathPosition.index;
                    var min = Math.min(selectedCell.currentStep,step.pathPosition.index);
                    var max = Math.max(selectedCell.currentStep,step.pathPosition.index);
                    var cellsBetween = cells.filter(function(cell) {
                        return cell.objectRef.currentStep > min && cell.objectRef.currentStep < max;
                    });
                    var currentIndex = cells.getChildIndex(selectedCell.sprite);
                    if (backwardJump) {
                        currentIndex += cellsBetween.total;
                    } else {
                        currentIndex -= cellsBetween.total;
                    }
                    cells.setChildIndex(selectedCell.sprite, currentIndex);
                };
                selectedCell.moveToPathPosition(step.pathPosition.index);
                bloodMachine.checkPartialSolutions();
            } else {
                //Movement is not valid
                selectedCell.shake();
            }
            deselectCell();
        }
    } else {
        //selects or swaps
        swapCells(cellOver);
    }
}


function swapCells(cellSprite){
    var cell = cellSprite.objectRef;
    if (!bloodMachine.isPathCovered(cell.currentStep)){
        cell.stopCellEffects();
        if (selectedCell) {
            var currentStep = cell.currentStep;
            var targetStep = selectedCell.currentStep;
            if (isAdjacent(levelPath[currentStep],levelPath[targetStep]) && !bloodMachine.isPathCovered(currentStep) && !bloodMachine.isPathCovered(targetStep)){
                cells.swapChildren(cellSprite,selectedCell.sprite);
                cell.moveToPathPosition(targetStep);
                selectedCell.moveToPathPosition(currentStep);
                bloodMachine.checkPartialSolutions();
            } else {
                cell.shake();
            }
            deselectCell();
            cell.addCellEffects();
        }
        //else {
        //    //select this cell
        //    selectedCell = cellSprite.objectRef;
        //    cellSprite.frame = 9;
        //}
    }
}