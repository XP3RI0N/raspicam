// var express = require('express');

var gpio  = require('gpio');
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
		moveCam();
	}
});

var Lcd = require('lcd'),
	lcd = new Lcd({
		rs  : 20,
		e   : 16,
		data: [6, 13, 19, 26],
		cols: 16,
		rows: 2
	});

lcd.on('ready', function () {
	console.log("lcd ready");
	setInterval(function () {
		lcd.setCursor(0, 0);
		lcd.print(new Date().toString().substring(16, 24));
		lcd.once("printed", function () {
			lcd.setCursor(0, 1);
			lcd.print("Push the button");
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

	//lcd.close();
	//process.exit();
});


function moveCam() {
	var request = require('request');

	request("http://172.23.49.1/axis-cgi/com/ptz.cgi?camera=1&pan=10", {
		'auth': {
			'user'           : 'student',
			'pass'           : 'vandeweek',
			'sendImmediately': false
		}
	}, function (error, response, body) {
		if (body) {
			console.log("Fout: " + body);
		}
	})
};
