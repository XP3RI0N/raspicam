var nsUtils = {

	ajax: function (url, callback) {
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function () {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					if (nsUtils.isJson(httpRequest.responseText))
						callback(JSON.parse(httpRequest.responseText));
					else
						callback(null);
				} else {
					return "error";
				}
			}
		};
		httpRequest.open("GET", url, true, "student", "vandeweek");

		httpRequest.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:63342");

		httpRequest.send();
	},

	isJson: function (string) {
		try {
			JSON.parse(string);
		} catch (e) {
			return false;
		}
		return true;
	}

}
