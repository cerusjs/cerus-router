var expect = require("chai").expect;
var cerus = require("cerus")();
cerus.use(require("cerus-request")());
var router = require("../index")();
var reset = function() {
	router.init_(cerus);
	return router.router();
}

describe("router", function() {
	describe("#route", function() {
		context("with no parameters", function() {
			it("should throw an error", function() {
				var func = function() {
					reset().route();
				}

				expect(func).to.throw();
			});
		});

		context("with an incorrect url", function() {
			it("should throw an error", function() {
				var func = function() {
					reset().route("/test/^/test/");
				}

				expect(func).to.throw();
			});
		});

		context("with the url '/'", function() {
			it("should route correctly", function(done) {
				reset().route("/")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.path("/")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});

		context("with the url '/' and try to override", function() {
			it("should route correctly", function(done) {
				var router = reset();
				router.route("/");
				router.route("/", true)
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.path("/")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});

		context("with the url '/' and the correct method", function() {
			it("should route correctly", function(done) {
				reset().route("/", "POST")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.path("/")
					.method("POST")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});

		context("with the url '/' and the incorrect method", function() {
			it("should return 404", function(done) {
				reset().route("/", "GET")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.path("/")
					.method("POST")
					.expect("code", 404)
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});

		context("with the urls '/' and '/test'", function() {
			it("should route both correctly", function(done) {
				var router = reset();
				router.route("/")
				.then(function(req, res) {
					res.end();
				});
				router.route("/test")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.path("/")
					.send()
					.port(cerus.settings().port())
					.path("/test")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});

		context("with the urls '/test' and '/'", function() {
			it("should route both correctly", function(done) {
				var router = reset();
				router.route("/test")
				.then(function(req, res) {
					res.end();
				});
				router.route("/")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.path("/test")
					.send()
					.port(cerus.settings().port())
					.path("/")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});

		context("with the methods 'GET' and 'POST'", function() {
			it("should route both correctly", function(done) {
				var router = reset();
				router.route("/", "POST")
				.then(function(req, res) {
					res.end();
				});
				router.route("/", "GET")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.path("/")
					.method("POST")
					.send()
					.port(cerus.settings().port())
					.path("/")
					.method("GET")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});

		context("with the url '*'", function() {
			it("should route correctly", function() {
				var router = reset();
				router.route("*")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.path("/test")
					.send()
					.port(cerus.settings().port())
					.path("/")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});
	});

	describe("#get", function() {
		context("with no parameters", function() {
			it("should throw an error", function() {
				var func = function() {
					reset().get();
				}

				expect(func).to.throw();
			});
		});

		context("with an incorrect url", function() {
			it("should throw an error", function() {
				var func = function() {
					reset().get("/test/^/test/");
				}

				expect(func).to.throw();
			});
		});

		context("with the url '/'", function() {
			it("should route correctly", function(done) {
				reset().get("/")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.method("GET")
					.path("/")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});

		context("with the urls '/' and '/test'", function() {
			it("should route both correctly", function(done) {
				var router = reset();
				router.get("/")
				.then(function(req, res) {
					res.end();
				});
				router.get("/test")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.method("GET")
					.path("/")
					.send()
					.port(cerus.settings().port())
					.method("GET")
					.path("/test")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});
	});

	describe("#put", function() {
		context("with no parameters", function() {
			it("should throw an error", function() {
				var func = function() {
					reset().put();
				}

				expect(func).to.throw();
			});
		});

		context("with an incorrect url", function() {
			it("should throw an error", function() {
				var func = function() {
					reset().put("/test/^/test/");
				}

				expect(func).to.throw();
			});
		});

		context("with the url '/'", function() {
			it("should route correctly", function(done) {
				reset().put("/")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.method("PUT")
					.path("/")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});

		context("with the urls '/' and '/test'", function() {
			it("should route both correctly", function(done) {
				var router = reset();
				router.put("/")
				.then(function(req, res) {
					res.end();
				});
				router.put("/test")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.method("PUT")
					.path("/")
					.send()
					.port(cerus.settings().port())
					.method("PUT")
					.path("/test")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});
	});

	describe("#post", function() {
		context("with no parameters", function() {
			it("should throw an error", function() {
				var func = function() {
					reset().post();
				}

				expect(func).to.throw();
			});
		});

		context("with an incorrect url", function() {
			it("should throw an error", function() {
				var func = function() {
					reset().post("/test/^/test/");
				}

				expect(func).to.throw();
			});
		});

		context("with the url '/'", function() {
			it("should route correctly", function(done) {
				reset().post("/")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.method("POST")
					.path("/")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});

		context("with the urls '/' and '/test'", function() {
			it("should route both correctly", function(done) {
				var router = reset();
				router.post("/")
				.then(function(req, res) {
					res.end();
				});
				router.post("/test")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.method("POST")
					.path("/")
					.send()
					.port(cerus.settings().port())
					.method("POST")
					.path("/test")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});
	});

	describe("#delete", function() {
		context("with no parameters", function() {
			it("should throw an error", function() {
				var func = function() {
					reset().delete();
				}

				expect(func).to.throw();
			});
		});

		context("with an incorrect url", function() {
			it("should throw an error", function() {
				var func = function() {
					reset().delete("/test/^/test/");
				}

				expect(func).to.throw();
			});
		});

		context("with the url '/'", function() {
			it("should route correctly", function(done) {
				reset().delete("/")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.method("DELETE")
					.path("/")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});

		context("with the urls '/' and '/test'", function() {
			it("should route both correctly", function(done) {
				var router = reset();
				router.delete("/")
				.then(function(req, res) {
					res.end();
				});
				router.delete("/test")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.method("DELETE")
					.path("/")
					.send()
					.port(cerus.settings().port())
					.method("DELETE")
					.path("/test")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});
	});

	describe("#head", function() {
		context("with no parameters", function() {
			it("should throw an error", function() {
				var func = function() {
					reset().head();
				}

				expect(func).to.throw();
			});
		});

		context("with an incorrect url", function() {
			it("should throw an error", function() {
				var func = function() {
					reset().head("/test/^/test/");
				}

				expect(func).to.throw();
			});
		});

		context("with the url '/'", function() {
			it("should route correctly", function(done) {
				reset().head("/")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.method("HEAD")
					.path("/")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});

		context("with the urls '/' and '/test'", function() {
			it("should route both correctly", function(done) {
				var router = reset();
				router.head("/")
				.then(function(req, res) {
					res.end();
				});
				router.head("/test")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.method("HEAD")
					.path("/")
					.send()
					.port(cerus.settings().port())
					.method("HEAD")
					.path("/test")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});
	});

	describe("#remove", function() {
		context("with no parameters", function() {
			it("should throw an error", function() {
				var func = function() {
					reset().remove();
				}

				expect(func).to.throw();
			});
		});

		context("with a non-existent url", function() {
			it("should throw an error", function() {
				var func = function() {
					reset().remove("/nonexistent/");
				}

				expect(func).to.throw();
			});
		});

		context("with a existent url", function() {
			it("should have 0 routes left", function() {
				var router = reset();
				router.route("/");
				router.remove("/");

				expect(router.routes().length).to.equal(0);
			});
		});

		context("with a existent url and specified method", function() {
			it("should have 0 routes left", function() {
				var router = reset();
				router.route("/", "GET");
				router.remove("/", "GET");

				expect(router.routes().length).to.equal(0);
			});
		});

		context("with a existent url and the wrong method", function() {
			it("should throw an error", function() {
				var func = function() {
					var router = reset();
					router.route("/", "POST");
					router.remove("/", "GET");
				}

				expect(func).to.throw();
			});
		});
	});

	describe("#check", function() {
		context("with the url '/test/test1/'", function() {
			it("should return true", function() {
				expect(reset().check("/test/test1/")).to.be.true;
			});
		});

		context("with the url '/test/_*%#asd/'", function() {
			it("should return true", function() {
				expect(reset().check("/test/_*#asd/")).to.be.true;
			});
		});

		context("with the url '/test/test1/^^asd'", function() {
			it("should return false", function() {
				expect(reset().check("/test/test1/^^asd")).to.be.false;
			});
		});

		context("with the url '/test/test1/ /test'", function() {
			it("should return false", function() {
				expect(reset().check("/test/test1/ /test")).to.be.false;
			});
		});
	});

	describe("#routers", function() {

	});

	describe("#middleware", function() {
		describe("#add", function() {
			context("with no parameters", function() {
				it("should add the middleware with '*' as url", function() {
					var router = reset();
				});
			});
		});
	});
});