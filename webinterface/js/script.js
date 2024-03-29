document.addEventListener("DOMContentLoaded", function () {
	nsIPCam.init();
})

var nsIPCam = {
	init: function () {
		nsIPCam.initPresets();
		nsIPCam.initButtons();
		nsIPCam.initPictures();

		var socket = io();
		socket.on("image", function (fileName) {
			//console.log(fileName);
			nsIPCam.newPicture(fileName);
		});
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
		var buttons = document.querySelectorAll(".controlPanel > button");

		for (var i = 0, len = buttons.length; i < len; i++) {
			buttons[i].addEventListener("click", function () {
				nsIPCam.sendCommand({ command: "move", param: this.id });
			});
		}

		document.getElementById("photo").addEventListener("click", function () {
			nsIPCam.savePicture();
		});

		document.getElementById("scan").addEventListener("change", function () {
			//console.log(this.checked);
			nsIPCam.changeScanStatus(this.checked);
		});
	},

	sendCommand: function (command) {
		var socket = io();
		socket.emit("command", command);
	},

	savePicture: function () {
		var socket = io();
		socket.emit("savePicture");
	},

	initPictures: function () {
		var sec = document.getElementById("photos");

		nsUtils.ajax("./imagelist", function (imageArray) {
			for (var i = 0, len = imageArray.length; i < len; i++) {
				var img   = document.createElement("img");
				var index = len - i - 1;
				img.src   = imageArray[index];
				img.title = imageArray[index].substring(16, 35);
				sec.appendChild(img);
			}

		});
	},

	newPicture: function (fileName) {
		var sec   = document.getElementById("photos");
		var img   = document.createElement("img");
		img.src   = "images/" + fileName;
		img.title = fileName.substr(9, 19);
		sec.insertBefore(img, sec.childNodes[0]);
	},

	changeScanStatus: function (status) {
		var socket = io();
		socket.emit("scanStatus", status);
	}

}
