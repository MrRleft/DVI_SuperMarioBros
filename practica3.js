


var game = function() {
	// Set up an instance of the Quintus engine and include
	// the Sprites, Scenes, Input and 2D module. The 2D module
	// includes the `TileLayer` class as well as the `2d` componet.
	var Q = Quintus({ development: true }).include("Sprites, Scenes, Anim, TMX, Input, Touch, UI").setup({
			width: 320, // Set the default width to 800 pixels
			height: 480, // Set the default height to 600 pixels
			downsampleWidth: 640, // Halve the pixel density if resolution
			downsampleHeight: 960 // is larger than or equal to 1024x768
		}).controls().touch();


}
