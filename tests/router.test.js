var expect = require("chai").expect;
var router = require("../index")();
var reset = function() {
	router._init(cerus);
	return router.router();
}

describe("router", function() {
	// TODO: Most of this should be moved to it own file
	describe("#route", function() {
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
					.path("/")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
						done();
					});
				});
			});
		});

		context("with the url '/' and the correct method", function() {
			it("should route correctly", function(done) {
				reset().route("/", {method: "POST"})
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.path("/")
					.method("POST")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
						done();
					});
				});
			});
		});

		context("with the url '/' and the incorrect method", function() {
			it("should return 404", function(done) {
				reset().route("/", {method: "GET"})
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.path("/")
					.method("POST")
					.expect("status", 404)
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
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
					.path("/")
					.send(function(err) {
						if(err) throw err;
					})
					.path("/test")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
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
					.path("/test")
					.send(function(err) {
						if(err) throw err;
					})
					.path("/")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
						done();
					});
				});
			});
		});

		context("with the methods 'GET' and 'POST'", function() {
			it("should route both correctly", function(done) {
				var router = reset();
				router.route("/", {method: "POST"})
				.then(function(req, res) {
					res.end();
				});
				router.route("/", {method: "GET"})
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.path("/")
					.method("POST")
					.send(function(err) {
						if(err) throw err;
					})
					.path("/")
					.method("GET")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
						done();
					});
				});
			});
		});

		context("with the url '*'", function() {
			it("should route correctly", function(done) {
				var router = reset();
				router.route("*")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.path("/test")
					.send(function(err) {
						if(err) throw err;
					})
					.path("/")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
						done();
					});
				});
			});
		});

		context("with a set method and priority", function() {
			it("should be put in the front", function() {
				var router = reset();
				router.route("/test2/");
				router.route("/test1/", {method: "POST", priority: true});
				expect(router._stack[0].path).to.equal("/test1/");
			});
		});

		context("with the route /test/*", function() {
			it("should route fine", function(done) {
				var router = reset();
				router.route("/test/*")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.path("/test/test1")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
						done();
					});
				});
			});
		});

		context("immediately calling next", function() {
			it("should send a 404 error", function(done) {
				var router = reset();
				router.route("*")
				.then(function(req, res, next) {
					next();
				});
				router.route("/test")
				.then(function(req, res, next) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.path("/test")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
						done();
					});
				});
			});
		});
	});

	describe("#get", function() {
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
					.method("GET")
					.path("/")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
						done();
					});
				});
			});
		});

		context("with the url '/'", function() {
			it("should respond to '/?test' requests", function(done) {
				reset().get("/")
				.then(function(req, res) {
					res.end();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.method("GET")
					.path("/?test")
					.expect("status", 200)
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
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
					.method("GET")
					.path("/")
					.send(function(err) {
						if(err) throw err;
					})
					.method("GET")
					.path("/test")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
						done();
					});
				});
			});
		});
	});

	describe("#put", function() {
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
					.method("PUT")
					.path("/")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
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
					.method("PUT")
					.path("/")
					.send(function(err) {
						if(err) throw err;
					})
					.method("PUT")
					.path("/test")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
						done();
					});
				});
			});
		});
	});

	describe("#post", function() {
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
					.method("POST")
					.path("/")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
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
					.method("POST")
					.path("/")
					.send(function(err) {
						if(err) throw err;
					})
					.method("POST")
					.path("/test")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
						done();
					});
				});
			});
		});
	});

	describe("#delete", function() {
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
					.method("DELETE")
					.path("/")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
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
					.method("DELETE")
					.path("/")
					.send(function(err) {
						if(err) throw err;
					})
					.method("DELETE")
					.path("/test")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
						done();
					});
				});
			});
		});
	});

	describe("#head", function() {
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
					.method("HEAD")
					.path("/")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
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
					.method("HEAD")
					.path("/")
					.send(function(err) {
						if(err) throw err;
					})
					.method("HEAD")
					.path("/test")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
						done();
					});
				});
			});
		});
	});

	describe("#remove", function() {
		context("with a non-existent url", function() {
			it("should throw an error", function() {
				var func = function() {
					reset().remove("/nonexistent/");
				}

				expect(func).to.throw();
			});
		});

		context("with an existent url", function() {
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
				router.route("/", {method: "GET"});
				router.remove("/", {method: "GET"});

				expect(router.routes().length).to.equal(0);
			});
		});

		context("with a existent url and the wrong method", function() {
			it("should throw an error", function() {
				var func = function() {
					var router = reset();
					router.route("/", {method: "POST"});
					router.remove("/", {method: "GET"});
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
		context("with no routes initialized", function() {
			it("should return an empty opject", function() {
				expect(reset().routes()).to.deep.equal([]);
			});
		});

		context("with one route initialized", function() {
			it("should return an empty opject", function() {
				var router = reset();
				router.route("/*");
				expect(router.routes().length).to.deep.equal(1);
			});
		});

		context("with two routes initialized", function() {
			it("should return an empty opject", function() {
				var router = reset();
				router.route("/*");
				router.route("/test/*");
				expect(router.routes().length).to.deep.equal(2);
			});
		});
	});

	describe("#use", function() {
		context("with a single middleware", function() {
			it("should be called", function(done) {
				var router = reset();
				router.use()
				.then(function(req, res, next) {
					res.headers().set("test1", "Set");
					res.send();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.path("/test/")
					.expect("header", "test1", "Set")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
						done();
					});
				});
			});
		});

		context("with two middleware", function() {
			it("should both be called", function(done) {
				var router = reset();
				router.use()
				.then(function(req, res, next) {
					res.headers().set("test1", "Set");
					next();
				});
				router.use()
				.then(function(req, res, next) {
					res.headers().set("test2", "Set");
					res.send();
				});
				cerus.server().start()
				.then(function() {
					cerus.request()
					.path("/test/")
					.expect("header", "test1", "Set")
					.expect("header", "test2", "Set")
					.send(function(err) {
						cerus.server().stop();
						if(err) throw err;
						done();
					});
				});
			});
		});
	});

	describe("#router", function() {
		context("with an incorrect path as parameters", function() {
			it("should throw an error", function() {
				var func = function() {
					reset().router("I'm incorrect");
				}

				expect(func).to.throw();
			});
		});

		context("with a correct path as parameters", function() {
			it("should create the router", function() {
				var func = function() {
					reset().router("/test/");
				}

				expect(func).to.not.throw();
			});
		});

		context("test the correct router", function() {
			it("should create the router and work", function(done) {
				var router = reset();

				router.router("/test/").route("/")
				.then(function(req, res) {
					res.end();
				});

				cerus.server().start()
				.then(function() {
					cerus.request()
					.path("/test/")
					.method("GET")
					.send(function() {
						cerus.server().stop();
						done();
					});
				});
			});
		});

		context("test the correct router with multiple routes", function() {
			it("should create the router and work", function(done) {
				var router = reset();

				router.route("/test1/")
				.then(function(req, res) {
					res.end();
				});

				router.router("/test2/").route("/")
				.then(function(req, res) {
					res.end();
				});

				cerus.server().start()
				.then(function() {
					cerus.request()
					.path("/test1/")
					.method("GET")
					.send(function() {
						cerus.request()
						.path("/test2/")
						.method("GET")
						.send(function() {
							cerus.server().stop();
							done();
						});
					});
				});
			});
		});
	});
});