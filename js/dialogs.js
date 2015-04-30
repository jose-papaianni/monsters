function megaComboDialog () {
    
    var rayImage = game.add.image(startPosition.x-45,startPosition.y-60,'megaComboRay');
	rayImage.scale.set(0.83,0.89);
	var rayMask = game.add.graphics(game.world.centerX+100, game.world.centerY);
	rayMask.beginFill(0xffffff);
	rayMask.drawCircle(0,0,700);
	rayMask.scale.set(0.0001);
	rayImage.mask = rayMask;
    var megaComboBack = game.add.image (game.world.centerX+110, game.world.centerY,'megaComboBack');
    megaComboBack.scale.set(0.84,0);
    megaComboBack.anchor.set(0.5);
    var megaComboText = game.add.image (game.world.centerX+110, game.world.centerY,'megaComboText');
    megaComboText.scale.set(0.85);
    megaComboText.anchor.set(0.5);

	
    TweenMax.to (megaComboBack.scale, 0.5, {
        y: 0.84,
        ease: Power3.easeOut
    });
    TweenMax.from (megaComboText, 1, {
        y: -300,
        ease: Elastic.easeOut.config(0.7, 0.3)
    });
	TweenMax.to (rayMask.scale,0.5,{
        delay: 0.5,
		x: 1,
		y: 1,
		ease: RoughEase.ease.config({ template: Power0.easeNone, strength: 2, points: 50, taper: "none", randomize: true, clamp: false})
	});
    TweenMax.to (megaComboText, 0.5, {
        delay: 1,
        y: 800,
        ease: Power3.easeIn
    });
    TweenMax.to (megaComboBack.scale, 0.5, {
        delay: 1,
        y: 0,
        ease: Power3.easeOut
    });

	TweenMax.to (rayMask.scale,0.25,{
        delay: 1,
		x: 0.0001,
		y: 0.0001,
		ease: RoughEase.ease.config({ template: Power0.easeNone, strength: 2, points: 50, taper: "none", randomize: true, clamp: false})
	});
    TweenMax.to (rayImage, 0.25, {
        delay:0.75,
        alpha: 0.5
    });

};

