// Example by https://twitter.com/awapblog

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

var gameActors;

function preload() {
	
	game.load.image("backgroundGlobal", "assets/back-pattern.jpg", 150, 150);
    game.load.spritesheet("purpleCell", "assets/purplecell.png", 81, 82);

}

var map;
var layer;

var path = [
    {x:0,y:0},
    {x:1,y:0},
    {x:2,y:0},
    {x:3,y:0},
    {x:4,y:0},
    {x:4,y:1},
    {x:4,y:2},
    {x:3,y:2},
    {x:3,y:1},
    {x:2,y:1},
    {x:2,y:2},
    {x:2,y:3},
    {x:3,y:3},
    {x:3,y:4},
    {x:4,y:4},
    {x:4,y:5},
    {x:3,y:5},
    {x:2,y:5},
    {x:1,y:5},
    {x:0,y:5},
];

var level0Grid = [[1,1,1,1,1],
				  [0,0,1,1,1],
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
    
    currentStep = 0;

    setInterval( function () {	
        if (currentStep < path.length) {
            var nextCell = getNextCell(path[currentStep],path[currentStep+1]);
            TweenMax.to(purpleCell, 0.25,{
                x: purpleCell.x + nextCell.offsetX,
                y: purpleCell.y + nextCell.offsetY,
                ease: Back.easeInOut.config(1)
            });
            currentStep++;
        }
    }, 1500);
};

function getNextCell(current,next){
    return {offsetX: ((next.x-current.x)*96), offsetY: ((next.y-current.y)*96)}
}

function update() {	


};