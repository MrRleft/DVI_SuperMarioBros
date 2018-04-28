


var game = function() {
	

///////////////////////////////Inicio Quintus/////////////////////////////////////////////////
	// Set up an instance of the Quintus engine and include
	// the Sprites, Scenes, Input and 2D module. The 2D module
	// includes the `TileLayer` class as well as the `2d` componet.
	var Q = Quintus({ 
		development: true,
		imagePath: "images/",
		audioPath: "audio/",
		audioSupported: [ 'mp3' ],
		dataPath: "data/"
		}).include("Sprites, Scenes, Input, 2D, Audio, Anim, Touch, UI, TMX").setup({
			width: 320, // Set the default width to 800 pixels
			height: 480, // Set the default height to 600 pixels
		//	downsampleWidth: 640, // Halve the pixel density if resolution
		//	downsampleHeight: 960 // is larger than or equal to 1024x768
		}).controls().touch().enableSound();

	

///////////////////////////////sprites//////////////////////////////////////////////	
	
	//CARGA DE DATOS

	Q.load(["mario_small.png", "mario_small.json",
			"mainTitle2.png", "goomba2.png", "goomba.json",
			"princess2.png", "bloopa2.png", "bloopa.json",
			"coin2.png", "coin.json", "1up_mushroom.png"], function() {

		Q.compileSheets("mario_small.png","mario_small.json");
		Q.compileSheets("goomba2.png", "goomba.json");
		Q.compileSheets("bloopa2.png", "bloopa.json");
		Q.compileSheets("coin2.png", "coin.json");

	});

	//SPRITE MARIO
	Q.Sprite.extend("Mario",{

	 	

		init: function(p) {

		 	this.alive = true;
		 	this.oneUp = true;
		 	this.lastMileStone = 1;
		    this._super(p, {
		      	
		      	sheet: "marioR",
		      	sprite:  "Mario_anim",
		    	jumpSpeed: -400,
		    	speed: 300,
		    	w: 32,
		    	h: 32

		    });

		    this.add('2d, platformerControls, animation, tween');

		    this.on("hit.sprite",function(collision) {
				if(collision.obj.isA("Peach")) {
					Q.audio.play("music_level_complete.mp3");
					Q.stageScene("endGame",1, { label: "You Won!" });
					this.destroy();
				}
			});


		},


		Die: function(){
			if(this.alive){
				this.alive = false;
				Q.audio.play("music_die.mp3");
				this.gravity = 0;
				this.stage.unfollow();
				this.play("die");
				this.del('2d, platformerControls');
				Q.state.dec("lives", 1);
				Q.stageScene("endGame",1, { label: "You Died" });
				this.animate({y: this.p.y-100}, 0.4, Q.Easing.Linear, {callback: this.nowDown});
			}

		},

		bounce: function(){

			this.p.vy = -200;
		},

		nowDown: function(){

			this.animate({y: this.p.y+300}, 0.8, Q.Easing.Linear, {callback: this.changeToDead });
				
		},

		changeToDead : function(){
			
			this.destroy();	
			
		},

		fall: function(){

			if(this.alive){
				this.destroy();
				Q.state.dec("lives", 1);
				Q.audio.play("music_die.mp3");
				Q.stageScene("endGame",1, { label: "You Died" });
			}
		},

		extralife: function(){

			Q.state.inc("lives", 1);
			Q.audio.play("1up.mp3");
		},

		step: function(dt) {
		  	
		  	if(this.p.y > 520)
		  		this.stage.follow(Q("Mario").first(), {x: true, y: false});
		  	if(this.oneUp && Q.state.get("score") / 1000 == this.lastMileStone){

		  		this.extralife();
		  		this.oneUp = false;
		  	}
		  	if(!this.oneUp){
		  		this.lastMileStone++;
		  		this.oneUp = true;
		  	}

		  	if(this.p.y > 620){
		  		this.fall();
		  	}
		  	if(!this.alive)
		  		this.play("die");
		    else if(this.p.vy != 0) {
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

		    this.add('2d, aiBounce, animation, DefaultEnemy');


		},


		step: function(dt) {

			if(this.p.vx != 0 && this.alive){
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
		    	asset: "princess2.png",
		    	
		    });
		},

		// Listen for a sprite collision, if it's the player,
		// end the game unless the enemy is hit on top
	
	});
	
	//SPRITE ONEUP
	Q.Sprite.extend("OneUp",{

	 
		init: function(p) {

			this.taken = false;
		 
		    this._super(p, {
		    	asset: "1up_mushroom.png",
		    	x: 2000,
		    	y: 430,
		    	vx: 100,
		    	sensor: true
		    });

		    this.on("hit.sprite",function(collision) {


				if(collision.obj.isA("Mario")) {
					if(!this.taken){
						this.taken = true;
						collision.obj.extralife();
						this.destroy();
					}
				}
			});

		}

	
	});
	//SPRITE BLOOPA
	Q.Sprite.extend("Bloopa",{

	 
		init: function(p) {

		 
		    this._super(p, {
		    	sheet: "bloopa",
		    	sprite: "Bloopa_anim",
		    	x: 200,
		    	y: 350,
		    	gravity: 1/4

		    });

		    this.add('2d, aiBounce, animation, DefaultEnemy');

			this.on("dead", this, "DEAD");
		},

		step: function(dt) {

			if(this.alive){
				this.play("standing");
				if(this.p.vy == 0)
					this.p.vy =  -300;
			}
			
		}
		// Listen for a sprite collision, if it's the player,
		// end the game unless the enemy is hit on top
	
	});

	//SPRITE COIN 
	Q.Sprite.extend("Coin",{

	 
		init: function(p) {

		 	this.taken = false;
		    this._super(p, {
		    	sheet: "coin",
		    	sprite: "Coin_anim",
		    	sensor: true
		    });

		    this.add('animation, tween');

		    this.on("hit.sprite",function(collision) {
				if(collision.obj.isA("Mario")) {
					if(!this.taken){
						this.taken = true;
						Q.audio.play("coin.mp3");
						this.animate({y: p.y-50}, 0.25, Q.Easing.Linear, {callback: this.destroy});
						Q.state.inc("score", 10);
					}
				}
			});
		},

		step: function(dt) {

			this.play("Shine");
		}
	
	});

////////////////////////////////////COMPONENTES////////////////////////////////////////////////////
	//COMPONENTE ENEMIGOS
	Q.component("DefaultEnemy", {
		
		added: function(){

			this.entity.alive = true;
			this.entity.on("bump.left,bump.right,bump.bottom",function(collision) {
				if(collision.obj.isA("Mario")) {
					collision.obj.Die();	
				}
			});

			this.entity.on("bump.top",function(collision, that) {
				if(collision.obj.isA("Mario")) {
					collision.obj.bounce();
					this.DEAD();
				}
			});

			this.entity.on("endAnim", this.entity, "die");

		},

		extend: {
			DEAD: function() {
				if(this.alive){
					Q.audio.play("squish_enemy.mp3");
					this.alive = false;
					Q.state.inc("score", 100);
					this.play("die");
					
				}
			},

			die: function(){
				this.destroy();
			}
		}

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
		fall_left: { frames: [18], loop: false },
		die: {frames: [12], loop: true}
	});

	//Animaciones Goomba
	Q.animations('Goomba_anim', {
		run: {frames: [0, 1], rate:1/3},
		die: {frames:[2], rate: 1/2, loop:false, trigger: "endAnim"}
	});

	//Animaciones Bloopa
	Q.animations('Bloopa_anim', {
		standing: {frames: [0,1], rate: 1/2},
		die: {frames: [2], rate: 1/2, loop:false, trigger: "endAnim"}
	});

	//Animaciones Coin
	Q.animations('Coin_anim', {
		Shine: {frames:[0,1,2], rate: 1/3, loop: true}
	})

///////////////////////////////////AUDIOS///////////////////////////////////////////////////////////
	//CARGA DE AUDIOS
	Q.load(["music_die.mp3", "music_level_complete.mp3", "music_main.mp3", "coin.mp3", "1up.mp3", "squish_enemy.mp3"], function(){

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

		Q.audio.play('music_main.mp3',{ loop: true });
		var player = stage.insert(new Q.Mario({x: 150,y: 380,}));
		stage.insert(new Q.Goomba({x: 1500,y: 450}));
		stage.insert(new Q.Goomba({x: 1450,y: 450}));
		stage.insert(new Q.Goomba({x: 600,y: 450}));
		stage.insert(new Q.Goomba({x: 850,y: 450}));
		stage.insert(new Q.OneUp({x: 26,y: 528}));
		stage.insert(new Q.Peach({x: 2000,y: 450}));
		stage.insert(new Q.Bloopa({x:700,y:420}));
		stage.insert(new Q.Bloopa({x:1300,y:45}));
		stage.insert(new Q.Bloopa({x:600,y:420}));
		stage.insert(new Q.Bloopa({x:800,y:420}));
		stage.insert(new Q.Coin({x:400,y:420}));
		stage.insert(new Q.Coin({x:430,y:420}));
		stage.insert(new Q.Coin({x:460,y:420}));
		stage.insert(new Q.Coin({x:500,y:420}));
		stage.insert(new Q.Coin({x:1500,y:480}));
		stage.insert(new Q.Coin({x:1530,y:480}));
		stage.add("viewport").follow(Q("Mario").first());
		stage.viewport.offsetX = -100;
		stage.viewport.offsetY = 160;


	});

	//TITULO DEL JUEGO
	Q.scene("mainTitle", function(stage){
		
		var button = new Q.UI.Button({
			x: Q.width/2, 
			y: Q.height/2,
			asset: "mainTitle2.png"

		})
		stage.insert(button);
		button.on("click",function() {
			Q.clearStages();
			Q.state.reset({ score: 0, lives: 2 });
			Q.stageScene("level1");
			Q.stageScene("hud", 3);
		});

	});

	//GAME OVER
	Q.scene('endGame',function(stage) {

		Q.audio.stop("music_main.mp3");	
		var container = stage.insert(new Q.UI.Container({
		
			x: Q.width/2, 
			y: Q.height/2,
			fill: "rgba(0,0,0,0.5)"
		
		}));
		var button = container.insert(new Q.UI.Button({ 
		
			x: 0,
			y: 0, 
			fill: "#CCCCCC",
			label: (Q.state.get("lives") > 0 ? "Play Again" : "GAME OVER")
		
		}))
		var label = container.insert(new Q.UI.Text({
			y: -10 - button.p.h,
			label: stage.options.label 
		}));
		// When the button is clicked, clear all the stages
		// and restart the game.
		
		button.on("click",function() {
			Q.clearStages();
			if( Q.state.get("lives") > 0){
				Q.stageScene('level1');
				Q.stageScene("hud", 3);
			}
			else
				Q.stageScene('mainTitle');
		});
		// Expand the container to visibily fit it's contents
		// (with a padding of 20 pixels)
		container.fit(20);
	});

	//HUD
    Q.scene("hud", function(stage) {
        /** Primero, voy a crear un "Container" que contendrá los labels. */
        var container = stage.insert(new Q.UI.Container({
            x: Q.width/3,
            y: Q.height/6,
            w: Q.width,
            h: 50,
            radius: 0
        }));
 
        /** Ahora voy a insertar los tres labels uno encima de otro. */
        container.insert(new Q.SCORE({
            x: container.p.x/2 - container.p.x,
            y: -container.p.y/3
        }));

        container.insert(new Q.LIVES({
            x: container.p.x/2 + container.p.x,
            y: -container.p.y/3
        }));

    });

/////////////////////////////////PARTES DEL HUD////////////////////////////////////////////////
    //SCORE
    Q.UI.Text.extend("SCORE", {
        init: function(p) {
            this._super(p, {
                label: "SCORE: " + Q.state.get("score"),
                    color: "white",
                    size: "14"
                });
            /** Necesito extender porque quiero escuchar los cambios de la variable en el "State". */
            Q.state.on("change.score", this, "update_label");
        },
 
        /**
        * Con esta función actualizo el label.
        */
        update_label: function(score) {
            this.p.label = "SCORE: " +  Q.state.get("score");
        }
    });

    //LIVES
    Q.UI.Text.extend("LIVES", {
        init: function(p) {
            this._super(p, {
                label: "LIVES: " + Q.state.get("lives"),
                    color: "white",
                    size: "14"
                });
            /** Necesito extender porque quiero escuchar los cambios de la variable en el "State". */
            Q.state.on("change.lives", this, "update_label");
        },
 
        /**
        * Con esta función actualizo el label.
        */
        update_label: function(score) {
            this.p.label = "LIVES: " + Q.state.get("lives");
        }
    });


////////////////////////////////BUCLE PRINCIPAL//////////////////////////////////////////////

/*
Preguntar:

-por animaciones de los enemigos al morir
-por el callback de coin

*/

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
