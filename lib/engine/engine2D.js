(function() {
	/* Globals */

	var Globals = {
		engine: {
			entityFactory: null,
			sceneFactory: null
		}
	};


	/* Entity */
	function Entity(x, y) {
		this._sprite = null;
		this._x = x;
		this._y = y;
	};

	Entity.prototype = {
		update: function(dt) {
			//if(this._sprite != null)
			console.log("Updateando entity"); //this._sprite.update(dt);
		},

		render: function() {
			//if(this._sprite != null)
			console.log("Renderizando entity (" + this._x + ", " + this._y+ ")"); //this._sprite.render();
		}
	};

	/* EntityFactory */
	function EntityFactory() {
		this._info = [];
	};

	EntityFactory.prototype = {
		/* info = [ { info,o } ] */
		setInfo: function(info) {
			for(var i = 0; i < info.length; i++) {
				this._info[info[i].name] = info[i];
			}
		},

		getByName: function(name) {
			return new this._info[name].o(this._info[name]);
		}
	};

	/* Scene */
	function Scene(info) {
		this._info = info;
		this._entities = [];
		this._infoEntities = [];
		this._infoSprites = [];
	};

	Scene.prototype = {
		load: function() {
			this._infoEntities = this._info.entities;
			this._infoSprites = this._info.sprites;

			Globals.engine.entityFactory.setInfo(this._infoEntities);

			for(var i = 0; i < this._infoEntities.length; i++) {
				this._entities.push(Globals.engine.entityFactory.getByName(this._infoEntities[i].name));
			}
		},

		update: function(dt) {
			this._entities.forEach(function(entity){
				entity.update(dt);
			});
		},

		render: function() {
			this._entities.forEach(function(entity){
				entity.render();
			});
		}
	};


	/* Scene Factory */
	function SceneFactory() {
		this._scenes = [];
	};

	SceneFactory.prototype = {
		/* sceneParams = { name: '', content: '', obj: objectTypeScene } */
		set: function(sceneParams) {
			for(var i = 0; i < sceneParams.length; i++){
				if(sceneParams[i].obj.prototype instanceof Scene) {
					if(!this._scenes[sceneParams[i].name])
						this._scenes[sceneParams[i].name] = { content: sceneParams[i].content, o: sceneParams[i].obj };
				}
			}
		},

		get: function(name) {
			var s = this._scenes[name];
			if(s) {
				return new s.o(s.content);
			}
			return null;
		}
	};

	/* Scene Manager */
	function SceneManager() {
		this._currentScene = null;
	};

	SceneManager.prototype = {
		init: function(sceneInfo) {
			Globals.engine.sceneFactory.set(sceneInfo);
		},

		selectScene: function(name) {
			this._currentScene = Globals.engine.sceneFactory.get(name);
			this._currentScene.load();
		},

		update: function(dt) {
			this._currentScene.update(dt);
		},

		render: function() {
			this._currentScene.render();
		}
	};

	window.SceneFactory = SceneFactory;
	window.Scene = Scene;
	window.EntityFactory = EntityFactory;
	window.Entity = Entity;
	window.SceneManager = SceneManager;
	window.Globals = Globals;

})();

//Init factories
Globals.engine.entityFactory = new EntityFactory();
Globals.engine.sceneFactory = new SceneFactory();

var sm = new SceneManager();

function SceneTest(content) {
	Scene.call(this, content);
};

SceneTest.prototype = new Scene;

function EntityTest(content) {
	Entity.call(this, content.x, content.y);
};

EntityTest.prototype = new Entity;


var infoScenes = [
	{
		name: "test",
		obj: SceneTest,
		content: {
			entities: [
				{name: "e3", x:0, y:76, o:EntityTest},
				{name: "e4", x:58, y:4999, o:EntityTest}
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

sm.init(infoScenes);
sm.selectScene("test");
sm.update(1);
sm.render();


/*
Tests 1


var f = new SceneFactory();

function SceneTest(file) {
	Scene.call(this, file);
};

SceneTest.prototype = new Scene;

f.set({ key: 'scene1', json: 'somefile', obj: SceneTest });

var s = f.get('scene1');

function EntityTest(obj) {Entity.call(this, obj.x, obj.y)};

EntityTest.prototype = new Entity;
*/

