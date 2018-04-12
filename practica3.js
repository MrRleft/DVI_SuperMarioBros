

var game = function() {
	// Set up an instance of the Quintus engine and include
	// the Sprites, Scenes, Input and 2D module. The 2D module
	// includes the `TileLayer` class as well as the `2d` componet.
	var Q = window.Q = Quintus()
			.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
			// Maximize this game to whatever the size of the browser is
			.setup({ maximize: true })
			// And turn on default input controls and touch input (for UI)
			.controls().touch()

	// ## Player Sprite
	// The very basic player sprite, this is just a normal sprite
	// using the player sprite sheet with default controls added to it.
	Q.Sprite.extend("Player",{
		// the init constructor is called on creation
		init: function(p) {
		// You can call the parent's constructor with this._super(..)
			this._super(p, {
				sheet: "player", // Setting a sprite sheet sets sprite width and height
				x: 410, // You can also set additional properties that can
				y: 90 // be overridden on object creation
			});
			// Add in pre-made components to get up and running quickly
			// The `2d` component adds in default 2d collision detection
			// and kinetics (velocity, gravity)
			// The `platformerControls` makes the player controllable by the
			// default input actions (left, right to move, up or action to jump)
			// It also checks to make sure the player is on a horizontal surface before
			// letting them jump.
			this.add('2d, platformerControls');
			// Write event handlers to respond hook into behaviors.
			3
			// hit.sprite is called everytime the player collides with a sprite
			this.on("hit.sprite",function(collision) {
			// Check the collision, if it's the Tower, you win!
				if(collision.obj.isA("Tower")) {
				Q.stageScene("endGame",1, { label: "You Won!" });
				this.destroy();
				}
			});
		}
	});


}
