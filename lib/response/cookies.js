var cookie = require("./cookie");

/**
 * @class response.cookies
 */
class cookies {
	constructor() {
		this._cookies = [];
	}

	/**
	 * @function create
	 */
	create(key, value, options) {
		return new cookie(key, value, options);
	}

	/**
	 * @function add
	 */
	add(cookie_) {
		if(!(cookie_ instanceof cookie)) {
			throw new TypeError("the argument cookie_ must be a cookie");
		}

		if(typeof cookie_.key() !== "string") {
			throw new TypeError("the key of the inserted key must be a string");
		}

		this._cookies.push(cookie_);
	}

	/**
	 * @function get
	 */
	get(key) {
		if(typeof key !== "string") {
			throw new TypeError("the argument key must be a string");
		}

		return this.cookies[this._cookies.map(x => x.key()).indexOf(key)];
	}

	/**
	 * @function has
	 */
	has(key) {
		if(typeof key !== "string") {
			throw new TypeError("the argument key must be a string");
		}

		return this._cookies.map(x => x.key()).includes(key);
	}

	/**
	 * @function remove
	 */
	remove(key) {
		if(typeof key !== "string") {
			throw new TypeError("the argument key must be a string");
		}

		this._cookies.splice(this._cookies.map(x => x.key()).indexOf(key), 1);
	}

	/**
	 * @function list
	 */
	list() {
		return this._cookies.map(x => x.key());
	}

	/**
	 * @function clear
	 */
	clear() {
		this._cookies = [];
	}
}

module.exports = cookies;
