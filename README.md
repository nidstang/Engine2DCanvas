# Engine 2D Library
This is a piece of software for using canvas 2D written in JavaScript language.

Engine2DCanvas allows manage Scenes and Sprites. One scene may have many sprites.


# Components
Two facotries: The SpriteFactory and the SceneFactory.
The scenes are controlled from SceneManager.

## Important
Now we're at ALPHA version.

Some feature still don't work, such as Sprite animations.

## Installation
You only must clone this repository and view in your browser the index.html.
Into the index.html you will find a little sprite moving.

## Example

### Scene and Entity extends:

 <nowiki>

function SceneTest(content) {
	engine2d.Scene.call(this, content);
};

SceneTest.prototype = Object.create(engine2d.Scene.prototype);
SceneTest.prototype.constructor = SceneTest;

function EntityTest(content) {
	engine2d.Entity.call(this, content.x, content.y);

	this._sprite = Globals.engine.spriteFactory.getById(content.sprite, [this._x, this._y]);
	//console.log(this._sprite);
};

EntityTest.prototype = Object.create(engine2d.Entity.prototype);
EntityTest.prototype.constructor = EntityTest;</nowiki>

### Entity changes
 <nowiki>

EntityTest.prototype.update = function(dt) {
	this._x += 50 * dt;
	engine2d.Entity.prototype.update.call(this, dt);
};</nowiki>

### Create data for scenes and its sprites

 <nowiki>
	{
	name: "test",
	obj: SceneTest,
	content: {
		entities: [
			{name: "e3", x:20, y:20, o: EntityTest, sprite: "sp1"}
		],
		sprites: [
			{ id: "sp1", size: { w:10, h:10 }, resource: "http://www.herbalife.com.pa/Content/Global/img/layout/icon_arrow.gif" }
		]
	}
}</nowiki>

### Create a new instance from Engine2D

 <nowiki>
 	var engine = engine2d.create({
	canvas: {
		canvasElement: document.getElementById("canvas"),
		width: 300,
		height: 300
	}
});

sm.init(infoScenes);
sm.selectScene("test");</nowiki>

### The main function

 <nowiki>
 	function main() {
	var now = Date.now();
	var dt = (now - lastTime) / 1000.0;

	engine.run(dt);

	//Show fps
	fps = 1/dt;
	//console.log("FPS: " + fps);

	lastTime = now;
	requestAnimationFrame(main);
};</nowiki>






