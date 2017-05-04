var gpio = require('gpio');
var gpio = require('gpio');
var Lcd = require('lcd');


// webserver
var request = require('request');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var monthNames = ["January", "February", "March", "April", "May", "June",
	"July", "August", "Septembr", "October", "November", "December"
];

server.listen(8080);

app.use(express.static('webinterface'));

io.on('connection', function (socket) {


	socket.on('command', function (msg) {

		console.log(msg);

		if (msg.command === "move") {
			moveCam(msg.param);
		} else if (msg.command === "preset") {
			moveCamToPreset(msg.param);
		}
	})

	socket.on('savePicture', function () {
		savePicture();
	})
});

//<editor-fold desc="pi hardware">
// GPIO
var gpio5 = gpio.export(5, {
	direction: "in",
	ready: function () {
		console.log("GPIO 5 - ready")
	}
});

// gpio5.on("change", function (val) {
// 	// value will report either 1 or 0 (number) when the value changes
// 	// console.log(val);
// 	if (val === 1) {
// 		moveCam("home");
// 		//console.log("DONG!");
// 		console.log("You've got company!");
// 		lcd.clear();
// 		lcd.setCursor(0, 0);
// 		lcd.print("Access granted");
// 	} else {
// 		console.log("DING DONG!");
// 	}
// });

// LCD
lcd = new Lcd({
	rs: 20,
	e: 16,
	data: [6, 13, 19, 26],
	cols: 16,
	rows: 2
});

lcd.on('ready', function () {
	console.log("LCD - ready");
	displayDateTime();

	// displayDateTime (Every second), cameraScan
	// Button pushed, stop displayDateTime
	// displayWelcomeMessage, moveCamToHome
	// takeScreenshot
	// Wait (5 seconds)
	// displayDateTime (Every second), cameraScan

	var displayFree, displayBusy;

	var v = gpio5.on("change", function () {
		if (v.value === 1) {
			displayFree = false;

			displayWelcomeAndMoveCamHome();

			clearTimeout(displayBusy);
			displayBusy = setTimeout(function () {
				displayFree = true;
			}, 3000);
		}
	});

	setInterval(function () {
		if (displayFree)
			displayDateTime();
	}, 1000);
});

function displayWelcomeAndMoveCamHome() {
	console.log("DING DONG! - You've got company!");
	moveCam("home");
	lcd.clear();
	lcd.setCursor(0, 0);

	if (Math.round(Math.random()) === 1) {
		lcd.print("Access granted");
		console.log("Access granted\n");
	} else {
		lcd.print("Access denied");
		console.log("Access denied\n");
	}
}

function displayDateTime() {
	var d = new Date();
	lcd.clear();
	lcd.setCursor(0, 0);
	lcd.print(d.toString().substring(16, 24));
	lcd.once("printed", function () {
		lcd.setCursor(0, 1);
		lcd.print(d.getDate().toString() + " " + monthNames[d.getMonth()] + " " + d.getFullYear().toString());
	});
}


// If ctrl+c is hit, free resources and exit.
process.on('SIGINT', function () {
	lcd.clear(
		function () {
			lcd.close(function () {
				process.exit();
			});
		}
	);
});
//</editor-fold>

function moveCam(move) {
	if (!move)
		return;

	move = move.toLowerCase();

	var url;
	switch (move) {
		case "zoomin":
			url = "http://172.23.49.1/axis-cgi/com/ptz.cgi?camera=1&rzoom=1000&autofocus=on";
			break;
		case "zoomout":
			url = "http://172.23.49.1/axis-cgi/com/ptz.cgi?camera=1&rzoom=-1000&autofocus=on";
			break;
		default:
			url = "http://172.23.49.1/axis-cgi/com/ptz.cgi?camera=1&move=" + move + "&autofocus=on";
	}

	request(url, {
		'auth': {
			'user': 'student',
			'pass': 'tasjekoffie',
			'sendImmediately': false
		}
	}, function (error, response, body) {
		if (body) {
			console.log("Error: " + body);
		}
	})
};

function moveCamToPreset(presetID) {
	if (!presetID)
		return;

	var presets = require('./webinterface/js/presets.js').list;
	var preset = presets[presetID - 1];

	console.log(preset);

	request("http://172.23.49.1/axis-cgi/com/ptz.cgi?camera=1&pan=" + preset.pan + "&tilt=" + preset.tilt + "&zoom=" + preset.zoom + "&autofocus=on", {
		'auth': {
			'user': 'student',
			'pass': 'tasjekoffie',
			'sendImmediately': false
		}
	}, function (error, response, body) {
		if (body) {
			console.log("Error: " + body);
		}
	})
}

function savePicture() {

	var http = require('http'),
		Stream = require('stream').Transform,
		fs = require('fs');

	var url = 'http://student:tasjekoffie@172.23.49.1/axis-cgi/jpg/image.cgi?resolution=320x240%20&camera=1&compression=25';

	http.request(url, function(response) {
		var data = new Stream();

		response.on('data', function(chunk) {
			data.push(chunk);
		});

		response.on('end', function() {
			var d = new Date(),
				fileName = "raspicam_" + ((d.getMonth() < 10) ? '0' + d.getMonth() : d.getMonth()) + ((d.getDate() < 10) ? '0' +d.getDate() : d.getDate()) + d.getFullYear() + ".jpg";
			console.log(fileName);
			fs.writeFileSync('./webinterface/images/' + fileName, data.read());
		});
	}).end();


}