/**
 * @class response.cookie
 * @nofunction
 */
class cookie {
	constructor(key, value, options = {}) {
		this._key = key;
		this._value = value;
		this._options = options;
	}

	/**
	 * @function key
	 */
	key(key) {
		if(typeof key === "string") {
			this._key = key;
		}

		return this._key;
	}

	/**
	 * @function value
	 */
	value(value) {
		if(typeof value === "string") {
			this._value = value;
		}

		return this._value;
	}

	/**
	 * @function maxage
	 */
	maxage(maxage) {
		if(typeof maxage === "number") {
			this._options["maxage"] = maxage;
		}

		return this._options["maxage"];
	}

	/**
	 * @function domain
	 */
	domain(domain) {
		if(typeof domain === "string") {
			this._options["domain"] = domain;
		}

		return this._options["domain"];
	}

	/**
	 * @function path
	 */
	path(path) {
		if(typeof path === "string") {
			this._options["path"] = path;
		}

		return this._options["path"];
	}

	/**
	 * @function expires
	 */
	expires(expires) {
		if(expires instanceof Date) {
			this._options["expires"] = expires;
		}

		return this._options["expires"];
	}

	/**
	 * @function httponly
	 */
	httponly(httponly) {
		if(typeof httponly === "boolean") {
			this._options["httponly"] = httponly;
		}

		return this._options["httponly"];
	}

	/**
	 * @function secure
	 */
	secure(secure) {
		if(typeof secure === "boolean") {
			this._options["secure"] = secure;
		}

		return this._options["secure"];
	}

	/**
	 * @function same
	 */
	same(same) {
		if(typeof same === "string") {
			this._options["same"] = same;
		}

		return this._options["same"];
	}

	/**
	 * @function build
	 */
	build() {
		var cookie = this._key + "=" + this._value;

		this._options.path = this._options.path || "/";

		if(typeof this._options.maxage === "string") {
			cookie += "; Max-Age=" + Math.floor(this._options.maxage);
		}

		if(typeof this._options.domain === "string") {
			cookie += "; Domain=" + this._options.domain;
		}

		if(typeof this._options.path === "string") {
			cookie += "; Path=" + this._options.path;
		}

		if(this._options.expires instanceof Date) {
			cookie += "; Expires=" + this._options.expires.toUTCString();
		}

		if(this._options.httponly) {
			cookie += "; HttpOnly";
		}

		if(this._options.secure) {
			cookie += "; Secure";
		}

		if(typeof this._options.same === "string") {
			switch(this._options.same) {
				case "lax":
					cookie += "; SameSite=Lax";
					break;
				case "strict":
				default:
					cookie += "; SameSite=Strict";
					break;
			}
		}

		return cookie;
	}
}

module.exports = cookie;