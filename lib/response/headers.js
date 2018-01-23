class headers {
	constructor(response) {
		this._response = response;
		this._headers = [];
	}

	set(key, value = null) {
		var value_ = value;

		// Check if the variables are correct
		if(typeof key !== "string") {
			throw new TypeError("the argument key must be a string");
		}

		if(this._response.finished) {
			return;
		}

		value_ = Array.isArray(value_) ? value_.map(String) : String(value_);

		this._headers.push(key);
		this._response.setHeader(key, value_);
	}

	get(key) {
		if(typeof key !== "string") {
			throw new TypeError("the argument key must be a string");
		}
		
		return this._response.getHeader(key);
	}

	has(key) {
		if(typeof key !== "string") {
			throw new TypeError("the argument key must be a string");
		}
		
		return this._response.hasHeader(key);
	}

	remove(key) {
		if(typeof key !== "string") {
			throw new TypeError("the argument key must be a string");
		}

		if(!this._headers.includes(key)) {
			throw new Error("the specified header doesn't exist");
		}
		
		this._headers.splice(this._headers.indexOf(key));

		this._response.removeHeader(key);
	}

	append(key, value) {
		if(typeof key !== "string") {
			throw new TypeError("the argument key must be a string");
		}

		if(typeof value !== "string") {
			throw new TypeError("the argument value must be a string");
		}

		if(this._response.finished) {
			return;
		}

		var header = this.get(key);
		var val = value;

		if(header) {
			val = Array.isArray(header) ? header.concat(value) : Array.isArray(value) ? [header].concat(value) : [header, value];
		}

		this.set(key, val);
	}

	clear() {
		this._headers = [];
	}

	list() {
		this._headers;
	}
}

module.exports = headers;
