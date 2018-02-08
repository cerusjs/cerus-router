/**
 * @class request.cookies
 */
class cookies {
	constructor(request) {
		this._cookies = parse_cookies(request);
	}

	/**
	 * @function get
	 */
	get(key) {
		if(typeof key !== "string") {
			throw new TypeError("argument key must be a string");
		}

		return this._cookies[key];
	}

	/**
	 * @function has
	 */
	has(key) {
		if(typeof key !== "string") {
			throw new TypeError("argument key must be a string");
		}

		return this._cookies.includes(key);
	}

	/**
	 * @function list
	 */
	list() {
		return Object.keys(this._cookies);
	}
}

module.exports = cookies;

var parse_cookies = function(request) {
	var header = request.headers["cookie"];
	var cookies = {};

	if(header === undefined || header === "") {
		return {};
	}

	header = header.split("; ");

	for(var i = 0; i < header.length; i++) {
		var cookie = header[i];
		var split = cookie.indexOf("=");

		if(split < 0) {
			continue;
		}

		var key = cookie.substring(0, split).trim();
		var val = cookie.substring(split + 1, cookie.length).trim();

		if(val.startsWith("\"")) {
			val = val.slice(1, -1);
		}

		if(cookies[key] === undefined) {
			cookies[key] = val;
		}
	}

	return cookies;
};