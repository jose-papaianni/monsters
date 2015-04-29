TweenMax.ticker.useRAF(false);
TweenMax.lagSmoothing(0);
var debuggerMode = false;
var scale = 0.55;
var cellSize = 150*scale;
var swapSpeed = 0.25;
var advanceSpeed = 0.5;

WebFontConfig = {
	google: {
      families: ['Chango']
    }
};

var levelState = {

    preload: function () {
		game.load.script('webfont', 'http://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		game.load.audio('swapCell', "sounds/blop.mp3");
		game.load.image("levelComplete", "assets/level-complete.png", 504,367);
        game.load.image("backgroundGlobal", "assets/back-pattern.jpg", 150, 150);
        game.load.image("backgroundBrown", "assets/background-brown.png", 75, 75);
        game.load.image("decorationTube", "assets/tube-end-decoration.png", 7, 100);
        game.load.image("vBag", "assets/puch.png", 341, 546);
        game.load.image("monster", "assets/monster-lever.png", 289, 288);
        game.load.image("fluid", "assets/bag-liquid.png", 118, 188);
		game.load.image("missionDialog", "assets/misson-dialog.png", 188, 267);
        game.load.spritesheet("generatorFrame", "assets/generator-frame.png", 200, 200);
        game.load.spritesheet("path", "assets/path-parts.png", 150, 150);
        game.load.spritesheet("marker", "assets/marker.png", 150, 20);
        game.load.spritesheet("tubedPath", "assets/path-tube.png", 150, 150);
        game.load.spritesheet("chromiumFrame", "assets/chromium-frame.png", 482, 595);
        game.load.spritesheet("cellInjector", "assets/injector.png", 123, 594);
        game.load.spritesheet("matchLight", "assets/match-light.png", 34, 34);
        for (var i = 0; i<cellTypes.length; i++){
            game.load.spritesheet(cellTypes[i].name, cellTypes[i].filename , cellTypes[i].w,cellTypes[i].h);
            game.load.spritesheet(cellTypes[i].blend.name, cellTypes[i].blend.filename , cellTypes[i].blend.w,cellTypes[i].blend.h);
			game.load.image(cellTypes[i].glow.name, cellTypes[i].glow.filename, cellTypes[i].glow.w, cellTypes[i].glow.h);
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
		var swapSound;
		var globalTimer;
        selectedCells = [];
        selectedCell = null;
        levelPath = levelsConfig[currentLevel].path;
        levelCells = levelsConfig[currentLevel].availableCells;
        coverMatrix = levelsConfig[currentLevel].cover;
		startPosition = levelsConfig[currentLevel].startPosition;

        bloodMachine = new BloodMachine();

        this.initGameDecoration();

        debugGroupPath = game.add.group();
        debugGroup = game.add.group();
        
		this.initSounds();
        debugGridPath();
        moveAvailable = true;
    },
    
	initSounds: function(){
		swapSound = game.add.audio('swapCell');
	},
	
    initGameDecoration: function(){
		var missionDialog = game.add.image(14, 180, 'missionDialog');
		var monster = game.add.image(10, 370, 'monster');
		monster.scale.set(0.8);
	},
	


    update: function () {

        if (this.shouldMove()){
            moveAvailable = false;

            bloodMachine.checkInjector();
            cells.forEach(function(cell){
                cell.objectRef.advance();
            },this,false);
            bloodMachine.generateCell();
            debugGrid();
            fireNextMovement(levelsConfig[currentLevel].speed);
        }
    },

    shouldMove: function (){
        return moveAvailable;
    }
}

function fireNextMovement(speed){
    globalTimer = setTimeout(function(){
        moveAvailable = true;
    }, speed);
};

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'lab-monster');

game.state.add("level-state",levelState);
game.state.start("level-state");
