var accepts_ = require("accepts");

var accepts = module.exports = function(request) {
	this.accepts = accepts_(request);
}

accepts.prototype.type = function(type) {
	if(type == null) {
		return accepts.types();
	}

	return accepts.type(type);
}

accepts.prototype.encoding = function(encoding) {
	if(encoding == null) {
		return accepts.encodings();
	}

	return accepts.encoding(encoding);
}

accepts.prototype.charset = function(charset) {
	if(charset == null) {
		return accepts.charsets();
	}

	return accepts.charset(charset);
}

accepts.prototype.language = function(language) {
	if(language == null) {
		return accepts.languages();
	}

	return accepts.language(language);
}