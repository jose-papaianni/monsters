var scale = 0.5;
var cellSize = cellTypes[0].w*scale;

var levelState = {
    preload: function () {
        game.load.image("backgroundGlobal", "assets/back-pattern.jpg", 150, 150);
        game.load.spritesheet("path", "assets/path.png", 110, 110);
        for (var i = 0; i<cellTypes.length; i++){
            game.load.spritesheet(cellTypes[i].name, cellTypes[i].filename , cellTypes[i].w,cellTypes[i].h);
        }

    }, 
    
    create: function() {
        //background
        for (var i = 0; i < 6; i++){
            xPos = i * 150;
        backgroundGlobal = game.add.image(xPos, 0, 'backgroundGlobal');
            for (var j = 0; j < 5; j++){
                    backgroundGlobal = game.add.image(xPos, j * 150, 'backgroundGlobal');
            }
        }
        selectedCells = [];
        levelPath = levelsConfig[currentLevel].path;
		startPosition = levelsConfig[currentLevel].startPosition;
        
        
        
        this.initPath();        
        this.initCellGenerator();        
        
    },
    
    
    initPath: function(){
        var path = game.add.group();
        var lastDir = getDirection({x:-1,y:0},levelPath[0]);
        for (var i=0;i<levelPath.length;i++){
            var step = path.create(levelPath[i].x*cellSize+startPosition.x,levelPath[i].y*cellSize+startPosition.y,"path");
            step.scale.set(scale);
            var nextDir = getDirection(levelPath[i],i==levelPath.length-1 ? {x:-1,y:5} : levelPath[i+1]);
            if (lastDir === nextDir){
                step.frame = (lastDir === 0 || lastDir === 2) ? 0 : 1;
            } else if (lastDir === 0 && nextDir === 1 || lastDir === 3 && nextDir === 2){
                step.frame = 2;
            } else if (lastDir === 2 && nextDir === 1 || lastDir === 3 && nextDir === 0){
                step.frame = 3;
            } else if (lastDir === 0 && nextDir === 3 || lastDir === 1 && nextDir === 2){
                step.frame = 4;
            } else if (lastDir === 1 && nextDir === 0 || lastDir === 2 && nextDir === 3){
                step.frame = 5;
            }
            lastDir = nextDir;
        }
    },
    
    initCellGenerator: function(){
        cells = game.add.group();
        setInterval ( function () {
            var randomCell = cellTypes[Math.floor((Math.random() * cellTypes.length))];
            var cell = cells.create(startPosition.x,startPosition.y, randomCell.name);
            cell.scale.set(scale);
            cell.currentStep = 0;
			cell.inputEnabled = true;
			cell.events.onInputDown.add(swapCellPosition,this);
            //cell.name = 'cellId-' + cellId.toString();
            addCellMovement (cell);
            addCellEffects (cell)
            //cellId++;
        }, (levelsConfig[currentLevel].speed))
    }
}

function getDirection(pos1, pos2){
    if (pos1.y === pos2.y){
        return (pos1.x < pos2.x ? 0 : 2)
    } else {
        return (pos1.y < pos2.y ? 1 : 3)
    }
}
                                 
function getNextCell(current,next){
    return {offsetX: ((next.x-current.x)*cellSize), offsetY: ((next.y-current.y)*cellSize)}
};

function getCellPosition (step){
	return {positionX : levelPath[step].x * cellSize + startPosition.x, positionY : levelPath[step].y * cellSize + startPosition.y};
};


function addCellMovement(cell){
    setInterval( function () {            
        if (cell.currentStep < (levelPath.length-1)) {
          //  var nextCell = getNextCell(levelPath[cell.currentStep],levelPath[cell.currentStep+1]);
            TweenMax.to(cell, 0.5,{
                x: getCellPosition(cell.currentStep+1).positionX,
                y: getCellPosition(cell.currentStep+1).positionY,
                ease: Back.easeInOut.config(1),
				onStart: allowSelectCell,
				onStartParams: [false],
				onComplete: allowSelectCell,
				onCompleteParams: [true],
            });
            cell.currentStep++;
        }
    }, levelsConfig[currentLevel].speed);
}

function allowSelectCell(conditional){
	return conditional;
};

function getCellDistance(selection,target){
	return {offsetX: Math.abs(((selection.x-target.x))), offsetY: Math.abs(((selection.y-target.y)))}
};

function swapCellPosition (cell){	
	if (allowSelectCell && selectedCells.length <2){
        clearInterval(cell.reflexInterval);
		selectedCells.push (cell);
        cell.frame = 9;
        if ( allowSelectCell && selectedCells.length === 2 ){
			var currentCell = selectedCells[0];
			var targetCell = selectedCells[1];
            var currentS = currentCell.currentStep;
            var targetS = targetCell.currentStep;
			cellDistance = getCellDistance (currentCell,targetCell);
			if (cellDistance.offsetX <= cellSize && cellDistance.offsetY <= cellSize !=
				(cellDistance.offsetX == cellSize && cellDistance.offsetY == cellSize)){
				
				TweenMax.to(currentCell, 1,{
							x: getCellPosition(targetS).positionX,
							y: getCellPosition(targetS).positionY,
							ease: Power3.easeOut,
                            onComplete: currentCell.frame = 0
						});
				TweenMax.to(targetCell, 1,{
							x: getCellPosition(currentS).positionX,
							y: getCellPosition(currentS).positionY,
							ease: Power3.easeOut,
                            onComplete: targetCell.frame = 0
						});
				currentCell.currentStep = targetS;
				targetCell.currentStep = currentS;
				
			} else if (allowSelectCell){
                currentCell.frame = 0;
                var currentCellPosX = getCellPosition(currentS).positionX 
                currentCell.x = currentCellPosX -4;
                TweenMax.to (currentCell, 0.05, {
                    x: currentCellPosX + 8,
                    yoyo: true,
                    repeat: 10,
                    onComplete: function () { currentCell.x = currentCellPosX }
                })
            }
			addCellEffects(cell);
            cell.frame = 0;
			selectedCells = []
		} 
	}
}
	

//Effects
function addCellEffects (cell){
	cell.animations.add('reflex',[1,2,3,4,5,6,7,8,0], 60, false);
	cell.reflexInterval = setInterval(function(){
			cell.animations.play('reflex', 45, false);
	},2500);
};


var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', levelState);
