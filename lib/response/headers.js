/**
 * @class response.headers
 * @nofunction
 */
module.exports = class headers {
	constructor(response) {
		this._response = response;
		this._headers = [];
	}

	/**
	 * @function set
	 */
	set(key, value) {
		if(this._response.finsihed) return;

		this._headers.push(key);
		this._response.setHeader(key, value);
	}

	/**
	 * @function get
	 */
	get(key) {
		return this._response.getHeader(key);
	}

	/**
	 * @function has
	 */
	has(key) {
		return this._response.hasHeader(key);
	}

	/**
	 * @function remove
	 */
	remove(key) {
		if(!this._headers.includes(key)) throw new Error("the specified header doesn't exist");
		
		this._headers.splice(this._headers.indexOf(key));
		this._response.removeHeader(key);
	}

	/**
	 * @function append
	 */
	append(key, value) {
		if(this._response.finished) return;

		const header = this.get(key);

		if(Array.isArray(header)) {
			new_value = header.concat(value);
		}
		else if(Array.isArray(value)) {
			new_value = [header].concat(value);
		}
		else if(header === undefined) {
			new_value = value;
		}
		else {
			new_value = [header, value];
		}

		this.set(key, val);
	}

	/**
	 * @function clear
	 */
	clear() {
		this._headers.forEach(header => this.remove(header));
		this._headers = [];
	}

	/**
	 * @function list
	 */
	list() {
		return this._headers;
	}
}
