var cookie = require("./cookie");

/**
 * @class response.cookies
 * @nofunction
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
		this._cookies.push(cookie_);
	}

	/**
	 * @function get
	 */
	get(key) {
		return this.cookies[this._cookies.map(x => x.key()).indexOf(key)];
	}

	/**
	 * @function has
	 */
	has(key) {
		return this._cookies.map(x => x.key()).includes(key);
	}

	/**
	 * @function remove
	 */
	remove(key) {
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
