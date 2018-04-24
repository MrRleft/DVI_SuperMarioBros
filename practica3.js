


var game = function() {
	

///////////////////////////////Inicio Quintus/////////////////////////////////////////////////
	// Set up an instance of the Quintus engine and include
	// the Sprites, Scenes, Input and 2D module. The 2D module
	// includes the `TileLayer` class as well as the `2d` componet.
	var Q = Quintus({ 
		development: true,
		imagePath: "images/",
		audioPath: "audio/",
		dataPath: "data/" 
		}).include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX").setup({
			width: 320, // Set the default width to 800 pixels
			height: 480, // Set the default height to 600 pixels
		//	downsampleWidth: 640, // Halve the pixel density if resolution
		//	downsampleHeight: 960 // is larger than or equal to 1024x768
		}).controls().touch();

	

///////////////////////////////sprites//////////////////////////////////////////////	
	
	//CARGA DE DATOS
	Q.preload("mario_small.png");
	Q.load(["mario_small.png", "mario_small.json", "mainTitle.png", "goomba.png", "goomba.json", "princess.png", "bloopa.png", "bloopa.json"], function() {

		Q.compileSheets("mario_small.png","mario_small.json");
		Q.compileSheets("goomba.png", "goomba.json");
		Q.compileSheets("bloopa.png", "bloopa.json");
//		Q.sheet("mario_small", "mario_small.png", "mario_small.json");
//		Q.sheet("goomba", "goomba.png", "goomba.json");
//		Q.sheet("bloopa", "bloopa.png", "bloopa.json");

	});

	//SPRITE MARIO
	Q.Sprite.extend("Mario",{

	 
		init: function(p) {

		 
		    this._super(p, {
		      	
		      	sheet: "marioR",
		      	sprite:  "Mario_anim",
		    	jumpSpeed: -400,
		    	speed: 300,
		    	x: 150,
		    	y: 380,
		    	w: 32,
		    	h: 32

		    });

		    this.add('2d, platformerControls, animation');

		    this.on("hit.sprite",function(collision) {
				if(collision.obj.isA("Peach")) {
				Q.stageScene("endGame",1, { label: "You Won!" });
				this.destroy();
				}
			});

			//this.on("bump.bottom", this, "stomp");

		},


		step: function(dt) {
		  	
		  	if(this.p.y > 620){
		  		Q.stageScene("endGame",1, { label: "You Died" });
		  		this.destroy();
		  	}

		    if(this.p.vy != 0) {
		    	this.play("fall_" + this.p.direction);
		    } 
		  	else if(this.p.vx > 0) {
		    	this.play("run_right");
		    } 
		    else if(this.p.vx < 0) {
		    	this.play("run_left");
		    } 
		    else {
		    	this.play("Stand_" + this.p.direction);
		    }
					
		}
/*
		stomp: function(collision) {
			if(collision.obj.isA(["bloopa"])) {
			collision.obj.destroy();
			this.p.vy = -500; // make the player jump
			}
		}
*/
	
	});

	//SPRITE GOOMBA
	Q.Sprite.extend("Goomba",{

	 
		init: function(p) {

		 
		    this._super(p, {
		    	sheet: "goomba",
		    	sprite: "Goomba_anim",
		    	x: 1500,
		    	y: 450,
		    	vx: 100
		    });

		    this.add('2d, aiBounce, animation');

			this.on("bump.left,bump.right,bump.bottom",function(collision) {
				if(collision.obj.isA("Mario")) {
					Q.stageScene("endGame",1, { label: "You Died" });
					collision.obj.destroy();
					}
			});

			this.on("bump.top",function(collision) {
				if(collision.obj.isA("Mario")) {
					this.play("die");
					this.destroy();
				}
			});
		},

		step: function(dt) {

			if(this.p.vx != 0){
				this.play("run");
			}
		}
		// Listen for a sprite collision, if it's the player,
		// end the game unless the enemy is hit on top
	
	});

	//SPRITE PEACH
	Q.Sprite.extend("Peach",{

	 
		init: function(p) {

		 
		    this._super(p, {
		    	asset: "princess.png",
		    	x: 2000,
		    	y: 460,
		    	vx: 100
		    });
		},

		step: function(dt) {

			
		}
		// Listen for a sprite collision, if it's the player,
		// end the game unless the enemy is hit on top
	
	});
	
	//SPRITE BLOOPA
	Q.Sprite.extend("Bloopa",{

	 
		init: function(p) {

		 
		    this._super(p, {
		    	sheet: "bloopa",
		    	x: 200,
		    	y: 350,
		    	gravity: 1/4

		    });

		    this.add('2d, aiBounce, animation');

			this.on("bump.left,bump.right,bump.bottom",function(collision) {
				if(collision.obj.isA("Mario")) {
					Q.stageScene("endGame",1, { label: "You Died" });
					collision.obj.destroy();
					}
			});

			this.on("bump.top",function(collision) {
				if(collision.obj.isA("Mario")) {
					this.destroy();
					}
			});
		},

		step: function(dt) {
			if(this.p.vy == 0 )
				this.p.vy =  -200;
		}
		// Listen for a sprite collision, if it's the player,
		// end the game unless the enemy is hit on top
	
	});

////////////////////////////////////ANIMACIONES/////////////////////////////////////////////////////
	
	//Animaciones Mario
	Q.animations('Mario_anim', {
		run_right: { frames: [1,2,3], rate: 1/10}, 
		run_left: { frames: [17,16,15], rate:1/10 },
//		fire_right: { frames: [9,10,10], next: 'stand_right', rate: 1/30, trigger: "fired" },
//		fire_left: { frames: [20,21,21], next: 'stand_left', rate: 1/30, trigger: "fired" },
		Stand_right: { frames: [0]},
		Stand_left: { frames: [14] },
		fall_right: { frames: [4], loop: false },
		fall_left: { frames: [18], loop: false }
	});

	//Animaciones Goomba
	Q.animations('Goomba_anim', {
		run: {frames: [0, 1], rate:1/2},
		die: {frames:[3]}
	});

	//Animaciones Bloopa
	Q.animations('Bloopa_anim', {

		standing: {frames: [0]},
		floating_up: {frames: [1]},
		floating_down: {frames: [2]}
	});
///////////////////////////////////CARGA NIVELES////////////////////////////////////////////////////

	//INICIALIZACION
	Q.loadTMX("levelOK.tmx, sprites.json", function() {
		Q.stageScene("mainTitle");
		//Q.stageScene("level1");
	});


	//NIVEL 1
	Q.scene("level1", function(stage) {

		Q.stageTMX("levelOK.tmx",stage);
		var player = stage.insert(new Q.Mario());
		var goomba = stage.insert(new Q.Goomba());
		var Peach = stage.insert(new Q.Peach());
		var Bloopa = stage.insert(new Q.Bloopa());
		stage.add("viewport").follow(Q("Mario").first());
		stage.viewport.offsetX = -100;
		stage.viewport.offsetY = 160;

	});

	//TITULO DEL JUEGO
	Q.scene("mainTitle", function(stage){
		
		var button = new Q.UI.Button({
			x: Q.width/2, 
			y: Q.height/2,
			asset: "mainTitle.png"

		})
		stage.insert(button);
		button.on("click",function() {
			Q.clearStages();
			Q.stageScene("level1");
		});

	});

	//GAME OVER

	// To display a game over / game won popup box,
	// create a endGame scene that takes in a `label` option
	// to control the displayed message.
	Q.scene('endGame',function(stage) {
	
		var container = stage.insert(new Q.UI.Container({
		
			x: Q.width/2, 
			y: Q.height/2,
			fill: "rgba(0,0,0,0.5)"
		
		}));
		var button = container.insert(new Q.UI.Button({ 
		
			x: 0,
			y: 0, 
			fill: "#CCCCCC",
			label: "Play Again" 
		
		}))
		var label = container.insert(new Q.UI.Text({
			x:10,
			y: -10 - button.p.h,
			label: stage.options.label 
		}));
		// When the button is clicked, clear all the stages
		// and restart the game.
		
		button.on("click",function() {
			Q.clearStages();
			Q.stageScene('level1');
		});
		// Expand the container to visibily fit it's contents
		// (with a padding of 20 pixels)
		container.fit(20);
	});

////////////////////////////////BUCLE PRINCIPAL//////////////////////////////////////////////

	

}



///////////////////////////////////Cajon de basura///////////////////////////////////////////////////
/*
.follow(Q("Mario").first())
.centerOn(150,380);
	Q.scene("level1",function(stage) {          
	    var background = new Q.TileLayer({ dataAsset: 'level1.tmx', layerIndex: 0, sheet: 'tiles', tileW: 70, tileH: 70, type: Q.SPRITE_NONE });
	    stage.insert(background);   
	    stage.collisionLayer(new Q.TileLayer({ dataAsset: 'level1.tmx', layerIndex:1,  sheet: 'tiles', tileW: 70, tileH: 70 }));      
	});
*/

/*
	// Make sure penguin.png is loaded
	Q.load(["images/mario_small.png", "data/mario_small.json"],function() {

		Q.compileSheets("images/mario_small.png", "data/mario_small.json");
	/*	var Mario = new Q.Mario();
		Q.gameLoop(function(dt) {
			Q.clear();
			Mario.update(dt);
			Mario.render(Q.ctx);
			});
	});
	*/


	/*
	Q.Sprite.extend("Player",{
	  init: function(p) {
	    this._super(p, {
	        hitPoints: 10,
	        damage: 5,
	        x: 5,
	        y: 1
  		});
	}); 
	*/

/*
	    this.on("hit.sprite",function(collision) {

	      if(collision.obj.isA("Tower")) {
	        Q.stageScene("endGame",1, { label: "You Won!" }); 
	        this.destroy();
	      }
	    });
*/

/*
	Q.load(["mario_small.png", "mario_small.json"],function() {

		Q.compileSheets("mario_small.png", "mario_small.json");
		var Mario = new Q.Player();
		Q.gameLoop(function(dt) {
			Q.clear();
			Mario.update(dt);
			Mario.render(Q.ctx);
			});
	});


	follow(Q("Mario").first())
*/
