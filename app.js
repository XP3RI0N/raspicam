var request = require('request');
var gpio    = require('gpio');
var Lcd     = require('lcd');

// webserver
var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);

server.listen(8080);

app.use(express.static('webinterface'));

io.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
	});
});


// var express = require('express');

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
  "July", "August", "September", "October", "November", "December"
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


function moveCam(move) {
	if (!move)
		return;

	request("http://172.23.49.1/axis-cgi/com/ptz.cgi?camera=1&move=" + move, {
		'auth': {
			'user'           : 'student',
			'pass'           : 'vandeweek',
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

	var preset = presets[presetID - 1];

	request("http://172.23.49.1/axis-cgi/com/ptz.cgi?camera=1&pan=" + preset.pan + "&tilt=" + preset.tilt + "&zoom=" + preset.zoom, {
		'auth': {
			'user'           : 'student',
			'pass'           : 'vandeweek',
			'sendImmediately': false
		}
	}, function (error, response, body) {
		if (body) {
			console.log("Error: " + body);
		}
	})
}
