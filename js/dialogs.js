function animationCombo (ray,back,text) {
    
    var rayImage = game.add.image(startPosition.x-45,startPosition.y-60, ray);
	rayImage.scale.set(0.83,0.89);
	var rayMask = game.add.graphics(game.world.centerX+100, game.world.centerY);
	rayMask.beginFill(0xffffff);
	rayMask.drawCircle(0,0,700);
	rayMask.scale.set(0.0001);
	rayImage.mask = rayMask;
    var comboBack = game.add.image (game.world.centerX+110, game.world.centerY,back);
    comboBack.scale.set(0.84,0);
    comboBack.anchor.set(0.5);
    var comboText = game.add.image (game.world.centerX+110, game.world.centerY,text);
    comboText.scale.set(0.85);
    comboText.anchor.set(0.5);

	thunderSound.play()
    TweenMax.to (comboBack.scale, 0.5, {
        y: 0.84,
        ease: Power3.easeOut
    });
    TweenMax.from (comboText, 1, {
        y: -300,
        ease: Elastic.easeOut.config(0.7, 0.3)
    });
	TweenMax.to (rayMask.scale,0.5,{
        delay: 0.5,
		x: 1,
		y: 1,
		ease: RoughEase.ease.config({ template: Power0.easeNone, strength: 2, points: 50, taper: "none", randomize: true, clamp: false})
	});
    TweenMax.to (comboText, 0.5, {
        delay: 1,
        y: 800,
        ease: Power3.easeIn,
        onComplete: function () {
            rayImage.destroy();
            rayMask.destroy();
            comboBack.destroy();
            comboText.destroy();
        }
    });
    TweenMax.to (comboBack.scale, 0.5, {
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

function callComboAnimation (combo) {
	switch (combo){
		case 'superCombo':
			animationCombo('superComboRay','superComboBack','superComboText')
		break;
		case 'megaCombo':
			animationCombo('megaComboRay','megaComboBack','megaComboText')
		break;		
		case 'ultraCombo':
			animationCombo('ultraComboRay','ultraComboBack','ultraComboText')
		break;
	}
}

