var accepts_ = require("accepts");

var accepts = module.exports = function(request) {
	// Set the local variables
	this.accepts = accepts_(request);
}

accepts.prototype.type = function(type) {
	if(type === undefined) {
		return accepts.types();
	}

	return accepts.type(type);
}

accepts.prototype.encoding = function(encoding) {
	if(encoding === undefined) {
		return accepts.encodings();
	}

	return accepts.encoding(encoding);
}

accepts.prototype.charset = function(charset) {
	if(charset === undefined) {
		return accepts.charsets();
	}

	return accepts.charset(charset);
}

accepts.prototype.language = function(language) {
	if(language === undefined) {
		return accepts.languages();
	}

	return accepts.language(language);
}