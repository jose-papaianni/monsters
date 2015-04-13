// Example by https://twitter.com/awapblog


var levelState = {
    preload: function () {
        game.load.image("backgroundGlobal", "assets/back-pattern.jpg", 150, 150);
        game.load.spritesheet("purpleCell", "assets/purplecell.png", 81, 82);
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

        purpleCell = game.add.sprite(0,0, 'purpleCell');	
        purpleCell.animations.add('reflex',[1,2,3,4,5,6,7,8,9,10,0], 60, false);

        setInterval(function(){
                purpleCell.animations.play('reflex', 60, false);
        },1000);

        currentStep = 0;
        
        levelPath = levelsConfig[currentLevel].path

        setInterval( function () {
            
            if (currentStep < (levelPath.length-1)) {
                var nextCell = getNextCell(levelPath[currentStep],levelPath[currentStep+1]);
                TweenMax.to(purpleCell, 0.25,{
                    x: purpleCell.x + nextCell.offsetX,
                    y: purpleCell.y + nextCell.offsetY,
                    ease: Back.easeInOut.config(1)
                });
                currentStep++;
            }
        }, levelsConfig[currentLevel].speed);
    },
    update: function (){
        
    }
}


function getNextCell(current,next){
    return {offsetX: ((next.x-current.x)*96), offsetY: ((next.y-current.y)*96)}
}

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', levelState);
