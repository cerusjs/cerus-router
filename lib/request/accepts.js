const accepts_ = require("accepts");

/**
 * This is the accepts class. With this class you can check if the client accepts certain content 
 * types, encodings, charsets and/or languages.
 * @class request.accepts
 * @nofunction
 */
module.exports = class accepts {
	constructor(request) {
		this._accepts = accepts_(request);
	}

	/**
	 * With this function you can get or check what types are accepted. If the type parameter is 
	 * undefined it will return all the accepted types. You can also insert an array of types and 
	 * the first item that is accepted will be returned.
	 * @example
	 * // with as content-type "application/javascript"
	 * req.charset(["css", "js", "html"]);
	 * // -> will return "application/javascript"
	 * @summary Checks or returns what types are accepted.
	 * @param {String[]} (type) The array of types to check.
	 * @returns {String[]|String} Returns all accept types or the type that matched.
	 * @function type
	 */
	type(type) {
		if(type === undefined) return this._accepts.types();

		return this._accepts.type(type);
	}

	/**
	 * With this function you can get or check what encodings are accepted. If the type parameter 
	 * is undefined it will return all the accepted encodings. You can also insert an array of 
	 * encodings and the first item that is accepted will be returned.
	 * @example
	 * // with as content-type "deflate"
	 * req.charset(["utf-8", "deflate", "gzip"]);
	 * // -> will return "deflate"
	 * @summary Checks or returns what encodings are accepted.
	 * @param {String[]} (type) The array of encodings to check.
	 * @returns {String[]|String} Returns all accept encodings or the type that matched.
	 * @function encoding
	 */
	encoding(encoding) {
		if(encoding === undefined) return this._accepts.encodings();

		return this._accepts.encoding(encoding);
	}

	/**
	 * With this function you can get or check what charsets are accepted. If the type parameter is
	 *  undefined it will return all the accepted charsets. You can also insert an array of 
	 * charsets and the first item that is accepted will be returned.
	 * @example
	 * // with as content-type "utf-8"
	 * req.charset(["ascii", "utf-8", "utf-16"]);
	 * // -> will return "utf-8"
	 * @summary Checks or returns what charsets are accepted.
	 * @param {String[]} (type) The array of charsets to check.
	 * @returns {String[]|String} Returns all accept charsets or the type that matched.
	 * @function charset
	 */
	charset(charset) {
		if(charset === undefined) return this._accepts.charsets();

		return this._accepts.charset(charset);
	}

	/**
	 * With this function you can get or check what languages are accepted. If the type parameter 
	 * is undefined it will return all the accepted languages. You can also insert an array of 
	 * languages and the first item that is accepted will be returned.
	 * @example
	 * // with as content-type "en"
	 * req.charset(["nl", "en", "de"]);
	 * // -> will return "en"
	 * @summary Checks or returns what languages are accepted.
	 * @param {String[]} (type) The array of languages to check.
	 * @returns {String[]|String} Returns all accept languages or the type that matched.
	 * @function language
	 */
	language(language) {
		if(language === undefined) return this._accepts.languages();

		return this._accepts.language(language);
	}
}
