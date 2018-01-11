var expect = require("chai").expect;
var cerus = require("cerus")();
cerus.use(require("cerus-request")());
var router = require("../index")();
var reset = function() {
	router.init_(cerus);
	return router.router();
}

describe.only("request", function() {
	describe("#readable", function() {
		context("with no parameters", function() {
			it("should be true by default", function(done) {
				var router = reset();

				router.route("/")
				.then(function(req, res) {
					expect(req.readable()).to.deep.equal(true);
					res.send();
				});

				cerus.server().start()
				.then(function() {
					cerus.request()
					.port(cerus.settings().port())
					.path("/")
					.send(function(err) {
						if(err) throw err;

						cerus.server().stop();
						done();
					});
				});
			});
		});
	});
});