var engine = engine2d.create({
	canvas: {
		canvasElement: document.getElementById("canvas"),
		width: 300,
		height: 300
	}
});

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
EntityTest.prototype.constructor = EntityTest;

EntityTest.prototype.update = function(dt) {
	this._x += 50 * dt;
	engine2d.Entity.prototype.update.call(this, dt);
};


var infoScenes = [
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
	},
	{
		name: "test2",
		obj: SceneTest,
		content: {
			entities: [
				{name: "e1", x:23, y:76, o:EntityTest},
				{name: "e2", x:58, y:58, o:EntityTest}
			]
		}
	}
];

var sm = engine.getSceneManager();

sm.init(infoScenes);
sm.selectScene("test");

var lastTime = 0;

function main() {
	var now = Date.now();
	var dt = (now - lastTime) / 1000.0;

	engine.run(dt);

	lastTime = now;
	requestAnimationFrame(main);
};


main();
