/**
 * This is the headers class. With this class you can get the headers that were sent by the client.
 * @class request.headers
 * @nofunction
 */
class headers {
	constructor(request) {
		this._request = request;
	}

	/**
	 * With this function you can get a certain header that has been sent by the client. You 
	 * specify the header you want to get using the key parameter. If the key parameter isn't a 
	 * string it'll throw a TypeError and when the header wasn't found it'll return undefined.
	 * @summary Returns the specified header.
	 * @return {String} The specified header.
	 * @function get
	 */
	get(key) {
		return this._request.headers[key.toLowerCase()];
	}

	/**
	 * This function returns if the client has sent the specified header. You can specify the 
	 * header you want to check using the key parameter. If the key parameter isn't a string it'll
	 * throw a TypeError.
	 * @summary Checks if the header exists.
	 * @return {Boolean} If the header exists.
	 * @function has
	 */
	has(key) {
		return this._headers.includes(key.toLowerCase());
	}

	/**
	 * This function returns an array of the names of all the headers that were sent by the client.
	 * @summary Returns an array of all the headers.
	 * @return {String[]} An array of all the headers.
	 * @function list
	 */
	list() {
		return Object.keys(this._request.headers);
	}
}

module.exports = headers;