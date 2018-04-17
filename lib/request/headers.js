/**
 * @class request.headers
 * @nofunction
 */
class headers {
	constructor(request) {
		this._request = request;
	}

	/**
	 * @function get
	 */
	get(key) {
		if(typeof key !== "string") {
			throw new TypeError("argument key must be a string");
		}

		return this._request.headers[key.toLowerCase()];
	}

	/**
	 * @function has
	 */
	has(key) {
		if(typeof key !== "string") {
			throw new TypeError("argument key must be a string");
		}

		return this._headers.includes(key.toLowerCase());
	}

	/**
	 * @function list
	 */
	list() {
		return Object.keys(this._request.headers);
	}
}

module.exports = headers;