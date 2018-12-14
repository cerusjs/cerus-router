/**
 * This is the cookies class. With this class you can get the cookies that were sent by the client.
 * @class request.cookies
 * @nofunction
 */
module.exports = class cookies {
	constructor(request) {
		this._cookies = this._parse_cookies(request);
	}

	_parse_cookies(request) {
		const header = request.headers().get("cookie");
		const cookies = {};
	
		if(header === undefined) return cookies;
	
		header.split("; ").forEach(cookie => {
			const split_index = cookie.indexOf("=");

			if(split_index < 0) return;

			const key = cookie.substring(0, split_index).trim();
			const value = cookie.substring(split_index + 1, cookie.length).trim();

			if(value.startsWith("\"")) value = value.slice(1, value.length - 1);
			if(value.endsWith("\"")) value = value.slice(0, value.length - 2);

			if(cookies[key] !== undefined) return;

			cookies[key] = value;
		});
	
		return cookies;
	}

	/**
	 * With this function you can get a certain cookie that has been sent by the client. You 
	 * specify the cookie you want to get using the key parameter. If the key parameter isn't a 
	 * string it'll throw a TypeError and when the cookie wasn't found it'll return undefined.
	 * @summary Returns the specified cookie.
	 * @return {String} The specified cookie.
	 * @function get
	 */
	get(key) {
		return this._cookies[key];
	}

	/**
	 * This function returns if the client has sent the specified cookie. You can specify the 
	 * cookie you want to check using the key parameter. If the key parameter isn't a string it'll
	 * throw a TypeError.
	 * @summary Checks if the cookie exists.
	 * @return {Boolean} If the cookie exists.
	 * @function has
	 */
	has(key) {
		return this._cookies.includes(key);
	}

	/**
	 * This function returns an array of the names of all the cookies that were sent by the client.
	 * @summary Returns an array of all the cookies.
	 * @returns {String[]} An array of all the cookies.
	 * @function list
	 */
	list() {
		return Object.keys(this._cookies);
	}
}