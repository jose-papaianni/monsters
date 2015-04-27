TweenMax.ticker.useRAF(false);
TweenMax.lagSmoothing(0);
var debuggerMode = true;
var scale = 0.55;
var cellSize = 150*scale;
var swapSpeed = 0.25;
var advanceSpeed = 0.5;

var levelState = {
    preload: function () {
        game.load.image("backgroundGlobal", "assets/back-pattern.jpg", 150, 150);
        game.load.image("backgroundBrown", "assets/background-brown.png", 75, 75);
        game.load.image("decorationTube", "assets/tube-end-decoration.png", 7, 100);
        game.load.image("vBag", "assets/puch.png", 341, 546);
        game.load.image("monster", "assets/monster-lever.png", 289, 288);
        game.load.image("fluid", "assets/bag-liquid.png", 118, 188);
        game.load.spritesheet("generatorFrame", "assets/generator-frame.png", 134, 135);
        game.load.spritesheet("path", "assets/path-parts.png", 150, 150);
        game.load.spritesheet("marker", "assets/marker.png", 150, 20);
        game.load.spritesheet("tubedPath", "assets/path-tube.png", 150, 150);
        game.load.spritesheet("chromiumFrame", "assets/chromium-frame.png", 482, 595);
        game.load.spritesheet("cellInjector", "assets/injector.png", 123, 594);
        game.load.spritesheet("matchLight", "assets/match-light.png", 34, 34);
        for (var i = 0; i<cellTypes.length; i++){
            game.load.spritesheet(cellTypes[i].name, cellTypes[i].filename , cellTypes[i].w,cellTypes[i].h);
            game.load.spritesheet(cellTypes[i].blend.name, cellTypes[i].blend.filename , cellTypes[i].blend.w,cellTypes[i].blend.h);
        }

    }, 
    
    create: function() {
        //background
        for (var i = 0; i < 6; i++){
            xPos = i * 150;
        var backgroundGlobal = game.add.image(xPos, 0, 'backgroundGlobal');
            for (var j = 0; j < 5; j++){
                    backgroundGlobal = game.add.image(xPos, j * 150, 'backgroundGlobal');
            }
        }
        var injectorLight;
        selectedCells = [];
        selectedCell = null;
        levelPath = levelsConfig[currentLevel].path;
        coverMatrix = levelsConfig[currentLevel].cover;
		startPosition = levelsConfig[currentLevel].startPosition;
        this.initGameDecoration();

        path = game.add.group();
        cells = game.add.group();
        blendedCells = game.add.group();
        injectorMask = game.add.graphics(100,30);
        injectorMask.beginFill(0xffffff);
        injectorMask.drawRect(100,0,100,580);
        blendedCells.mask = injectorMask;
        cover = game.add.group();
		generatorFrame = game.add.group();

		
        debugGroupPath = game.add.group();
        debugGroup = game.add.group();
        
        this.initPath();              
		this.initInjector();
		this.initGenerator();
        debugGridPath();
        addCellMovement ();
        
    },
    
    initGameDecoration: function(){
        for (var i = 0; i < 6; i++){
            var xPos = i * 75 + startPosition.x - 22 ; 
			var backgroundBrown = game.add.image(xPos, startPosition.y, 'backgroundBrown');
			backgroundBrown.anchor.set(0.5,0.5);
				for (var j = 0; j < 7; j++){
					var yPos = j * 75 + startPosition.y - 14;
					var backgroundBrown = game.add.image(xPos, yPos, 'backgroundBrown');
					backgroundBrown.anchor.set(0.5,0.5);
				}
        }
		var chromiumFrame = game.add.image (startPosition.x-55,startPosition.y-70,'chromiumFrame');
		chromiumFrame.scale.set(0.95,0.95);
		bagMask = game.add.graphics(63,55);
        bagMask.beginFill(0xffffff);
        bagMask.drawRect(0,180,180,-190);
		var vBagFluid = game.add.image (63,55,'fluid');
		vBagFluid.scale.set(0.8);
	 	vBagFluid.mask = bagMask;
		var vBag = game.add.image (-100,0,'vBag');
		vBag.scale.set(0.8);		
		var monster = game.add.image(10, 370, 'monster');
		monster.scale.set(0.8);
		
	},
	
    initPath: function(){
        var lastDir = getDirection({x:-1,y:0},levelPath[0]);
        for (var i=0;i<levelPath.length;i++){
			if (levelPath[i].injector!= true){
                var x = levelPath[i].x*cellSize+startPosition.x;
                var y = levelPath[i].y*cellSize+startPosition.y;
                var step = path.create(x,y,"path");
                step.scale.set(scale);
                step.pathPosition = {index:i,x:levelPath[i].x,y:levelPath[i].y};
                step.anchor.set(0.5,0.5);
                step.inputEnabled = true;
                step.events.onInputDown.add(checkMovementToPath, this);
                var nextDir = getDirection(levelPath[i],i==levelPath.length-1 ? {x:-1,y:5} : levelPath[i+1]);
                if (lastDir === nextDir){
                    step.frame = (lastDir === 0 || lastDir === 2) ? 1 : 0;
                } else if (lastDir === 0 && nextDir === 1 || lastDir === 3 && nextDir === 2){
                    step.frame = 3;
                } else if (lastDir === 2 && nextDir === 1 || lastDir === 3 && nextDir === 0){
                    step.frame = 2;
                } else if (lastDir === 0 && nextDir === 3 || lastDir === 1 && nextDir === 2){
                    step.frame = 4;
                } else if (lastDir === 1 && nextDir === 0 || lastDir === 2 && nextDir === 3){
                    step.frame = 5;
                }
                if (!levelPath[i].allowTarget){
                    step.inputEnabled = false;
                    var tubedPath = cover.create(x,y,"tubedPath");
                    tubedPath.scale.set(scale);
                    tubedPath.anchor.set(0.5,0.5);
                    tubedPath.frame = step.frame;
                    if (i>0 && levelPath[i-1].allowTarget){
                        setTubeEnd(x,y,getDirection(levelPath[i],levelPath[i-1]));                        
                    } 
                    if (i<levelPath.length-1 && levelPath[i+1].allowTarget){
                        setTubeEnd(x,y,getDirection(levelPath[i],levelPath[i+1]));
                    } 
                }
                lastDir = nextDir;
            }
		}
    },
	
	initInjector: function(){
		marker = game.add.sprite(215,40,'marker');
        marker.scale.set(scale);
        marker.frame = 0;
        var cellInjector = game.add.image(198,-4,'cellInjector');
        injectorLight = game.add.sprite(239,10,'matchLight');
        injectorLight.frame = 0;

	},
	
	initGenerator: function () {
		var generator = generatorFrame.create(startPosition.x +2,startPosition.y+2,'generatorFrame');
		generator.scale.set (0.85);
		generator.anchor.set (0.5);
	}
}

function setTubeEnd(x,y,direction){
    var tubedDecoration = cover.create(x,y,"decorationTube");
    var offsetDir = direction >= 2 ? -1 : 1;
    tubedDecoration.anchor.set(0.5,0.5);
    tubedDecoration.scale.set(scale);
    if (direction == 1 || direction == 3){
        tubedDecoration.angle = 90;
        tubedDecoration.y = tubedDecoration.y + ((cellSize/2)*offsetDir); 
    } else {
        tubedDecoration.x = tubedDecoration.x + ((cellSize/2)*offsetDir); 
    }   
};

function addCellMovement(){
    setInterval( function () {
        injectorLight.frame = 0 ;
        checkInjector();
        cells.forEach(function(cell){
            cell.objectRef.advance();
        },this,false);
		cellGeneration();
        debugGrid();
    }, levelsConfig[currentLevel].speed); 
};

function cellGeneration () {
	var childrenInFirstCell = cells.filter(function(cell, index, children) {
		return cell.objectRef.currentStep === 0 ? true : false;
	}, true);
	var randomizerGenerator = Math.floor((Math.random() * 4));
	if (childrenInFirstCell.total === 0 && randomizerGenerator <= 1) {
		var randomCell = cellTypes[Math.floor((Math.random() * cellTypes.length))];
		new Cell(randomCell.name,startPosition);
	}
};

function checkSolution() {
    solution = [cells.getChildAt(0).objectRef];
    var type = solution[0].type;
    for (var i=1; i<6; i++){
        if (cells.getChildAt(i).objectRef.type === type){
            solution.push(cells.getChildAt(i).objectRef);
        } else {
            if (solution.length<3){
                injectorLight.frame = 1;
                solution = [];
            }
            break;
        }
    }
    return solution;
};

function checkInjector(){
    if (cells.length > 0 && cells.getChildAt(0).objectRef.currentStep === levelPath.length-1){
        cells.getChildAt(0).objectRef.injectorHead = true;
    }
    if (injectorFull()) {
        var solution = checkSolution();
        if (solution.length>0){
            for (var i=0;i<solution.length;i++){
                solution[i].injected = true;
                var blendFile = solution[i].type + '-blend';
                var blended = blendedCells.create(solution[i].sprite.x,solution[i].sprite.y,blendFile);
                blended.scale.set(scale);
                blended.anchor.set(0.5);
                blended.animations.add('blend',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], 60, false);
            };

            var lowerMarker = function(){
                var deferred = Q.defer();
                injectorLight.frame = 2;
                TweenMax.to(marker, 0.5, {
                    y: marker.y + ((solution.length) * cellSize),
                    onComplete: function(){
                        deferred.resolve();
                    }
                });
                return deferred.promise;
            }

            var blendCells = function(){
                var deferred = Q.defer();
                var anim;
                blendedCells.forEach(function (blended) {
                    anim = blended.animations.play("blend");
                }, this, false);
                cells.removeBetween(0,solution.length-1,true);
                anim.onComplete.add(function(){
                    deferred.resolve();
                });
                return deferred.promise;
            }

            var inject = function(){
                var deferred = Q.defer();
                var diff = marker.y - 40;
                blendedCells.forEach(function(blended){
                    TweenMax.to(blended, 0.4,{
                        delay: 0.1,
                        y : blended.y-diff,
                        onComplete: function(b){
                            blendedCells.remove(b,true);
                        },
                        onCompleteParams: [blended]
                    });
                },this,false);
                TweenMax.to(marker, 0.4,{
                    delay: 0.1,
                    y : 40,
                    onComplete: function(){
                        deferred.resolve();
                    }
                });
                return deferred.promise;
            }

            lowerMarker().then(blendCells).then(inject);
        }        
    }
}

function injectorFull(){
    if (cells.total >=6){
        for (var i=0; i<6; i++){
            if (!levelPath[cells.getChildAt(i).objectRef.currentStep].injector){
                return false;
            }
        }
        return true;
    }
    return false;
}

function isCovered(step){
    return levelPath[step].injector || levelPath[step].allowTarget != true;
}

function deselectCell(){
    if (selectedCell){
        selectedCell.sprite.frame = 0;
        selectedCell = null;
    }
}

function checkMovementToPath (step) {
    var cellOver = cells.filter(function(cell) {
        return cell.objectRef.currentStep === step.pathPosition.index;
    });	
    if(cellOver.total === 0){
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
        	} else {
                //Movement is not valid
				selectedCell.shake();
			}
            deselectCell();
		} 
	} else {
        //selects or swaps
        cellOver.first.objectRef.swapPosition();
    }
}

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', levelState);
