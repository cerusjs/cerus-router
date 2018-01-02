var cerus;
var mime = require("mime");
var headers = require("./response/headers");
var cookies = require("./response/cookies");
var cookie = require("./response/cookie");

var response = module.exports = function(response, request, cerus_) {
	this._response = response;
	this._request = request;
	this._headers = new headers(response);
	this._cookies = new cookies();
	this._compression = cerus_.compression(cerus_.settings().compression().type());

	cerus = cerus_;
}

response.prototype.status = response.prototype.code = function(code) {
	if(typeof code !== "number") {
		this._response.statusCode = code;
	}

	return this._response.statusCode;
}

response.prototype.ended = response.prototype.finished = function() {
	return this._response.finished;
}

response.prototype.headers = function() {
	return this._headers;
}

response.prototype.cookies = function() {
	return this._cookies;
}

response.prototype.location = function(url) {
	if(typeof url !== "string") {
		throw new TypeError("argument url must be a string");
	}

	if(url == "back") {
		url = this.headers().get("Referrer") || "/";
	}

	this.headers().set("Location", url);
}

response.prototype.redirect = function(url) {
	if(typeof url !== "string") {
		throw new TypeError("argument url must be a string");
	}

	this.location(url);
	this.status(302);
	this.end();
}

response.prototype.type = function(type) {
	if(typeof type === "string") {
		self.headers().set("Content-Type", mime.getType(type));
	}

	return self.headers().get("Content-Type");
}

response.prototype.end = function() {
	this._response.end();
}

response.prototype.send = function(body, encoding) {
	body = body || "";
	encoding = encoding || "utf-8";

	if(this._response.finished) {
		return;
	}

	if(typeof body == "object") {
		return this.json(body);
	}
	else {
		if(!this.headers().get("Content-Type")) {
			this.type("html");
		}
	}

	apply_cookies(this._cookies, this._response);

	if(!this.headers().get("ETag")) {
		var length = 0;

		if(body.length < 0) {
			length = Buffer.byteLength(body, encoding);
		}
		else if(!Buffer.isBuffer(body)) {
			body = Buffer.from(body, encoding);
			encoding = undefined;
			length = body.length;
		}
		else {
			length = body.length;
		}

		this.headers().set("Content-Length", length);
	}

	if(cerus.settings().compression().on() && 
		request.accepts().encoding(this._compression.settings().type())) {
		this._compression.compress(body)
		.then(function(compressed) {
			if(!this.headers().get("ETag")) {
				this.headers().set("Content-Length", compressed.length);
			}

			this.headers().set("Content-Encoding", this._compression.settings().type());

			response.end(compressed, encoding);
		});
	}
	else {
		response.end(body, encoding);
	}
}

response.prototype.json = function(body) {
	if(typeof body !== "object") {
		throw new TypeError("argument body must be an object");
	}

	if(!this.headers().get("Content-Type")) {
		this.type("json");
	}

	this.send(JSON.stringify(body));
}

response.prototype.file = function(file_) {
	this.send(file_.data());
}

response.prototype.download = function(file_, name) {
	file = file || "";
	name = name || "file.txt";

	if(file_ instanceof file) {
		if(!this.headers().get("Content-Disposition")) {
			this.headers().set("Content-Disposition", "attachment; filename=" + file_.name());
		}

		this.file(file_);
	}
	else {
		if(!this.headers().get("Content-Disposition")) {
			this.headers().set("Content-Disposition", "attachment; filename=" + name);
		}

		this.send(file_);
	}
}

function apply_cookies(cookies, response) {
	for(var i = 0; i < this._cookies._cookies.length; i++) {
		self.headers().append("Set-Cookie", this._cookies._cookies[i].build());
	}
}

/*
module.exports = function(response, request, cerus) {
	var self = {};

	var mime = require("mime");
	var compression = cerus.compression(cerus.settings().compression().type());
	var cookies = {};

	self.code = self.status = function(code) {
		if(code != null) {
			response.statusCode = code;
		}

		return response.statusCode;
	}

	self.ended = function() {
		return response.finished;
	}

	self.headers = function() {
		var self_ = {};

		self_.set = function(key, value) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}

			value = value || null;

			if(response.finished) {
				return;
			}

			value = Array.isArray(value) ? value.map(String) : String(value);

			response.setHeader(key, value);
		}

		self_.get = function(key) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}
			
			return response.getHeader(key);
		}

		self_.has = function(key) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}
			
			return response.hasHeader(key);
		}

		self_.remove = function(key) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}
			
			response.removeHeader(key);
		}

		self_.append = function(key, value) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}
			if(typeof value !== "string") {
				throw new TypeError("argument value must be a string");
			}

			if(response.finished) {
				return;
			}

			var header = self_.get(key);
			var val = value;

			if(header) {
				val = Array.isArray(header) ? header.concat(value)
					: Array.isArray(value) ? [header].concat(value)
					: [header, value];
			}

			self_.set(key, val);
		}

		return self_;
	}

	var set_cookies = function() {
		for(var key in cookies) {
			self.headers().append("Set-Cookie", cookies[key]);
		}
	}

	self.cookies = function() {
		var self_ = {};

		self_.set = function(key, value, options) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}
			if(typeof value !== "string") {
				throw new TypeError("argument value must be a string");
			}

			options = options || {};
			options.path = options.path || "/";

			var str = key + "=" + value;

			if(options.age) {
				str += '; Max-Age=' + Math.floor(options.maxage);
			}

			if(options.domain) {
				str += '; Domain=' + options.domain;
			}

			if(options.path) {
				str += '; Path=' + options.path;
			}

			if(options.expires) {
				str += '; Expires=' + options.expires.toUTCString();
			}

			if(options.http) {
				str += '; HttpOnly';
			}

			if(options.secure) {
				str += '; Secure';
			}

			if(options.same) {
				switch(options.same) {
					case "lax":
						str += "; SameSite=Lax";
						break;
					case "strict":
					default:
						str += "; SameSite=Strict";
						break;
				}
			}

			cookies[key] = str;
		}

		self_.get = function(key) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}

			return cookies[key];
		}

		self_.remove = function(key) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}

			delete cookies[key];
		}

		self_.clear = function() {
			cookies = {};
		}

		return self_;
	}

	self.location = function(url) {
		if(typeof url !== "string") {
			throw new TypeError("argument url must be a string");
		}

		if(url == "back") {
			url = self.headers().get("Referrer") || "/";
		}

		self.headers().set("Location", url);
	}

	self.redirect = function(url) {
		if(typeof url !== "string") {
			throw new TypeError("argument url must be a string");
		}

		self.location(url);
		self.status(302);
		self.end();
	}

	self.type = function(type) {
		if(typeof type === "string") {
			self.headers().set("Content-Type", mime.getType(type));
		}

		return self.headers().get("Content-Type");
	}

	self.end = function() {
		response.end();
	}

	self.send = function(body, encoding) {
		body = body || "";
		encoding = encoding || "utf-8";

		if(response.finished) {
			return;
		}

		if(typeof body == "object") {
			return self.json(body);
		}
		else {
			if(!self.headers().get("Content-Type")) {
				self.type("html");
			}
		}

		set_cookies();

		if(!self.headers().get("ETag")) {
			var length = 0;

			if(body.length < 0) {
				length = Buffer.byteLength(body, encoding);
			}
			else if(!Buffer.isBuffer(body)) {
				body = Buffer.from(body, encoding);
				encoding = undefined;
				length = body.length;
			}
			else {
				length = body.length;
			}

			self.headers().set("Content-Length", length);
		}

		if(cerus.settings().compression().on() && 
			request.accepts().encoding(compression.settings().type())) {
			compression.compress(body)
			.then(function(compressed) {
				if(!self.headers().get("ETag")) {
					self.headers().set("Content-Length", compressed.length);
				}

				self.headers().set("Content-Encoding", compression.settings().type());

				response.end(compressed, encoding);
			});
		}
		else {
			response.end(body, encoding);
		}
	}

	self.json = function(body) {
		if(typeof body !== "object") {
			throw new TypeError("argument body must be an object");
		}

		if(!self.headers().get("Content-Type")) {
			self.type("json");
		}

		self.send(JSON.stringify(body));
	}

	self.file = function(file_) {
		self.send(file_.data());
	}

	self.download = function(file_, name) {
		file = file || "";
		name = name || "file.txt";

		if(file_ instanceof file) {
			if(!self.headers().get("Content-Disposition")) {
				self.headers().set("Content-Disposition", "attachment; filename=" + file_.name());
			}

			self.file(file_);
		}
		else {
			if(!self.headers().get("Content-Disposition")) {
				self.headers().set("Content-Disposition", "attachment; filename=" + name);
			}

			self.send(file_);
		}
	}

	var append = function(obj, path) {
		var locals = [];

		for(var key in obj) {
			if(typeof obj[key] == "object") {
				locals.concat(append(obj[key], path == "" ? key : path + "." + key));
			}
			else {
				locals[locals.length] = path == "" ? key : path + "." + key;
			}
		}

		return locals;
	}

	// TODO: FINISH
	self.render = function(body, locals) {
		if(body instanceof file) {
			body = body.data();
		}

		locals = append(locals, "");

		for(var i = 0; i < locals.length; i++) {
			var local = locals[i];

			//body.replaceAll("{{" + local + "}}", );
		}
	}

	return self;
}
*/