// var express = require('express');
// var gpio = require('gpio');

var Lcd = require('lcd'),

	lcd = new Lcd({
		rs: 20,
		e: 16,
		data: [6, 13, 19, 26],
		cols: 16,
		rows: 2
	});

lcd.on('ready', function() {
	console.log("lcd ready");
	setInterval(function() {
		lcd.setCursor(0, 0);
		lcd.print(new Date().toString().substring(16, 24));
		lcd.once("printed", function() {
			lcd.setCursor(0, 1);
			lcd.print("Push the button");
		})
	}, 1000);
});

// If ctrl+c is hit, free resources and exit.
process.on('SIGINT', function() {
	lcd.clear();

	lcd.close();
	process.exit();
});
