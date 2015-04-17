var levelsConfig = [
    {
        speed: 500,
		startPosition : {x:340,y:90},
        path : [
            {x:0,y:0,allowTarget: true},
            {x:1,y:0,allowTarget: false},
            {x:2,y:0,allowTarget: false},
            {x:3,y:0,allowTarget: true},
            {x:4,y:0,allowTarget: true},
            {x:4,y:1,allowTarget: false},
            {x:4,y:2,allowTarget: false},
            {x:3,y:2,allowTarget: false},
            {x:3,y:1,allowTarget: true},
            {x:2,y:1,allowTarget: true},
            {x:2,y:2,allowTarget: true},
            {x:2,y:3,allowTarget: false},
            {x:3,y:3,allowTarget: false},
            {x:3,y:4,allowTarget: true},
            {x:4,y:4,allowTarget: true},
            {x:4,y:5,allowTarget: true},
            {x:3,y:5,allowTarget: false},
            {x:2,y:5,allowTarget: false},
            {x:1,y:5,allowTarget: false},
            {x:0,y:5,allowTarget: false},
			{x:-1,y:5,allowTarget: false,injector: true},
			{x:-1,y:4,allowTarget: false,injector: true},
			{x:-1,y:3,allowTarget: false,injector: true},
			{x:-1,y:2,allowTarget: false,injector: true},
			{x:-1,y:1,allowTarget: false,injector: true},
			{x:-1,y:0,allowTarget: false,injector: true}			
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
    } /*,
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
    }*/
];