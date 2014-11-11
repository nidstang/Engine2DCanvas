var engine = engine2d.create({
	canvas: {
		canvasElement: document.getElementById("canvas"),
		width: 100,
		height: 100
	}
});

function SceneTest(content) {
	engine2d.Scene.call(this, content);
};

SceneTest.prototype = Object.create(engine2d.Scene.prototype);
SceneTest.prototype.constructor = SceneTest;

function EntityTest(content) {
	engine2d.Entity.call(this, content.x, content.y);

	this._sprite = Globals.engine.spriteFactory.getById(content.sprite);
	//console.log(this._sprite);
};

EntityTest.prototype = Object.create(engine2d.Entity.prototype);
EntityTest.prototype.constructor = EntityTest;


var infoScenes = [
	{
		name: "test",
		obj: SceneTest,
		content: {
			entities: [
				{name: "e3", x:0, y:76, o: EntityTest, sprite: "sp1"},
				{name: "e4", x:58, y:4999, o: EntityTest, sprite: "sp1"}
			],
			sprites: [
				{ id: "sp1", x:0, y:0, size: { w:10, h:10 }, resource: "http://www.herbalife.com.pa/Content/Global/img/layout/icon_arrow.gif" }
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
