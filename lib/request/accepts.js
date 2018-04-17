var accepts_ = require("accepts");

/**
 * @class request.accepts
 * @nofunction
 */
class accepts {
	constructor(request) {
		this._accepts = accepts_(request);
	}

	/**
	 * @function type
	 */
	type(type) {
		if(type === undefined) {
			return this._accepts.types();
		}

		return this._accepts.type(type);
	}

	/**
	 * @function encoding
	 */
	encoding(encoding) {
		if(encoding === undefined) {
			return this._accepts.encodings();
		}

		return this._accepts.encoding(encoding);
	}

	/**
	 * @function charset
	 */
	charset(charset) {
		if(charset === undefined) {
			return this._accepts.charsets();
		}

		return this._accepts.charset(charset);
	}

	/**
	 * @function language
	 */
	language(language) {
		if(language === undefined) {
			return this._accepts.languages();
		}

		return this._accepts.language(language);
	}
}

module.exports = accepts;
