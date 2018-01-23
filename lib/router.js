var response = require("./response");
var request = require("./request");
var route = require("./route");

class router extends route {
	constructor(cerus) {
		super(cerus);

		// Route everything to the main route
		cerus.server().callback(function(req, res) {
			var req_ = new request(req, cerus);
			var res_ = new response(res, req_, cerus);

			this.handle(req_, res_);
		}.bind(this));
	}
}

module.exports = router;
