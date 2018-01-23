var mime = require("mime");
var headers = require("./response/headers");
var cookies = require("./response/cookies");

class response {
	constructor(response, request, cerus) {
		this._response = response;
		this._request = request;
		this._headers = new headers(response);
		this._cookies = new cookies();
		this._compression = cerus.compression("gzip");
		this._cerus = cerus;
	}

	status(code) {
		if(typeof code !== "number") {
			this._response.statusCode = code;
		}

		return this._response.statusCode;
	}

	code(code) {
		return this.status(code);
	}

	finished() {
		return this._response.finished;
	}

	ended() {
		return this.finished();
	}

	headers() {
		return this._headers;
	}

	cookies() {
		return this._cookies;
	}

	location(url) {
		var url_ = url;

		if(typeof url_ !== "string") {
			throw new TypeError("argument url must be a string");
		}

		// Go back when the url is set to "back", go to '/' when no referrer was specified
		if(url_ === "back") {
			url_ = this.headers().get("Referrer") || "/";
		}

		this.headers().set("Location", url_);
	}

	redirect(url) {
		if(typeof url !== "string") {
			throw new TypeError("argument url must be a string");
		}

		this.location(url);

		this.status(302);
		this.end();
	}

	type(type) {
		if(typeof type === "string") {
			this.headers().set("Content-Type", get_type(type));
		}

		return this.headers().get("Content-Type");
	}

	end() {
		this._response.end();
	}

	send(body, encoding = "urf-8") {
		var body_ = body;
		var encoding_ = encoding;

		if(this._response.finished) {
			return;
		}

		if(typeof body_ === "object") {
			return this.json(body_);
		}

		// TODO: Catching on purpose isn't good
		try {
			body_ = Buffer.isBuffer(body_) ? body_ : Buffer.from(body_);
		} 
		catch(e) {
			body_ = undefined;
		}

		apply_cookies(this._cookies, this._response);

		// Set the length of the response if the ETag header isn't defined
		if(body_ !== undefined && !this.headers().get("ETag")) {
			this.headers().set("Content-Length", body_.length);
		}

		if(body_ !== undefined && this._cerus.settings().compression().on() 
			&& this._request.accepts().encoding(this._compression.settings().type())) {
			this._compression.compress(body_)
			.then(function(compressed) {
				if(!this.headers().get("ETag")) {
					this.headers().set("Content-Length", compressed.length);
				}

				this.headers().set("Content-Encoding", this._compression.settings().type());

				this._response.end(compressed, encoding_);
			});
		}
		else {
			if(!this.headers().get("Content-Type")) {
				this.type("html");
			}

			this._response.end(body, encoding_);
		}
	}

	json(body) {
		if(typeof body !== "object") {
			throw new TypeError("argument body must be an object");
		}

		if(!this.headers().get("Content-Type")) {
			this.type("json");
		}

		this.send(JSON.stringify(body));
	}

	file(file) {
		if(typeof file !== "object" || typeof file.data !== "function") {
			throw new TypeError("the argument file must be a (cerus) file");
		}

		this.send(file.data());
	}

	download(file, name, encoding) {
		var data = "";
		var name_ = name;

		// Check if the file argument is a file or a string, else error 
		if(typeof file === "object" && typeof file.data === "function") {
			name_ = name_ || file.name();
			data = file.data();
		}
		else if(typeof file === "string") {
			data = file;
		}
		else {
			throw new TypeError("the argument file must be a (cerus) file or string");
		}

		if(typeof name_ !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		if(!this.headers().get("Content-Disposition")) {
			this.headers().set("Content-Disposition", "attachment; filename=" + name_);
		}

		this.send(data, encoding);
	}
}

module.exports = response;

var apply_cookies = function(cookies, response) {
	for(var i = 0; i < cookies._cookies.length; i++) {
		response.headers().append("Set-Cookie", cookies._cookies[i].build());
	}
};

var get_type = function(type) {
	return mime.getType(type);
};
