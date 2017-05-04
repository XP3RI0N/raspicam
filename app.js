var gpio    = require('gpio');
var Lcd     = require('lcd');


// webserver
var request = require('request');
var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);

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
});

//<editor-fold desc="pi hardware">
// GPIO
var gpio5 = gpio.export(5, {
	direction: "in",
	ready    : function () {
		console.log("gpio 5 ready")
	}
});

gpio5.on("change", function (val) {
	// value will report either 1 or 0 (number) when the value changes
	console.log(val)
	if (val === 1) {
		moveCam("home");
	}
});

// LCD
lcd = new Lcd({
	rs  : 20,
	e   : 16,
	data: [6, 13, 19, 26],
	cols: 16,
	rows: 2
});

lcd.on('ready', function () {
	var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "Septembr", "October", "November", "December"
];

	console.log("lcd ready");
	setInterval(function () {
		var d = new Date();
		lcd.setCursor(0, 0);
		lcd.print(d.toString().substring(16, 24));
		lcd.once("printed", function () {
			lcd.setCursor(0, 1);
			// lcd.print("Push the button");
			lcd.print(d.getDate().toString() + " " + monthNames[d.getMonth()] + " " + d.getFullYear().toString());
		})
	}, 1000);
});

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
	switch(move) {
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
			'user'           : 'student',
			'pass'           : 'tasjekoffie',
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
			'user'           : 'student',
			'pass'           : 'tasjekoffie',
			'sendImmediately': false
		}
	}, function (error, response, body) {
		if (body) {
			console.log("Error: " + body);
		}
	})

}
