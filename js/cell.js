function Cell(type, position){
    
    this.moveToPathPosition = function(targetStep){
        var targetPosition = getStepPosition(targetStep);
        TweenMax.to(this.sprite, swapSpeed,{
                x: targetPosition.x,
                y: targetPosition.y,
                ease: Power3.easeOut,
                onComplete: this.sprite.frame = 0
            });
        this.currentStep = targetStep;
    }
    
    this.shake = function(){
        while (!TweenMax.isTweening(this.sprite)){
            var currentPosition = getPathPosition(this.currentStep);
            this.sprite.x = currentPosition.x -3;
            TweenMax.to (this.sprite, 0.05, {
                x: currentPosition.x + 6,
                yoyo: true,
                repeat: 10,
                onComplete: function () { this.sprite.x = currentPosition.x }
            })
        }
    }
    
    this.swapPosition = function(){
        if (!isCovered(this.currentStep)){
            this.stopCellEffects();
            if (selectedCell) {
                var currentStep = this.currentStep;
                var targetStep = selectedCell.currentStep;
                if (isAdjacent(levelPath[currentStep],levelPath[targetStep]) && !isCovered(currentStep) && !isCovered(targetStep)){
                    cells.swapChildren(this.sprite,selectedCell.sprite);
                    this.moveToPathPosition(targetStep);
                    selectedCell.moveToPathPosition(currentStep);                
                } else {
                    this.shake();
                } 
                deselectCell();
                this.addCellEffects();
            } else {
                //select this cell
                selectedCell = this;
                this.sprite.frame = 9;
            }
        }
    }
    
    this.cellIndex = function(){
        return cells.getChildIndex(this.sprite);
    }
    
    this.advance = function(){
        var cellIndex = this.cellIndex();
        //next cell is first in the group, if index is 0, this cell is the first one
        var nextCell = cellIndex>0 ? cells.getChildAt(cellIndex-1) : null;
        if ((!nextCell || (nextCell.objectRef.currentStep-this.currentStep)>1) && (this.currentStep < levelPath.length-1 || injectorFull()) && !this.injected) {
            var nextStep;
            if (this.currentStep === levelPath.length-1){
                nextStep = 0;	
                cells.bringToTop(this.sprite);
            } else {
                nextStep = this.currentStep +1
            }
            var nextPos = getStepPosition(nextStep);
            TweenMax.to(this.sprite, advanceSpeed,{
                x: nextPos.x,
                y: nextPos.y,
                ease: Back.easeInOut.config(1.2),
                onComplete: this.deselectIfCovered
            });

            this.currentStep = nextStep;
        }
    }
    
    this.deselectIfCovered = function(){
        if (selectedCell == this && isCovered(this.currentStep)){
            this.frame = 0;
            selectedCell = null;
        }
    }
    
    this.addCellEffects = function(){
        var sprite = this.sprite;
        sprite.reflexInterval = setInterval(function(){
            if (Math.random() > 0.5){
                sprite.animations.play('reflex', 45, false);
            }            
        },Math.random()*1000+1500);
    }
    
    this.stopCellEffects = function(){
        clearInterval(this.sprite.reflexInterval);
    }
    
    
    //initialization
    this.sprite = cells.create(position.x,position.y, type);
    this.sprite.type = type;
    this.sprite.anchor.set (0.5,0.5);
    this.sprite.scale.set(scale);
    this.currentStep = 0;
    this.injected = false;
    this.sprite.inputEnabled = true;
    this.sprite.events.onInputDown.add(this.swapPosition,this);
    this.sprite.animations.add('reflex',[0,1,2,3,4,5,6,7,8,9,10], 60, false);
    this.sprite.objectRef = this;    
    this.addCellEffects();    
}