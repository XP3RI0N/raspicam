var presets = [
	{
		id       : 1,
		name     : "Door",
		// nog verdere properties aan te vullen
		// Dit is tevens een preset op de camera zelf ('Home')
		pan      : -41.4844,
		tilt     : -16.5938,
		zoom     : 1,
		autofocus: "on"
	},
	{
		id       : 2,
		name     : "Blackboard",
		pan      : 87.0375,
		tilt     : -8.8594,
		zoom     : 976,
		autofocus: "on"
	},
	{
		id       : 3,
		name     : "Window",
		pan      : -176.4094,
		tilt     : -5.5688,
		zoom     : 2500,
		autofocus: "on"
	},
	{
		id	 	 : 4,
		name	 : "Overview",
		pan		 : 92.9344,
		tilt	 : -16.5938,
		zoom	 : 1,
		autofocus: "on"
	},
	{
		id       : 5,
		name     : "Extra",
		// Met deze gegevens richt de camera zich op de docent
		pan      : 94.6219,
		tilt     : -12.4125,
		zoom     : 3292,
		autofocus: "on"
	},

];

// squiggle and errors but it works ~ just nodejs things
exports.list = presets;
