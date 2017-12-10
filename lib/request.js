/**
 * @module request
 */
module.exports = function(request, cerus) {
	return cerus.promise(function(event) {
		var self = {};

		var accepts = require("accepts")(request);
		var typeis = require("type-is");
		var uaparser = require("ua-parser-js");

		var url = require("url").parse(request.url, true);
		var body = "";
		var json = {};
		var cookies = null;

		if(request.method == 'POST') {
			request.on('data', function(data) {
				body += data;
			});
			request.on('end', function() {
				try {
					json = JSON.parse(body);
				}
				catch(e) {}

				event("done", self);
			});
		}
		else {
			event("done", self);
		}

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

			for(var i = 0; i < cks.length; i++) {
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

		self.events = function() {
			return cerus.promise(function(event) {
				request.on("close", function() {
					event("close");
				});

				request.on("aborted", function() {
					event("aborted");
				});

				request.connection.on("error", function() {
					event("error");
				});

				request.connection.on("timeout", function() {
					event("timeout");
				});
			});
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

		self.readable = function() {
			return request.readable;
		}

		self.domain = function() {
			return request.domain;
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
			return request.connection.encrypted ? "https" : "http";
		}

		self.headers = function() {
			var self_ = {};

			self_.get = function(key) {
				if(typeof key !== "string") {
					throw new TypeError("argument key must be a string");
				}

				return request.headers[key.toLowerCase()];
			}

			self_.has = function(key) {
				if(typeof key !== "string") {
					throw new TypeError("argument key must be a string");
				}

				return request.headers[key.toLowerCase()] !== undefined;
			}

			self_.list = function() {
				return request.headers;
			}

			return self_;
		}

		self.header = function(key) {
			return self.headers().get(key)
		}

		self.cookies = function() {
			var self_ = {};

			if(cookies == null) {
				parse_cookies();
			}

			self_.get = function(key) {
				if(typeof key !== "string") {
					throw new TypeError("argument key must be a string");
				}

				return cookies[key];
			}

			self_.has = function(key) {
				if(typeof key !== "string") {
					throw new TypeError("argument key must be a string");
				}

				return cookies[key] !== undefined;
			}

			self_.list = function() {
				return cookies;
			}

			return self_;
		}

		self.cookie = function(key) {
			return self.cookies().get(key);
		}

		self.host = self.hostname = function() {
			var host = self.header("X-Forwarded-Host");

			if(!host) {
				return self.header("Host");
			}

			var offset = (host[0] === "[") ? host.indexOf("]") + 1 : 0;
			var index = host.indexOf(':', offset);

			return index !== -1 ? host.substring(0, index) : host;
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
			var self_ = {};

			self_.string = function() {
				return self.header("user-agent");
			}

			self_.browser = function() {
				var self__ = {};
				var browser = agent.getBrowser();

				self__.name = function() {
					if(typeof browser.name === "string") {
						return browser.name.toLowerCase();
					}

					return undefined;
				}

				self__.version = function() {
					return browser.version;
				}

				self__.is = function() {
					var self__ = {};

					self___.android = function() {
						return self__.name() === "android browser";
					}

					self___.chrome = function() {
						return self__.name() === "chrome" || 
							self__.name() === "chrome webview";
					}

					self___.opera = function() {
						return self__.name() === "opera " || 
							self__.name() === "opera mini" || 
							self__.name() === "opera mobi" ||
							self__.name() === "opera tablet";
					}

					self___.firefox = function() {
						return self__.name() === "firefox";
					}

					self___.safari = function() {
						return self__.name() === "safari" || 
							self__.name() === "mobile safari";
					}

					self___.ie = function() {
						return self__.name() === "ie" || 
							self__.name() === "iemobile";
					}

					self___.edge = function() {
						return self__.name() === "edge";
					}

					return self___;
				}

				return self__;
			}

			self_.device = function() {
				var self__ = {};
				var device = agent.getDevice();

				self__.type = function() {
					return device.type;
				}

				self__.vendor = function() {
					if(typeof device.vendor === "string") {
						return device.vendor.toLowerCase();
					}

					return undefined;
				}

				self__.model = function() {
					return device.model;
				}

				return self__;
			}

			self_.engine = function() {
				var self__ = {};
				var engine = agent.getEngine();

				self__.name = function() {
					if(typeof engine.name === "string") {
						return engine.name.toLowerCase();
					}

					return undefined;
				}

				self__.version = function() {
					return engine.version;
				}

				return self__;
			}


			self_.os = function() {
				var self__ = {};
				var os = agent.getOS();

				self__.name = function() {
					if(typeof os.name === "string") {
						return os.name.toLowerCase();
					}

					return undefined;
				}

				self__.version = function() {
					return os.version;
				}

				return self__;
			}

			self_.cpu = function() {
				var self__ = {};
				var cpu = agent.getCPU();

				self__.architecture = function() {
					return cpu.architecture;
				}

				return self__;
			}

			return self_;
		}

		self.connecting = function() {
			return request.socket.connecting;
		}

		self.alive = function(enable, delay) {
			request.socket.setKeepAlive(enable, delay);
		}

		self.timeout = function(timeout) {
			if(typeof timeout !== "number") {
				throw new TypeError("argument timeout must be a number");
			}

			return cerus.promise(function(event) {
				request.setTimeout(timeout, function() {
					event("timeout");
				});
			});
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

		self.body = function() {
			return body;
		}

		self.connection = function() {
			return self.header("connection");
		}

		self.destroy = function(error) {
			request.destroy(error);
		}

		self.destroyed = function() {
			request.socket.destroyed();
		}

		self.bytes = function() {
			var self_ = {};

			self_.read = function() {
				return request.socket.bytesRead;
			}

			self_.written = function() {
				return request.socket.bytesWritten;
			}

			return self_;
		}

		self.get = function(key) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}

			if(self.method() == "POST") {
				return json[key];
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

		self.proxy = function() {
			var proxy = self.get('X-Forwarded-Proto');
			var index = proxy.indexOf(",");

			return index !== -1 ? proxy(0, index).trim() : index.trim();
		}

		self.secure = function() {
			return self.protocol() == 'https';
		}

		var agent = new uaparser(self.header("user-agent"));

		return self;
	});
}