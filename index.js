module.exports = function() {
	var self = {};

	var package = require("./package.json");
	
	self.name = package["name"];
	self.version = package["version"];
	self.dependencies = [
		"cerus-server",
		"cerus-promise",
		"cerus-fs"
	];

	var router;

	self.init_ = function(cerus) {
		router = require("./lib/router")(cerus);
	}

	self.router = function() {
		return router;
	}

	return self;
}