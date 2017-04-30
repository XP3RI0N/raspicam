document.addEventListener("DOMContentLoaded", function () {
	nsIPCam.init();
})

var nsIPCam = {
	init: function () {
		nsIPCam.initPresets();
		nsIPCam.initButtons();
	},

	initPresets: function () {
		var parent = document.getElementById("presets");
		for (var i = 0, len = presets.length; i < len; i++) {
			var button       = document.createElement("button");
			button.id        = "preset" + presets[i].id;
			button.className = "btn";
			button.innerHTML = presets[i].name;

			// event listener toevoegen
			button.addEventListener("click", function () {
				nsIPCam.sendCommand({ command: "preset", param: parseInt(this.id.split("t")[1]) });
			})

			parent.appendChild(button);
		}
	},

	initButtons: function () {
		var buttons = document.querySelectorAll(".controlPanel > button")

		for (var i = 0, len = buttons.length; i < len; i++) {
			buttons[i].addEventListener("click", function () {
				nsIPCam.sendCommand({ command: "move", param: this.id });
			})
		}
	},

	sendCommand: function (command) {
		var socket = io();
		socket.emit("command", command);
	}


}
