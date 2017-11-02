/**
 * @module request
 */
module.exports = function(request, cerus) {
	return cerus.promise(function(event) {
		var self = {};

		var accepts = require("accepts")(request);
		var typeis = require("type-is");

		var url = require("url").parse(request.url, true);
		var body = "";

		if(request.method == 'POST') {
			request.on('data', function(data) {
				body += data;
			});
			request.on('end', function() {
				if(typeof body === "string" && body.length > 0) {
					body = JSON.parse(body);
				}
				else {
					body = {};
				}

				event("done", self);
			});
		}
		else {
			body = {};
			event("done", self);
		}

		self.remote = function() {
			var self_ = {};

			self_.address = function() {
				return request.socket.remoteAddress;
			}

			self_.port = function() {
				return request.socket.remotePort;
			}

			self_.family = function() {
				return request.socket.remoteFamily;
			}

			return self_;
		}

		self.local = function() {
			var self_ = {};

			self_.address = function() {
				return request.socket.localAddress;
			}

			self_.port = function() {
				return request.socket.localPort;
			}

			return self_;
		}

		self.url = function() {
			return request.url;
		}

		self.method = function() {
			return request.method;
		}

		self.version = function() {
			return request.httpVersion;
		}

		self.protocol = function() {
			return url.protocol;
		}

		self.header = function(key) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}

			return request.headers[key];
		}

		self.headers = function() {
			return request.headers;
		}

		var cookies = null;

		function parse_cookies() {
			var cks = self.header("cookie");
			cookies = {};

			if(cks == null || cks == "") {
				return;
			}

			if(cks.indexOf(";") < 0) {
				cks = new Array(cks);
			}
			else {
				cks = cks.split(/; */);
			}

			for(var i = 0; i < 1; i++) {
				var cookie = cks[i];
				var split = cookie.indexOf("=");

				if(split < 0) {
					continue;
				}

				var key = cookie.substring(0, split).trim();
				var val = cookie.substring(split + 1, cookie.length).trim();

				if(val.startsWith("\"")) {
					val = val.slice(1, -1);
				}

				if(cookies[key] == undefined) {
					cookies[key] = val;
				}
			}
		}

		self.cookie = function(key) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}

			if(cookies == null) {
				parse_cookies();
			}

			return cookies[key];
		}

		self.hostname = function() {
			return url.hostname;
		}

		self.path = function() {
			return url.path;
		}

		self.origin = function() {
			return url.origin;
		}

		self.href = function() {
			return url.href;
		}

		self.port = function() {
			return url.port;
		}

		self.hash = function() {
			return url.hash;
		}

		self.auth = function() {
			var self_ = {};

			self_.username = function() {
				return url.username;
			}

			self_.password = function() {
				return url.password;
			}

			return self_;
		}

		self.accepts = function() {
			var self_ = {};

			self_.type = function(type) {
				if(type == null) {
					return accepts.types();
				}

				return accepts.type(type);
			}

			self_.encoding = function(encoding) {
				if(encoding == null) {
					return accepts.encodings();
				}

				return accepts.encoding(encoding);
			}

			self_.charset = function(charset) {
				if(charset == null) {
					return accepts.charsets();
				}

				return accepts.charset(charset);
			}

			self_.language = function(language) {
				if(language == null) {
					return accepts.languages();
				}

				return accepts.language(language);
			}

			return self_;
		}

		self.agent = function() {
			return self.header("user-agent");
		}

		self.is = function(types) {
			var arr = types || [];

			if(!Array.isArray(types)) {
				arr = new Array(arguments.length);

				for(var i = 0; i < arr.length; i++) {
					arr[i] = arguments[i];
				}
			}

			return typeis(request, arr);
		}

		self.get = function(key) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}

			if(self.method() == "POST") {
				return body[key];
			}
			else {
				return url.query[key];
			}

			return null;
		}

		self.xhr = function() {
			var xhr = self.get('X-Requested-With') || "";
			return xhr.toLowerCase() == 'xmlhttprequest';
		}

		self.secure = function() {
			return self.protocol() == 'https';
		}

		return self;
	});
}