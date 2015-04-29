/**
 * Created by luna on 29/04/15.
 */

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
        } else {
            //select this cell
            selectedCell = cellSprite.objectRef;
            cellSprite.frame = 9;
        }
    }
}