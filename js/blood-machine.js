/**
 * Created by luna on 29/04/15.
 */

function BloodMachine(){

    this.checkInjector = function(){
        this.injector.light.frame = 0;
        this.generator.frame = 0;
        if (cells.length > 0 && cells.getChildAt(0).objectRef.currentStep === levelPath.length-1){
            cells.getChildAt(0).objectRef.injectorHead = true;
        }
        if (this.injectorFull()) {
            var solution = this.checkSolution(0);
            if (solution.length>0){
                for (var i=0;i<solution.length;i++){
                    solution[i].injected = true;
                    var blendFile = solution[i].type + '-blend';
                    var blended = this.injector.blender.create(solution[i].sprite.x,solution[i].sprite.y,blendFile);
                    blended.scale.set(scale);
                    blended.anchor.set(0.5);
                    blended.animations.add('blend',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], 60, false);
                }

                var that = this;

                var lowerMarker = function(){
                    var deferred = Q.defer();
                    that.injector.light.frame = 2;
                    TweenMax.to(that.injector.marker, 0.5, {
                        y: that.injector.marker.y + ((solution.length) * cellSize),
                        onComplete: function(){
                            deferred.resolve();
                        }
                    });
                    return deferred.promise;
                };

                var blendCells = function(){
                    var deferred = Q.defer();
                    var anim;
                    that.injector.blender.forEach(function (blended) {
                        anim = blended.animations.play("blend");
                    }, this, false);
					for (var i = 0; i < solution.length; i++){
						solution[i].removeCell();
					}
                    //cells.removeBetween(0,solution.length-1,true);
                    anim.onComplete.add(function(){
                        deferred.resolve();
                    });
                    return deferred.promise;
                };

                var inject = function(){
                    var deferred = Q.defer();
                    var diff = that.injector.marker.y - 40;
                    that.injector.blender.forEach(function(blended){
                        TweenMax.to(blended, 0.4,{
                            delay: 0.1,
                            y : blended.y-diff,
                            onComplete: function(b){
                                that.injector.blender.remove(b,true);
                            },
                            onCompleteParams: [blended]
                        });
                    },this,false);
                    TweenMax.to(that.injector.marker, 0.4,{
                        delay: 0.1,
                        y : 40,
                        onComplete: function(){
                            deferred.resolve();
                        }
                    });
                    that.scoreSolutions(solution);
                    return deferred.promise;
                };

                lowerMarker().then(blendCells).then(inject);
            } else {
                this.injector.light.frame = 1;
            }
        }
    };

    this.scoreSolutions = function(solution){
        this.injectedCells += solution.length;
        TweenMax.to(this.bag.fluid.mask, 0.6,{
            y : (this.bag.fluid.mask.y - 10*solution.length)
        });
        if (this.injectedCells >= levelsConfig[currentLevel].totalCellsGoal){
            if (currentLevel<levelsConfig.length-1){
                clearInterval(globalTimer);
                currentLevel++;
                game.state.start("level-state",true,false);
            } else {
                console.log("Ganaste")
            }
        }
    };

    this.checkSolution = function(offset){
        if (cells.length < 3){
            return [];
        }
        var solution = [cells.getChildAt(offset).objectRef];
        var type = solution[0].type;
        for (var i=offset+1; i<Math.min(offset+6,cells.length); i++){
            if (cells.getChildAt(i).objectRef.type === type){
                solution.push(cells.getChildAt(i).objectRef);
            } else {
                if (solution.length<3){
                    solution = [];
                }
                break;
            }
        }
        if (solution.length<3){
            solution = [];
        }
        return solution;
    };

    this.generateCell = function(){
        if (this.getCellsInPath(0) != null){
            this.generator.animations.play('red');
			this.checkPartialSolutions();
        } else if (cells.length == 0 || Math.random() <= levelsConfig[currentLevel].cellGenProbability) {
            this.generator.animations.play('green');
            var randomCell = cellTypes[levelCells[Math.floor((Math.random() * levelCells.length))]];
            new Cell(randomCell.name,startPosition);
            this.checkPartialSolutions();
        }
    };

    this.checkPartialSolutions = function(){
        //cells.callAll("objectRef.removePartialSolution",this);
        cells.forEach(function(cell){
            cell.objectRef.partialSolution = null;
        },this,false);
        cells.forEach(function(cell){
            if (!cell.objectRef.partialSolution){
                var partialSolution = this.checkSolution(cells.getChildIndex(cell));
                if (partialSolution.length > 0){
                    for (var i=0; i<partialSolution.length; i++){
                        partialSolution[i].partialSolution = partialSolution;
						partialSolution[i].startBeating();
						//A different animation when the player has a game and the cells are inside the injector
						if (partialSolution[i].currentStep >= levelPath.length - 6){
							partialSolution[i].startGlowing();
							partialSolution[i].stopBeating();
						}
                    }
                } else {
					cell.objectRef.stopBeating();
					cell.objectRef.stopGlowing();
                }
            }
        },this,false);
    };

    this.isPathCovered = function(step){
        return levelPath[step].injector || levelPath[step].allowTarget != true;
    };

    this.injectorFull = function(){
        if (cells.total >=6){
            for (var i=0; i<6; i++){
                if (!levelPath[cells.getChildAt(i).objectRef.currentStep].injector){
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    this.getCellsInPath = function(step){
        var cellInPath = cells.filter(function(cell, index, children) {
            return cell.objectRef.currentStep === step;
        }, true);
        return cellInPath.total > 0 ? cellInPath.first : null;
    };

    //Init blood machine
    this.initPath = function(){
        path = game.add.group();
        cells = game.add.group();
        cover = game.add.group();
        var lastDir = getDirection({x:-1,y:0},levelPath[0]);
        for (var i=0;i<levelPath.length;i++){
            if (levelPath[i].injector!= true){
                var x = levelPath[i].x*cellSize+startPosition.x;
                var y = levelPath[i].y*cellSize+startPosition.y;
                var step = path.create(x,y,"path");
                step.scale.set(scale);
                step.pathPosition = {index:i,x:levelPath[i].x,y:levelPath[i].y};
                step.anchor.set(0.5,0.5);
                //step.inputEnabled = true;
                //step.events.onInputDown.add(checkMovementToPath, this);
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
                        this.setTubeEnd(x,y,getDirection(levelPath[i],levelPath[i-1]));
                    }
                    if (i<levelPath.length-1 && levelPath[i+1].allowTarget){
                        this.setTubeEnd(x,y,getDirection(levelPath[i],levelPath[i+1]));
                    }
                }
                lastDir = nextDir;
            }
        }
    };

    this.setTubeEnd = function(x,y,direction){
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

    this.initInjector = function(){
        var blender = game.add.group();
        var injectorMask = game.add.graphics(100,30);
        injectorMask.beginFill(0xffffff);
        injectorMask.drawRect(100,0,100,580);
        blender.mask = injectorMask;

        var marker = game.add.sprite(215,40,'marker');
        marker.scale.set(scale);
        marker.frame = 0;
        this.injector = game.add.image(198,-4,'cellInjector');
        this.injector.light = game.add.sprite(239,10,'matchLight');
        this.injector.light.frame = 0;
        this.injector.marker = marker;
        this.injector.blender = blender;
    };

    this.initFrame = function(){
        var offset = {x:startPosition.x-22, y:startPosition.y-14};
        for (var i = 0; i < 7*7; i++){
            var bg = game.add.image(0,0, 'backgroundBrown');
            bg.x = (i%6) * bg.width + offset.x;
            bg.y = Math.floor(i/7) * bg.height +offset.y;
            bg.anchor.set(0.5,0.5);
        }
        var chromiumFrame = game.add.image (startPosition.x-55,startPosition.y-70,'chromiumFrame');
        chromiumFrame.scale.set(0.95,0.95);
    };

    this.initBag = function(){
        this.bag = {x:63,y:55,w:120,h:190};
        var bagMask = game.add.graphics(this.bag.x,this.bag.y+this.bag.h-30);
        bagMask.beginFill(0xffffff);
        bagMask.drawRect(0,0,this.bag.w, this.bag.h);
        this.bag.fluid = game.add.image (this.bag.x,this.bag.y,'fluid');
        this.bag.fluid.scale.set(0.8);
        this.bag.fluid.mask = bagMask;
        var vBag = game.add.image (-100,0,'vBag');
        vBag.scale.set(0.8);
    };

    this.initGenerator = function () {
        generatorFrame = game.add.group();
        this.generator = generatorFrame.create(startPosition.x,startPosition.y,'generatorFrame');
        this.generator.scale.set (scale);
        this.generator.anchor.set (0.5);
        this.generator.animations.add('green',[2,0], 2, false);
        this.generator.animations.add('red',[1,0], 2, false);
        this.partialSolutions = [];
    };

    var startPosition = levelsConfig[currentLevel].startPosition;
    this.initFrame();
    this.initBag();
    this.initPath();
    this.initInjector();
    this.initGenerator();
    this.injectedCells = 0;


}