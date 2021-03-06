(function() {
	/* RequestFrame */
	// A cross-browser requestAnimationFrame
	// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
	var requestAnimFrame = (function(){
	    return window.requestAnimationFrame       ||
	        window.webkitRequestAnimationFrame ||
	        window.mozRequestAnimationFrame    ||
	        window.oRequestAnimationFrame      ||
	        window.msRequestAnimationFrame     ||
	        function(callback){
	            window.setTimeout(callback, 1000 / 60);
	        };
	})();

	/* Globals */

	var Globals = {
		engine: {
			entityFactory: null,
			sceneFactory: null,
			spriteFactory: null
		}
	};

	/* Sprite */
	/* Define one Sprite, uses canvas for drawing images */
	function Sprite(imgResource, args, pos) {
	    this.pos = pos;
	    this.size = [args.size.w,args.size.h];
	    this.speed = typeof args.speed === 'number' ? args.speed : 0;
	    //this.frames = args.frames;
	    this._index = 0;
	    //this.url = url;
	    this._resource = imgResource;
	    //this.dir = args.dir || 'horizontal';
	    //this.once = args.once;
	    this.done = false;

	    this.isDone = function() {
	        return this.done;
	    };
	};

	Sprite.prototype = {
		setPos: function(pos) {
			this.pos = pos;
		},

	    update: function(dt) {
	        if(this.active)
	            this._index += this.speed*dt;
	    },

	    render: function(ctx) {
	        var frame;

	        if(this.speed > 0 && this.active) {
	            var max = this.frames.length;
	            var idx = Math.floor(this._index);
	            frame = this.frames[idx % max];

	            if(this.once && idx >= max) {
	                this.done = true;
	                //return;
	            }
	        }
	        else {
	            frame = 0;
	        }


	        var x = this.pos[0];
	        var y = this.pos[1];
	        // Sprite animations - BETA version
	        /*var xp = this.posTpl[0];
	        var yp = this.posTpl[1];

	        if(this.dir == 'vertical') {
	            yp += frame * this.size[1];
	        }
	        else {
	            xp += frame * this.size[0];
	        }*/

	        //console.log(this.active);
	        //Debug options
	        //console.log("x: " + x + " | y: " + y);
	        //ctx.fillText(x, x-vx, y-vy);
	        /*ctx.drawImage(this._resource,
	                      xp,yp,
	                      this.size[0], this.size[1],
	                      x-vx, y-vy,
	                      this.size[0], this.size[1]
	                      );*/
			// Render
			ctx.drawImage(this._resource, this.pos[0], this.pos[1]);
	    }
	};

	/* Sprite Factory */
	function SpriteFactory() {
		this._info = [];
		this._resources = {};
		this.readyCallbacks = [];
		this._event = new Event('ready');
		//this.img = null;

	};

	SpriteFactory.prototype = {
		isReady: function() {
	        var ready = true;
	        for(var k in this._resources) {
	            if(this._resources.hasOwnProperty(k) &&
	               !this._resources[k]) {
	                ready = false;
	            }
	        }
	        return ready;
		},
		/* info = { x,y,size,resource } */
		setInfo: function(info) {
			for(var i = 0; i < info.length; i++) {
				this._info[info[i].id] = info[i];
				this._info.length++;
			}
		},

		load: function() {
			this._resources = {};
			for(var k in this._info)  {
				this._load(this._info[k].id, this._info[k].resource);
			}
		},

		_load: function(id, r) {
			var img = new Image();
			var that = this;
	    	img.onload = function() {

	            that._resources[id] = img;
	            
	            if(that.isReady()) {
	                //this.readyCallbacks.forEach(function(func) { func(); });
	                document.dispatchEvent(that._event);
	            }
	    	};

	    	this._resources[id] = false;
	    	img.src = r;
		},

		getById: function(id, pos) {
			return new Sprite(this._resources[id], this._info[id], pos);
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
			if(this._sprite != null) {
				this._sprite.setPos([this._x, this._y]);
				this._sprite.update(dt);
			}
			//console.log("Updateando entity"); //this._sprite.update(dt);
		},

		render: function(ctx) {
			if(this._sprite != null) {
				this._sprite.render(ctx);
			}
			//console.log("Renderizando entity (" + this._x + ", " + this._y+ ")"); //this._sprite.render();
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
				this._info[info[i].name] = { x: info[i].x, y: info[i].y, sprite: info[i].sprite, o: info[i].o };
			}
		},

		getByName: function(name) {
			var data = this._info[name];
			var fn = this._info[name].o;
			var t = new fn(this._info[name]);
			return t;
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
			Globals.engine.spriteFactory.setInfo(this._infoSprites);

			//Start sprite loader
			Globals.engine.spriteFactory.load();
		},

		update: function(dt) {
			this._entities.forEach(function(entity){
				entity.update(dt);
			});
		},

		render: function(ctx) {
			this._entities.forEach(function(entity){
				entity.render(ctx);
			});
		},

		loadEntities: function() {
			for(var i = 0; i < this._infoEntities.length; i++) {
				this._entities.push(Globals.engine.entityFactory.getByName(this._infoEntities[i].name));
			}
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

		render: function(ctx) {
			this._currentScene.render(ctx);
		},
	};

	/* Engine */
	/* args = { canvas: domElement, width: integer, height: integer } */
	function Engine2D(args) {
		/* Canvas */
		this._canvas = args.canvas.canvasElement;
		this._width = args.canvas.width;
		this._height = args.canvas.height;
		this._context = null;

		if(this._canvas != null) {
			this._context = this._canvas.getContext('2d');
			this._canvas.width = this._width;
			this._canvas.height = this._height;
		}

		/* Globals */
		Globals.engine = this;


		//SceneManager
		this._sceneManager = new SceneManager();

		//main function
		this._onReady = false;
		var that = this;



		document.addEventListener('ready', function (e) { 
			console.log("Todos los resources cargados " + e); 

			that._sceneManager._currentScene.loadEntities();

			that._onReady = true;
		
		}, false);
	};

	Engine2D.prototype = {
		/* Properties */
		spriteFactory: 	new SpriteFactory(),
		entityFactory: 	new EntityFactory(),
		sceneFactory: 	new SceneFactory(),

		getContext: function() {
			return this._context;
		},

		getSceneManager: function() {
			return this._sceneManager;
		},

		render: function() {
			this._context.save();
			this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
			this._sceneManager.render(this._context);
			this._context.restore();
		},

		update: function(dt) {
			this._sceneManager.update(dt);
		},

		run: function(dt) {
			if(this._onReady) {
				//console.log("It works");
				this.update(dt);
				this.render();
			} else {
				console.log("Not load all");
			}
		}
	};

	function createEngine2D(args) {
		return new Engine2D(args);
	};


	window.engine2d = {
		create: createEngine2D,
		Entity: Entity,
		Scene: Scene
	};

	window.Globals = Globals;

})();
