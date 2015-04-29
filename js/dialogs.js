function megaComboDialog () {
	var rayImage = game.add.image(startPosition.x-45,startPosition.y-60,'megaComboRay');
	rayImage.scale.set(0.83,0.89);
	var rayMask = game.add.graphics(game.world.centerX+100, game.world.centerY);
	rayMask.beginFill(0xffffff);
	rayMask.drawCircle(0,0,700);
	rayMask.scale.set(0);
	rayImage.mask = rayMask;
	
	TweenMax.to (rayMask.scale,0.5,{
		x: 1,
		y: 1,
		ease: RoughEase.ease.config({ template: Power0.easeNone, strength: 2, points: 50, taper: "none", randomize: true, clamp: false})
	})
};