document.addEventListener("DOMContentLoaded", function () {
	nsIPCam.init();
})

var nsIPCam = {
	init: function () {
		console.log("ipcam init");


		nsIPCam.initButtons();
	},

	initButtons: function () {
		document.getElementById("panLeft").addEventListener("click", nsIPCam.panLeft);
		document.getElementById("panRight").addEventListener("click", nsIPCam.panRight);
	},

	panLeft: function () {
		console.log("panLeft");
		nsUtils.ajax("http://172.23.49.1/axis-cgi/com/ptz.cgi?camera=1&pan=10", function () {

		});
	},

	panRight   : function () {
		console.log("panRight");
		nsUtils.ajax("http://172.23.49.1/axis-cgi/com/ptz.cgi?camera=1&pan=-10", function () {

		});
	}





}

