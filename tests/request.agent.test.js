var expect = require("chai").expect;
global.cerus = require("cerus")();
cerus.use(require("cerus-request")());
var router = require("../index")();
var reset = function() {
	router._init(cerus);
	return router.router();
}

describe("request#agent", function() {
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

	describe("constructor", function() {
		context("creating it once", function() {
			it("shouldn't throw any errors", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					var func = function() {
						req.agent();
					}

					expect(func).to.not.throw();

					res.send();
				});

				cerus.request()
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
		
		context("creating it twice", function() {
			it("shouldn't recreate the class", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					req.agent().test = "test";
					expect(req.agent().test).to.equal("test");

					res.send();
				});

				cerus.request()
				.path("/")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#string", function() {
		context("with 'test' as user-agent", function() {
			it("should equal the send user-agent", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.agent().string()).to.equal("test");

					res.send();
				});

				cerus.request()
				.path("/")
				.header("user-agent", "test")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});

		context("with 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' as user-agent", function() {
			it("should equal the send user-agent", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.agent().string()).to.equal("Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36");

					res.send();
				});

				cerus.request()
				.path("/")
				.header("user-agent", "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36")
				.send(function(err) {
					if(err) throw err;

					done();
				});
			});
		});
	});

	describe("#browser", function() {
		describe("constructor", function() {
			context("creating it once", function() {
				it("shouldn't throw any errors", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						var func = function() {
							req.agent().browser();
						}

						expect(func).to.not.throw();

						res.send();
					});

					cerus.request()
					.path("/")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
			
			context("creating it twice", function() {
				it("shouldn't recreate the class", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						req.agent().browser().test = "test";
						expect(req.agent().browser().test).to.equal("test");

						res.send();
					});

					cerus.request()
					.path("/")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
		});

		describe("#name", function() {
			context("with '' as user-agent", function() {
				it("should be undefined", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().browser().name()).to.equal(undefined);

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' as user-agent", function() {
				it("should be chrome", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().browser().name()).to.equal("chrome");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
		});

		describe("#version", function() {
			context("with '' as user-agent", function() {
				it("should be undefined", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().browser().version()).to.equal(undefined);

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' as user-agent", function() {
				it("should be 41.0.2228.0", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().browser().version()).to.equal("41.0.2228.0");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
		});

		describe("#is", function() {
			describe("constructor", function() {
				context("creating it once", function() {
					it("shouldn't throw any errors", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							var func = function() {
								req.agent().browser().is();
							}

							expect(func).to.not.throw();

							res.send();
						});

						cerus.request()
						.path("/")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});
				
				context("creating it twice", function() {
					it("shouldn't recreate the class", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							req.agent().browser().is().test = "test";
							expect(req.agent().browser().is().test).to.equal("test");

							res.send();
						});

						cerus.request()
						.path("/")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});
			});

			describe("#android", function() {
				context("with '' as user-agent", function() {
					it("should be false", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().android()).to.deep.equal(false);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});

				context("with 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' as user-agent", function() {
					it("should be false", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().android()).to.deep.equal(false);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});

				context("with 'Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36' as user-agent", function() {
					it("should be true", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().android()).to.deep.equal(true);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});
			});

			describe("#chrome", function() {
				context("with '' as user-agent", function() {
					it("should be false", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().chrome()).to.deep.equal(false);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});

				context("with 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' as user-agent", function() {
					it("should be true", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().chrome()).to.deep.equal(true);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});

				context("with 'Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36' as user-agent", function() {
					it("should be false", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().chrome()).to.deep.equal(false);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});
			});

			describe("#opera", function() {
				context("with '' as user-agent", function() {
					it("should be false", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().opera()).to.deep.equal(false);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});

				context("with 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' as user-agent", function() {
					it("should be false", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().opera()).to.deep.equal(false);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});

				context("with 'Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16' as user-agent", function() {
					it("should be true", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().opera()).to.deep.equal(true);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});
			});

			describe("#firefox", function() {
				context("with '' as user-agent", function() {
					it("should be false", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().firefox()).to.deep.equal(false);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});

				context("with 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' as user-agent", function() {
					it("should be false", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().firefox()).to.deep.equal(false);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});

				context("with 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1' as user-agent", function() {
					it("should be true", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().firefox()).to.deep.equal(true);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});
			});

			describe("#ie", function() {
				context("with '' as user-agent", function() {
					it("should be false", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().ie()).to.deep.equal(false);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});

				context("with 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' as user-agent", function() {
					it("should be false", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().ie()).to.deep.equal(false);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});

				context("with 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko' as user-agent", function() {
					it("should be true", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().ie()).to.deep.equal(true);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});
			});

			describe("#edge", function() {
				context("with '' as user-agent", function() {
					it("should be false", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().edge()).to.deep.equal(false);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});

				context("with 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' as user-agent", function() {
					it("should be false", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().edge()).to.deep.equal(false);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});

				context("with 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246' as user-agent", function() {
					it("should be true", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().edge()).to.deep.equal(true);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});
			});

			describe("#safari", function() {
				context("with '' as user-agent", function() {
					it("should be false", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().safari()).to.deep.equal(false);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});

				context("with 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' as user-agent", function() {
					it("should be false", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().safari()).to.deep.equal(false);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});

				context("with 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A' as user-agent", function() {
					it("should be true", function(done) {
						var router = reset();

						router.route("/")
						.then(function(req, res) {
							expect(req.agent().browser().is().safari()).to.deep.equal(true);

							res.send();
						});

						cerus.request()
						.path("/")
						.header("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A")
						.send(function(err) {
							if(err) throw err;

							done();
						});
					});
				});
			});
		});
	});

	describe("#device", function() {
		describe("constructor", function() {
			context("creating it once", function() {
				it("shouldn't throw any errors", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						var func = function() {
							req.agent().device();
						}

						expect(func).to.not.throw();

						res.send();
					});

					cerus.request()
					.path("/")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
			
			context("creating it twice", function() {
				it("shouldn't recreate the class", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						req.agent().device().test = "test";
						expect(req.agent().device().test).to.equal("test");

						res.send();
					});

					cerus.request()
					.path("/")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
		});

		describe("#type", function() {
			context("with '' as user-agent", function() {
				it("should be undefined", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().device().type()).to.equal(undefined);

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36' as user-agent", function() {
				it("should be mobile", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().device().type()).to.equal("mobile");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
		});

		describe("#vendor", function() {
			context("with '' as user-agent", function() {
				it("should be undefined", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().device().vendor()).to.equal(undefined);

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Mozilla/5.0 (Apple TV; CPU iPhone OS 9_0 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13T534YI' as user-agent", function() {
				it("should be apple", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().device().vendor()).to.equal("apple");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Mozilla/5.0 (Apple TV; CPU iPhone OS 9_0 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13T534YI")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19' as user-agent", function() {
				it("should be samsung", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().device().vendor()).to.equal("samsung");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
		});

		describe("#model", function() {
			context("with '' as user-agent", function() {
				it("should be undefined", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().device().model()).to.equal(undefined);

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19' as user-agent", function() {
				it("should be Galaxy Nexus", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().device().model()).to.equal("Galaxy Nexus");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36' as user-agent", function() {
				it("should be Nexus 5", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().device().model()).to.equal("Nexus 5");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

		});
	});

	describe("#engine", function() {
		describe("constructor", function() {
			context("creating it once", function() {
				it("shouldn't throw any errors", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						var func = function() {
							req.agent().engine();
						}

						expect(func).to.not.throw();

						res.send();
					});

					cerus.request()
					.path("/")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
			
			context("creating it twice", function() {
				it("shouldn't recreate the class", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						req.agent().engine().test = "test";
						expect(req.agent().engine().test).to.equal("test");

						res.send();
					});

					cerus.request()
					.path("/")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
		});

		describe("#name", function() {
			context("with '' as user-agent", function() {
				it("should be undefined", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().engine().name()).to.equal(undefined);

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' as user-agent", function() {
				it("should be webkit", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().engine().name()).to.equal("webkit");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16' as user-agent", function() {
				it("should be presto", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().engine().name()).to.equal("presto");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
		});

		describe("#version", function() {
			context("with '' as user-agent", function() {
				it("should be undefined", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().engine().version()).to.equal(undefined);

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16' as user-agent", function() {
				it("should be 2.12.388", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().engine().version()).to.equal("2.12.388");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16' as user-agent")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' as user-agent", function() {
				it("should be 537.36", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().engine().version()).to.equal("537.36");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
		});
	});

	describe("#os", function() {
		describe("constructor", function() {
			context("creating it once", function() {
				it("shouldn't throw any errors", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						var func = function() {
							req.agent().os();
						}

						expect(func).to.not.throw();
						res.send();
					});

					cerus.request()
					.path("/")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
			
			context("creating it twice", function() {
				it("shouldn't recreate the class", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						req.agent().os().test = "test";
						expect(req.agent().os().test).to.equal("test");

						res.send();
					});

					cerus.request()
					.path("/")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
		});

		describe("#name", function() {
			context("with '' as user-agent", function() {
				it("should be undefined", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().os().name()).to.equal(undefined);

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' as user-agent", function() {
				it("should be windows", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().os().name()).to.equal("windows");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Mozilla/5.0 (Apple TV; CPU iPhone OS 9_0 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13T534YI' as user-agent", function() {
				it("should be ios", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().os().name()).to.equal("ios");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Mozilla/5.0 (Apple TV; CPU iPhone OS 9_0 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13T534YI")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
		});

		describe("#version", function() {
			context("with '' as user-agent", function() {
				it("should be undefined", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().os().version()).to.equal(undefined);

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Mozilla/5.0 (Apple TV; CPU iPhone OS 9_0 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13T534YI' as user-agent", function() {
				it("should be 9.0", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().os().version()).to.equal("9.0");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Mozilla/5.0 (Apple TV; CPU iPhone OS 9_0 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13T534YI")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16' as user-agent", function() {
				it("should be 14.10", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().os().version()).to.equal("14.10");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
		});
	});

	describe("#cpu", function() {
		describe("constructor", function() {
			context("creating it once", function() {
				it("shouldn't throw any errors", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						var func = function() {
							req.agent().cpu();
						}

						expect(func).to.not.throw();
						res.send();
					});

					cerus.request()
					.path("/")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
			
			context("creating it twice", function() {
				it("shouldn't recreate the class", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						req.agent().cpu().test = "test";
						expect(req.agent().cpu().test).to.equal("test");

						res.send();
					});

					cerus.request()
					.path("/")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
		});

		describe("#arch", function() {
			context("with '' as user-agent", function() {
				it("should be undefined", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().cpu().arch()).to.equal(undefined);

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1' as user-agent", function() {
				it("should be amd64", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().cpu().arch()).to.equal("amd64");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});

			context("with 'Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16' as user-agent", function() {
				it("should be ia32", function(done) {
					var router = reset();

					router.route("/")
					.then(function(req, res) {
						expect(req.agent().cpu().arch()).to.equal("ia32");

						res.send();
					});

					cerus.request()
					.path("/")
					.header("user-agent", "Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16")
					.send(function(err) {
						if(err) throw err;

						done();
					});
				});
			});
		});
	});
});