var accepts_ = require("accepts");

class accepts {
	constructor(request) {
		this._accepts = accepts_(request);
	}

	type(type) {
		if(type === undefined) {
			return this._accepts.types();
		}

		return this._accepts.type(type);
	}

	encoding(encoding) {
		if(encoding === undefined) {
			return this._accepts.encodings();
		}

		return this._accepts.encoding(encoding);
	}

	charset(charset) {
		if(charset === undefined) {
			return this._accepts.charsets();
		}

		return this._accepts.charset(charset);
	}

	language(language) {
		if(language === undefined) {
			return this._accepts.languages();
		}

		return this._accepts.language(language);
	}
}

module.exports = accepts;
