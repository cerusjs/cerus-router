var accepts_ = require("accepts");

var accepts = module.exports = function(request) {
	// Set the local variables
	this.accepts = accepts_(request);
};

accepts.prototype.type = function(type) {
	if(type === undefined) {
		return this.accepts.types();
	}

	return this.accepts.type(type);
};

accepts.prototype.encoding = function(encoding) {
	if(encoding === undefined) {
		return this.accepts.encodings();
	}
	
	return this.accepts.encoding(encoding);
};

accepts.prototype.charset = function(charset) {
	if(charset === undefined) {
		return this.accepts.charsets();
	}

	return this.accepts.charset(charset);
};

accepts.prototype.language = function(language) {
	if(language === undefined) {
		return this.accepts.languages();
	}

	return this.accepts.language(language);
};