(function() {

	/* Scene */
	function Scene(file) {
		this._file = file;
	};


	/* Scene Factory */
	function SceneFactory() {
		this._scenes = {};
	};

	SceneFactory.prototype = {
		/* sceneParams = { key: '', json: '', obj: objectTypeScene } */
		set: function(sceneParams) {
			if(sceneParams.obj.prototype instanceof Scene)
				this._scenes[sceneParams.key] = { file: sceneParams.json, o: sceneParams.obj };
		},

		get: function(key) {
			var s = this._scenes[key];
			if(s) {
				return new s.o(s.file);
			}
			return null;
		}
	};

	window.SceneFactory = SceneFactory;
	window.Scene = Scene;

})();

/*
Tests


var f = new SceneFactory();

function SceneTest(file) {
	Scene.call(this, file);
};

SceneTest.prototype = new Scene;

f.set({ key: 'scene1', json: 'somefile', obj: SceneTest });

var s = f.get('scene1');*/

