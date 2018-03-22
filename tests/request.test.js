var expect = require("chai").expect;
var cerus = require("cerus")();
cerus.use(require("cerus-request")());
var router = require("../index")();
var reset = function() {
	router.init_(cerus);
	return router.router();
}

describe("request", function() {
	beforeEach(function(done) {
		cerus.server().start()
		.then(function() {
			done();
		});
	});

	afterEach(function(done) {
		cerus.server().stop()
		.then(function() {
			done();
		});
	});

	describe("#readable", function() {
		it("should be true by default", function(done) {
			var router = reset();

			router.route("/")
			.then(function(req, res) {
				expect(req.readable()).to.deep.equal(true);
				res.send();
			});

			cerus.request()
			.port(cerus.settings().port())
			.path("/")
			.send(function(err) {
				if(err) throw err;

				done();
			});
		});
	});

	describe("#event", function() {
		context("with no parameters", function() {
			it("should return a promise", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.event()).to.be.a("object");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#body", function() {
		context("with no send data", function() {
			it("should return an empty string", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.body()).to.equal("");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with the string \"test\" send", function() {
			it("should return the string", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					req.event()
					.on("end", function() {
						expect(req.body()).to.equal("test");
						res.send();
					});
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.body("test")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#url", function() {
		context("with the / url send", function() {
			it("should be /", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.url()).to.equal("/");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with the /test/ url send", function() {
			it("should be /", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.url()).to.equal("/test/");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/test/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#method", function() {
		context("with the POST method send", function() {
			it("should be POST", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.method()).to.equal("POST");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.method("POST")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with the GET method send", function() {
			it("should be GET", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.method()).to.equal("GET");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.method("GET")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with the HEAD method send", function() {
			it("should be HEAD", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.method()).to.equal("HEAD");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.method("HEAD")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with the PUT method send", function() {
			it("should be PUT", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.method()).to.equal("PUT");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.method("PUT")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with the DELETE method send", function() {
			it("should be DELETE", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.method()).to.equal("DELETE");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.method("DELETE")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#version", function() {
		context("with the default 1.1 version", function() {
			it("should be 1.1", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.version()).to.equal("1.1");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#protocol", function() {
		context("with the http version", function() {
			it("should be http", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.protocol()).to.equal("http");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#hostname", function() {
		context("with a proxy hosname", function() {
			it("should be example.com", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.hostname()).to.equal("example.com");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.header("X-Forwarded-Host", "example.com")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			})
		});

		context("with a hostname that needs fixing", function() {
			it("should be example.com", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.hostname()).to.equal("[2001:0db8:85a3:0000:0000:8a2e:0370:7334]");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.header("Host", "[2001:0db8:85a3:0000:0000:8a2e:0370:7334]")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with a hostname that needs no fixing", function() {
			it("should be example.com", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.hostname()).to.equal("example.com");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.header("Host", "example.com")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with the alias host()", function() {
			it("should be example.com", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.host()).to.equal("example.com");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.header("Host", "example.com")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#path", function() {
		context("with the / url send", function() {
			it("should be /", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.path()).to.equal("/");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with the /test/ url send", function() {
			it("should be /", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.path()).to.equal("/test/");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/test/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#href", function() {
		context("with the / url send", function() {
			it("should be /", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.href()).to.equal("/");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with the /test/ url send", function() {
			it("should be /", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.href()).to.equal("/test/");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/test/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#hash", function() {
		context("with the / url send", function() {
			it("should be /", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.hash()).to.equal(null);
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with the /#test url send", function() {
			it("should be #test", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.hash()).to.equal("#test");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/#test")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#connecting", function() {
		it("should be false by default", function(done) {
			var router = reset();

			router.route("/")
			.then(function(req, res) {
				expect(req.connecting()).to.deep.equal(false);
				res.send();
			});

			cerus.request()
			.port(cerus.settings().port())
			.path("/")
			.send(function(err) {
				if(err) throw err;

				done();
			});
		});
	});

	describe("#alive", function() {
		it("should work", function(done) {
			var router = reset();

			router.route("/")
			.then(function(req, res) {
				var func = function() {
					req.alive();
				}

				expect(func).to.not.throw();
				res.send();
			});

			cerus.request()
			.port(cerus.settings().port())
			.path("/")
			.send(function(err) {
				if(err) throw err;

				done();
			});
		});
	});

	describe("#timeout", function() {
		context("with no parameters", function() {
			it("should throw an error", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					var func = function() {
						req.timeout();
					}

					expect(func).to.throw();
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with a number as parameters", function() {
			it("should set the timeout", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					var func = function() {
						req.timeout(12);
					}

					expect(func).to.not.throw();
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#is", function() {
		context("with no paramaters and application/json send", function() {
			it("should return application/json", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.is()).to.equal("application/json");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.body("abc")
				.header("content-type", "application/json")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with json as parameter and application/json send", function() {
			it("should return json", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.is("json")).to.equal("json");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.body("abc")
				.header("content-type", "application/json")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with html as parameter and text/html send", function() {
			it("should return html", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.is("html")).to.equal("html");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.body("abc")
				.header("content-type", "text/html")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with json, html as parameters and application/json send", function() {
			it("should return json", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.is("json", "html")).to.equal("json");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.body("abc")
				.header("content-type", "application/json")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with application/* as parameters and application/json send", function() {
			it("should return application/json", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.is("application/*")).to.equal("application/json");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.body("abc")
				.header("content-type", "application/json")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with the alias type()", function() {
			it("should return application/json", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.type("application/*")).to.equal("application/json");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.body("abc")
				.header("content-type", "application/json")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#connection", function() {
		context("with no set header send", function() {
			it("the connection header should be undefined", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.connection()).to.equal("close");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#get", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					var func = function() {
						req.get();
					}

					expect(func).to.throw();
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with a GET request and with test=value", function() {
			it("key test should be value", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.get("test")).to.equal("value");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/?test=value")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with a POST request and json data", function() {
			it("key test should be value", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					req.event()
					.on("end", function() {
						expect(req.get("test")).to.equal("value");
						res.send();
					});
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.method("POST")
				.body("{\"test\": \"value\"}")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#xhr", function() {
		context("with no xmlhttprequest send", function() {
			it("should be false", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.xhr()).to.deep.equal(false);
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with xmlhttprequest send", function() {
			it("should be true", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.xhr()).to.deep.equal(true);
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.header("X-Requested-With", "xmlhttprequest")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#proxy", function() {
		context("with no proxy send", function() {
			it("should be false", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.proxy()).to.deep.equal(false);
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with proxy send", function() {
			it("should be true", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.proxy()).to.deep.equal(true);
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.header("X-Forwarded-Proto", "http")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#secure", function() {
		it("should be false when using http", function(done) {
			var router = reset();

			router.route("/")
			.then(function(req, res) {
				expect(req.secure()).to.deep.equal(false);
				res.send();
			});

			cerus.request()
			.port(cerus.settings().port())
			.path("/")
			.send(function(err) {
				if(err) throw err;

				done();
			});
		});
	});

	describe("#destroy", function() {
		context("with no parameters", function() {
			it("should destroy the socket", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					req.destroy();

					cerus.server().stop()
					.then(function() {
						var server = require("cerus-server")();
						server.init_(cerus);
						server = server.server();
						cerus.server = function() {
							return server;
						}

						cerus.server().start()
						.then(function() {
							res.send();
						});
					});
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					var func = function() {
						if(err) throw err;
					}

					expect(func).to.throw();
					done();
				});
			});
		});
	});

	describe("#remote", function() {
		describe("constructor", function() {
			it("shouldn't throw any errors", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					var func = function() {
						req.remote();
					}

					expect(func).to.not.throw();
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		describe("#address", function() {
			it("should be ::ffff:127.0.0.1 by default", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.remote().address()).to.equal("::ffff:127.0.0.1");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		describe("#port", function() {
			it("should be 64494 by default", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.remote().port()).to.be.a("number");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		describe("#family", function() {
			it("should be IPv6 by default", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.remote().family()).to.equal("IPv6");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#local", function() {
		describe("constructor", function() {
			it("shouldn't throw any errors", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					var func = function() {
						req.local();
					}

					expect(func).to.not.throw();
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		describe("#address", function() {
			it("should be / by default", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.local().address()).to.equal("::ffff:127.0.0.1");
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		describe("#port", function() {
			it("should be / by default", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.local().port()).to.equal(8080);
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#bytes", function() {
		describe("constructor", function() {
			it("shouldn't throw any errors", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					var func = function() {
						req.bytes();
					}

					expect(func).to.not.throw();
					res.send();
				});

				cerus.request()
				.port(cerus.settings().port())
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		describe("#read", function() {
			context("with no data send", function() {
				it("should equal 59 bytes", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.bytes().read()).to.equal(59);
						res.send();
					});

					cerus.request()
					.port(cerus.settings().port())
					.path("/")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with a header send", function() {
				it("should equal 84 bytes", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.bytes().read()).to.equal(84);
						res.send();
					});

					cerus.request()
					.port(cerus.settings().port())
					.path("/")
					.header("content-type", "text/html")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with data send", function() {
				it("should equal 96 bytes", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.bytes().read()).to.equal(96);
						res.send();
					});

					cerus.request()
					.port(cerus.settings().port())
					.path("/")
					.body("{\"test\": \"value\"}")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
		});

		describe("#write", function() {
			context("with no data is send", function() {
				it("should equal 0 bytes", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.bytes().written()).to.equal(0);
						res.send();
					});

					cerus.request()
					.port(cerus.settings().port())
					.path("/")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
		});
	});
});