document.addEventListener("DOMContentLoaded", function () {
	nsIPCam.init();
})

var nsIPCam = {
	init: function () {
		console.log("ipcam init");

		nsIPCam.initPresets();
		nsIPCam.initButtons();
	},

	initPresets: function () {
		var parent = document.getElementById("presets");
		for (var i = 0, len = presets.length; i < len; i++ ) {
			console.log(presets[i].Name);
			var button = document.createElement("button");
			button.id = "preset" + presets[i].Id;
			button.className = "btn";
			button.innerHTML = presets[i].Name;

			// event listener toevoegen

			parent.appendChild(button);
		}
	},

	initButtons: function () {
		document.getElementById("left").addEventListener("click", function () {
			nsIPCam.moveCam("left");
		});
		document.getElementById("right").addEventListener("click", function () {
			nsIPCam.moveCam("right");
		});
	},


	moveCam: function (move) {

		// http://172.23.49.1/axis-cgi/com/ptz.cgi?camera=1&move=right
		console.log(move);
		nsUtils.ajax("http://172.23.49.1/axis-cgi/com/ptz.cgi?camera=1&pan=10", function () {

		});
	}
}
