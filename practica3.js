


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
	
	//SRITE MARIO
	Q.preload("mario_small.png");
	Q.load(["mario_small.png", "mario_small.json", "mainTitle.png"], function() {

		Q.sheet("mario_small", "mario_small.png", "mario_small.json");
		Q.compileSheets("mario_small.png","mario_small.json");
//		Q.stageScene("level1");
	});

	Q.Sprite.extend("Mario",{

	 
	  init: function(p) {

	 
	    this._super(p, {
	      	
	      	sheet: "marioR",  // Setting a sprite sheet sets sprite width and height
	    //  jumpSpeed: -400,
	    //	speed: 300,
	    	x: 150,
	    	y: 380,
	    	w: 32,
	    	h: 32

	    });

	    this.add('2d, platformerControls');

	  }



	
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

		//stage.add("viewport").centerOn(150,380);;
	});
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
