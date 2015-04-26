function debugGrid () {    
    if(debuggerMode){
    var style = { font: "14px Arial", fill: "#000000", align: "center" };
    
    debugGroup.forEach(function (textG){
    textG.kill();
    },this);
    for (var i = 0 ; i < cells.length; i++) {
        var obj = cells.getChildAt(i);
        var posX = levelPath[(obj.objectRef.currentStep)].x * cellSize + startPosition.x;
        var posY = levelPath[(obj.objectRef.currentStep)].y * cellSize + startPosition.y;
        var textTo = "gi:" + cells.getIndex(obj).toString();
        var text = game.add.text (posX, posY, textTo, style, debugGroup);
        text.anchor.set (0.5);
    }
    }
};

function debugGridPath () {
    if (debuggerMode){
    var style = { font: "18px Arial", fill: "#d80000", align: "right" };
    for (var i = 0; i < levelPath.length; i++){
        var posX = levelPath[i].x * cellSize + startPosition.x;
        var posY = levelPath[i].y  * cellSize + startPosition.y;
        var text = game.add.text (posX+5, posY+5, i.toString(), style, debugGroupPath);
        text.anchor.set(0)
    }
    }
}