module.exports = function() {
	var plugin = {};

	var package = require("./package.json");
	var router;
	
	plugin.name = package["name"];
	plugin.version = package["version"];
	plugin.dependencies = [
		"cerus-server",
		"cerus-promise",
		"cerus-fs"
	];
	
	plugin._init = function(cerus) {
		router = new (require("./lib/router"))(cerus);
	}

	plugin.router = function() {
		return router;
	}

	return plugin;
}