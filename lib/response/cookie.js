/**
 * This is the cookie class. It is basically a model of a cookie, meaning that with this class you 
 * can edit a cookie that will be send to the client. To send it to client you do need to add it
 * using response.cookies().add(cookie).
 * @example
 * var cookie = response.cookies().create("key", "value");
 * cookie.path("/test");
 * response.cookies().add(cookie);
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
	 * This is the setter and getter for the cookie's key. The key of the cookie is used to
	 * identify the cookie. 
	 * @summary The setter/getter for the key setting.
	 * @param {String} (key) The new key setting.
	 * @return {String} The key setting.
	 * @function key
	 */
	key(key) {
		if(key === undefined) return this._key;

		return this._key = key;
	}

	/**
	 * This is the setter and getter for the cookie's value. The value of the cookie is the data 
	 * that the cookie will save on the client.
	 * @summary The setter/getter for the value setting.
	 * @param {String} (value) The new value setting.
	 * @return {String} The value setting.
	 * @function value
	 */
	value(value) {
		if(value === undefined) return this._value;

		return this._value = value;
	}

	/**
	 * This is the setter and getter for the maxage setting. The maxage is the maximum age until 
	 * the client will remove the cookie. It is different from the expires setting in that this
	 * setting sets a time in seconds until the cookie will expire and the expires setting will
	 * expire at the selected data.
	 * @summary The setter/getter for the maxage setting.
	 * @param {Number} (key) The new maxage setting.
	 * @return {Number} The maxage setting.
	 * @function maxage
	 */
	maxage(maxage) {
		if(maxage === undefined) return this._options["maxage"];

		return this._options["maxage"] = maxage;
	}

	/**
	 * This is the setter and getter for the domain setting. This setting sets the domain that the 
	 * cookie is allowed to be send to.
	 * @summary The setter/getter for the domain setting.
	 * @param {String} (key) The new domain setting.
	 * @return {String} The domain setting.
	 * @function domain
	 */
	domain(domain) {
		if(domain === undefined) return this._options["domain"];

		return this._options["domain"] = domain;
	}

	/**
	 * This is the setter and getter for the path setting. This setting sets the path that the 
	 * cookie is allowed to be send to.
	 * @summary The setter/getter for the path setting.
	 * @param {String} (key) The new path setting.
	 * @return {String} The path setting.
	 * @function path
	 */
	path(path) {
		if(path === undefined) return this._options["path"];

		return this._options["path"] = path;
	}

	/**
	 * This is the setter and getter for the expires setting. The expires sets a date where the 
	 * cookie will expire. It is different from the maxage setting in that this setting will make 
	 * the cookie expire at the selected data and the maxage setting will set a time in seconds 
	 * until the cookie will expire.
	 * @summary The setter/getter for the expires setting.
	 * @param {Date} (key) The new expires setting.
	 * @return {Date} The expires setting.
	 * @function expires
	 */
	expires(expires) {
		if(expires === undefined) return this._options["expires"];

		return this._options["expires"] = expires;
	}

	/**
	 * This is the setter and getter for the httponly setting. This setting sets if the cookie is 
	 * only allowed to be send over http(s) and not be set by the client itself.
	 * @summary The setter/getter for the httponly setting.
	 * @param {Boolean} (key) The new httponly setting.
	 * @return {Boolean} The httponly setting.
	 * @function httponly
	 */
	httponly(httponly) {
		if(httponly === undefined) return this._options["httponly"];

		return this._options["httponly"] = httponly;
	}

	/**
	 * This is the setter and getter for the secure setting. This setting sets if the cookie may
	 * only be send over https connections to make sure it's contents are never compromised.
	 * @summary The setter/getter for the secure setting.
	 * @param {Boolean} (key) The new secure setting.
	 * @return {Boolean} The secure setting.
	 * @function secure
	 */
	secure(secure) {
		if(secure === undefined) return this._options["secure"];

		return this._options["secure"] = secure;
	}

	/**
	 * This is the setter and getter for the same setting. This setting sets if the cookie is only 
	 * allowed to be send to the same site where it came from. There are two options for this: 
	 * "lax" will allow the client to send the cookie to other sites and "strict" tells the client 
	 * to only send the cookie to the set domain.
	 * @summary The setter/getter for the same setting.
	 * @param {String} (key) The new same setting.
	 * @return {String} The same setting.
	 * @function same
	 */
	same(same) {
		if(same === undefined) return this._options["same"];

		return this._options["same"] = same;
	}

	/**
	 * This function will build the cookie using the settings set in this class. It will return a 
	 * string with the build cookie in it.
	 * @summary Builds the cookie.
	 * @return {String} The built cookie.
	 * @function build
	 */
	build() {
		var cookie = `${this._key}=${this._value}; Path=${this._options.path || "/"}`;

		if(this._options.maxage) {
			cookie += `; Max-Age=${Math.floor(this._options.maxage)}`;
		}

		if(this._options.domain) {
			cookie += `; Domain=${this._options.domain}`;
		}

		if(this._options.expires) {
			cookie += `; Expires=${this._options.expires.toUTCString()}`;
		}

		if(this._options.httponly) {
			cookie += "; HttpOnly";
		}

		if(this._options.secure) {
			cookie += "; Secure";
		}

		if(this._options.same) {
			switch(this._options.same) {
				case "lax":
					cookie += "; SameSite=Lax";
					break;

				case "strict":
					cookie += "; SameSite=Strict";
					break;

				default:
					cookie += `; SameSite=${this._options.same}`;
					break;
			}
		}

		return cookie;
	}
}

module.exports = cookie;