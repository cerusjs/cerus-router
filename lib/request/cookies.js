var cookies = module.exports = function(request) {
	// Set the local variables
	this._cookies = parse_cookies(request);
}

cookies.prototype.get = function(key) {
	// Check if the variables are correct
	if(typeof key !== "string") {
		throw new TypeError("argument key must be a string");
	}

	return this._cookies[key];
}

cookies.prototype.has = function(key) {
	// Check if the variables are correct
	if(typeof key !== "string") {
		throw new TypeError("argument key must be a string");
	}

	return this._cookies.includes(key);
}

cookies.prototype.list = function() {
	return Object.keys(this._cookies);
}

function parse_cookies(request) {
	var cks = request.headers["cookie"];
	var cookies = {};

	if(cks == null || cks == "") {
		return;
	}

	if(cks.indexOf(";") < 0) {
		cks = new Array(cks);
	}
	else {
		cks = cks.split(/; */);
	}

	for(var i = 0; i < cks.length; i++) {
		var cookie = cks[i];
		var split = cookie.indexOf("=");

		if(split < 0) {
			continue;
		}

		var key = cookie.substring(0, split).trim();
		var val = cookie.substring(split + 1, cookie.length).trim();

		if(val.startsWith("\"")) {
			val = val.slice(1, -1);
		}

		if(cookies[key] == undefined) {
			cookies[key] = val;
		}
	}

	return cookies;
}