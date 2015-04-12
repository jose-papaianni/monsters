// Example by https://twitter.com/awapblog

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

var gameActors;

function preload() {
	
	game.load.image("backgroundGlobal", "assets/back-pattern.jpg", 150, 150);
    game.load.spritesheet("redCell", "assets/redcell.png", 110, 110 );
    game.load.spritesheet("purpleCell", "assets/purplecell.png", 110, 110 );
    game.load.spritesheet("blueCell", "assets/bluecell.png", 110, 110 );
    game.load.spritesheet("yellowCell", "assets/yellowcell.png", 110, 110 );

}

var map;
var layer;
var cell;
var cells;
var cellTypes = [
    'redCell',
    'purpleCell',
    'blueCell',
    'yellowCell'
];

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
	
    //Background
	for (var i = 0; i < 6; i++){
		xPos = i * 150;
	backgroundGlobal = game.add.image(xPos, 0, 'backgroundGlobal');
		for (var j = 0; j < 5; j++){
				backgroundGlobal = game.add.image(xPos, j * 150, 'backgroundGlobal');
		}
	}	
    cellGenerator();
};

function cellGenerator (    ){
    cells = game.add.group();
    var cellId = 0;
    setInterval ( function () {
        var randomizerCell = cellTypes[Math.floor((Math.random() * cellTypes.length))];
        var cell = cells.create(40,40, randomizerCell);
        cell.scale.set(0.5);
        cell.name = 'cellId-' + cellId.toString();
        cellMovement (cell);
        cellEffects (cell)
        cellId++;
    }, 2000)
}

function cellMovement (cell) {
    var currentStep = 0;
    setInterval( function () {	
        if (currentStep < path.length) {
            var nextCell = getNextCell(path[currentStep],path[currentStep+1]);
            TweenMax.to(cell, 0.25,{
                x: cell.x + nextCell.offsetX,
                y: cell.y + nextCell.offsetY,
                ease: Back.easeInOut.config(1)
            });
            currentStep++;
        }
    }, 1000);    
};

function getNextCell(current,next){
    return {offsetX: ((next.x-current.x)*65), offsetY: ((next.y-current.y)*65)}
};


//Effects
function cellEffects (cell){
	cell.animations.add('reflex',[1,2,3,4,5,6,7,8,9,0], 60, false);
	
	setInterval(function(){
			cell.animations.play('reflex', 45, false);
	},1500);
};


function update() {	


};