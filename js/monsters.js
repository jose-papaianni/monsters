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
        
        levelPath = levelsConfig[currentLevel].path
        
        cells = game.add.group();
        
        this.initCellGenerator();        
        
    },
    
    
    initCellGenerator: function(){
        setInterval ( function () {
            var randomCell = cellTypes[Math.floor((Math.random() * cellTypes.length))];
            var cell = cells.create(40,40, randomCell.name);
            cell.scale.set(0.5);
            cell.currentStep = 0;
            //cell.name = 'cellId-' + cellId.toString();
            addCellMovement (cell);
            addCellEffects (cell)
            //cellId++;
        }, (levelsConfig[currentLevel].speed*2))
    }
}

function getNextCell(current,next){
    return {offsetX: ((next.x-current.x)*65), offsetY: ((next.y-current.y)*65)}
};

function addCellMovement(cell){
    setInterval( function () {            
        if (cell.currentStep < (levelPath.length-1)) {
            var nextCell = getNextCell(levelPath[cell.currentStep],levelPath[cell.currentStep+1]);
            TweenMax.to(cell, 0.25,{
                x: cell.x + nextCell.offsetX,
                y: cell.y + nextCell.offsetY,
                ease: Back.easeInOut.config(1)
            });
            cell.currentStep++;
        }
    }, levelsConfig[currentLevel].speed);
}
//Effects
function addCellEffects (cell){
	cell.animations.add('reflex',[1,2,3,4,5,6,7,8,9,0], 60, false);
	
	setInterval(function(){
			cell.animations.play('reflex', 45, false);
	},1500);
};


var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', levelState);
