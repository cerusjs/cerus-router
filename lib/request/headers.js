class headers {
	constructor(request) {
		this._request = request;
	}

	get(key) {
		if(typeof key !== "string") {
			throw new TypeError("argument key must be a string");
		}

		return this._request.headers[key.toLowerCase()];
	}

	has(key) {
		if(typeof key !== "string") {
			throw new TypeError("argument key must be a string");
		}

		return this._headers.includes(key.toLowerCase());
	}

	list() {
		return Object.keys(this._request.headers);
	}
}

module.exports = headers;