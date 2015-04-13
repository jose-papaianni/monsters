var levelsConfig = [
    {
        speed: 2000,
		startPosition : {x:40,y:40},
        path : [
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
        ]
    }
];

var currentLevel = 0;

var cellTypes = [    
    {
        name:'redCell',
        filename: "assets/redcell.png",
        w: 110,
        h: 110
    },
    {
        name:'purpleCell',
        filename: "assets/purplecell.png",
        w: 110,
        h: 110
    },
    {
        name:'blueCell',
        filename: "assets/bluecell.png",
        w: 110,
        h: 110
    },
    {
        name:'yellowCell',
        filename: "assets/yellowcell.png",
        w: 110,
        h: 110
    }
];