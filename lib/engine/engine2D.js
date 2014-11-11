		(function() {
			/* Utils */
			var isFunction = function(obj) {
		  		return !!(obj && obj.constructor && obj.call && obj.apply);
			};

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
			function Sprite(imgResource, args) {
		        this.pos = [args.x,args.y];
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
		        update: function(dt) {
		            if(this.active)
		                this._index += this.speed*dt;
		        },

		        render: function(ctx, vx, vy) {
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
		            var xp = this.posTpl[0];
		            var yp = this.posTpl[1];

		            if(this.dir == 'vertical') {
		                yp += frame * this.size[1];
		            }
		            else {
		                xp += frame * this.size[0];
		            }

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

					ctx.drawImage(this._resources, this.pos[0], this.pos[1]);
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

				getById: function(id) {
					return new Sprite(this._resources[id], this._info[id]);
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

				render: function() {
					this._entities.forEach(function(entity){
						entity.render();
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

				render: function() {
					this._currentScene.render();
				},
			};

			/* Engine */
			/* args = { canvas: domElement, width: integer, height: integer } */
			function Engine2D(args) {
				this._canvas = args.canvas;
				this._width = args.width;
				this._height = args.height;

				//Get context 2D
				//this._context = this._canvas.getContext('2d');
				//Set config
				//this._canvas.width = this._width;
				//this._canvas.height = this._height;

				//SceneManager
				this._sceneManager = new SceneManager();

				//main function
				this.main = null;
				this._onReady = false;
				var that = this;
				document.addEventListener('ready', function (e) { 
					console.log("Todos los resources cargados " + e); 

					that._sceneManager._currentScene.loadEntities();

					that._onReady = true;
				
				}, false);
			};

			Engine2D.prototype = {
				getContext: function() {
					return this._context;
				},

				getSceneManager: function() {
					return this._sceneManager;
				},

				render: function() {
					this._sceneManager.render();
				},

				update: function(dt) {
					this._sceneManager.update(dt);
				},

				run: function(dt) {
		    		if(this._onReady) {
		    			console.log("It works");
		    			this.update(dt);
		    			this.render();
		    		} else {
		    			console.log("Not load all");
		    		}
				}
			};

			window.SceneFactory = SceneFactory;
			window.Scene = Scene;
			window.EntityFactory = EntityFactory;
			window.Entity = Entity;
			window.SceneManager = SceneManager;
			window.Globals = Globals;
			window.Engine2D = Engine2D;
			window.SpriteFactory = SpriteFactory;

		})();

		//Init factories
		Globals.engine.entityFactory = new EntityFactory();
		Globals.engine.sceneFactory = new SceneFactory();
		Globals.engine.spriteFactory = new SpriteFactory();

		var engine = new Engine2D({});

		function SceneTest(content) {
			Scene.call(this, content);
		};

		SceneTest.prototype = new Scene;

		function EntityTest(content) {
			Entity.call(this, content.x, content.y);

			this._sprite = Globals.engine.spriteFactory.getById(content.sprite);
			//console.log(this._sprite);
		};

		EntityTest.prototype = new Entity;


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
