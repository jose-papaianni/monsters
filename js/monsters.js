// Example by https://twitter.com/awapblog

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

var gameActors;

function preload() {
	
	game.load.image("backgroundGlobal", "assets/back-pattern.jpg", 150, 150);
    game.load.spritesheet("purpleCell", "assets/purplecell.png", 81, 82);

}

var map;
var layer;

var level0Grid = [[1,1,1,1,1],
				  [0,0,0,0,1],
				  [0,0,1,1,1],
				  [0,0,1,0,0],
            	  [0,0,1,1,1],
            	  [1,1,1,1,1]
				 ];

function create() {
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
	
	var counterA = 0;
	var counterB = 0;
	directionForward = true;

setInterval( function () {	
	
			if (directionForward){
				if (level0Grid[counterA][counterB+1] === 1 ){
					counterB ++;
					TweenMax.to(purpleCell, 0.25,{
						x: purpleCell.x + 96,
						ease: Back.easeInOut.config(1)
					});
				} else if (level0Grid[counterA+1][counterB] === 1){
					if (level0Grid[counterA][counterB-1] === 1){
						directionForward = false;
					}
					counterA++;
					TweenMax.to(purpleCell, 0.25,{
						y: purpleCell.y + 96,
						ease: Back.easeInOut.config(1)
					});
				}
				
			} else {
				if (level0Grid[counterA][counterB-1] === 1){
					counterB --;
					TweenMax.to(purpleCell, 0.25,{
						x: purpleCell.x - 96,
						ease: Back.easeInOut.config(1)
					});
				} else if (level0Grid[counterA+1][counterB] === 1){
					if (level0Grid[counterA][counterB+1] === 1){
						directionForward = true;
					}
					counterA++;
					TweenMax.to(purpleCell, 0.25,{
						y: purpleCell.y + 96,
						ease: Back.easeInOut.config(1)
					});
				};
			} 
		console.log('direction: ', directionForward);
		console.log('count: ', counterA, counterB);

	
	
		}, 1500);
};

function update() {	


};