function Cell(type, position){
    
    this.moveToPathPosition = function(targetStep){
		swapSound.play();
        var targetPosition = getStepPosition(targetStep);
        TweenMax.to(this.getSprites(), swapSpeed,{
                x: targetPosition.x,
                y: targetPosition.y,
                ease: Power3.easeOut,
                onComplete: this.sprite.frame = 0
            });
        this.currentStep = targetStep;
    }
    
    this.shake = function(){
        while (!TweenMax.isTweening(this.sprite)){
            var currentPosition = getStepPosition(this.currentStep);
            this.sprite.x = currentPosition.x -3;
            TweenMax.to (this.getSprites(), 0.05, {
                x: currentPosition.x + 6,
                yoyo: true,
                repeat: 10
                //onComplete: function () { this.sprite.x = currentPosition.x }
            })
        }
    }
    
    this.cellIndex = function(){
        return cells.getChildIndex(this.sprite);
    }
    
    this.advance = function(){
        //console.log("advancing cell in "+this.currentStep);
        if (!this.injected && (!this.injectorHead || bloodMachine.injectorFull())) {
            this.injectorHead = false;
            var nextStep = (this.currentStep === levelPath.length-1) ? 0 : this.currentStep +1;
            var move = false;
            if (nextStep == 0){
                move = cells.length < levelPath.length;
            } else {
                move = bloodMachine.getCellsInPath(nextStep) == null;
            }

            if (move) {
                var nextPos = getStepPosition(nextStep);
                TweenMax.to(this.getSprites(), advanceSpeed,{
                    x: nextPos.x,
                    y: nextPos.y,
                    ease: Back.easeInOut.config(1.2),
                    onComplete: this.checkAfterMove,
                    onCompleteParams: [this,nextStep]
                });
                this.currentStep = nextStep;
            }
        }
    }
    
    this.checkAfterMove = function (cell,nextStep){
        if (nextStep === 0){
            cells.bringToTop(cells.getChildAt(0));
        }  
        if (selectedCell == cell && bloodMachine.isPathCovered(cell.currentStep)){
            cell.sprite.frame = 0;
            selectedCell = null;
        }
    };
    
    
    this.addCellEffects = function(){
        var sprite = this.sprite;
        sprite.reflexInterval = setInterval(function(){
            if (Math.random() > 0.5){
                sprite.animations.play('reflex', 45, false);
            }            
        },Math.random()*1000+1500);
    };
    
    this.stopCellEffects = function(){
        clearInterval(this.sprite.reflexInterval);
    };
    
	this.getSprites = function (){
		return [this.sprite, this.glowEffect];
	};

    this.removeCell = function () {
		cells.remove(this.sprite, true);
		this.glowEffect.kill();
	};
	
    
    
	this.startBeating = function () {
        //Normalize the size of the cell before start beating
        TweenMax.to ([this.glowEffect.scale, this.sprite.scale], advanceSpeed,{
            x:scale,
            y:scale,
            onComplete: startBeatingTween,
        });
        
        var that = this;
        
        function startBeatingTween (){
            TweenMax.fromTo ([that.glowEffect.scale, that.sprite.scale], advanceSpeed,{
                x: scale,
                y: scale,
            },{
                x: scale-0.1,
                y: scale-0.1,
                ease: Power0.easeNone,
                yoyo: true,
                repeat: -1
            });
        };
	};
		
	this.stopBeating = function () {
		TweenMax.to([this.glowEffect.scale, this.sprite.scale], advanceSpeed,{
			x: scale,
			y: scale,
			ease: Power3.easeInOut
		})
	}
	
	this.startGlowing = function () {
        //Normalize the alpha of the glow before start flashing
        TweenMax.to(this.glowEffect, advanceSpeed,{
            alpha: 0,
            onComplete: startGlowingTween
        });
        
        var that = this; 
        
        function startGlowingTween () {
            TweenMax.to(that.glowEffect, advanceSpeed, {
                alpha: 0.7,
                yoyo: true,
                repeat: -1,
                ease: Power0.easeNone
            });
        }
    };

    this.stopGlowing = function(){
        TweenMax.to(this.glowEffect, advanceSpeed, {
            alpha: 0
        });
    };

    this.removePartialSolution = function(){
        this.partialSolution = null;
    }
		
    //initialization
    this.sprite = cells.create(position.x,position.y, type);
    this.type = type;
    this.injectorHead = false;
    this.sprite.anchor.set (0.5,0.5);
    this.sprite.scale.set(scale);
    this.currentStep = 0;
    this.injected = false;
    this.sprite.inputEnabled = true;
    this.sprite.events.onInputDown.add(beginSwipe,this);
    this.sprite.animations.add('reflex',[0,1,2,3,4,5,6,7,8,9,10], 60, false);
    this.sprite.objectRef = this;    
    this.addCellEffects();
	this.glowEffect = game.add.image (position.x, position.y, this.type + "Glow");
	this.glowEffect.anchor.set (0.5);
	this.glowEffect.scale.set(scale);
	this.glowEffect.alpha = 0;
    this.partialSolution = null;
}