var levelState = {
    preload: function () {
        game.load.image("backgroundGlobal", "assets/back-pattern.jpg", 150, 150);
        
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
        
        cells = game.add.group();
        
        this.initCellGenerator();        
        
    },
    
    
    initCellGenerator: function(){
        setInterval ( function () {
            var randomCell = cellTypes[Math.floor((Math.random() * cellTypes.length))];
            var cell = cells.create(startPosition.x,startPosition.y, randomCell.name);
            cell.scale.set(0.6);
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

function getNextCell(current,next){
    return {offsetX: ((next.x-current.x)*66), offsetY: ((next.y-current.y)*66)}
};

function getCellPosition (step){
	return {positionX : levelPath[step].x * 66 + startPosition.x, positionY : levelPath[step].y * 66 + startPosition.y};
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
			if (cellDistance.offsetX <= 66 && cellDistance.offsetY <= 66 !=
				(cellDistance.offsetX == 66 && cellDistance.offsetY == 66)){
				
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
