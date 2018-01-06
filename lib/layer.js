var layer = module.exports = function(path, full, callback, options = {}) {
	// Set the local variables
	this.path = path;
	this.full = full;
	this.sensitive = options["sensitive"] || false;
	this.method = options["method"] || "ALL";
	this.route = options["route"] || undefined;
	this.callback = callback;

	// TODO: Future feature?
	//this.regexp = regexp
}

layer.prototype.match = function(path, method) {
	// Check if the arguments are correct
	if(typeof path === "string" && typeof method === "string") {
		// Check if the method doesn't match
		if(this.method !== "ALL" && this.method !== method) {
			return false;
		}

		// Always return true when the path is "/" or "*"
		if(this.path === "/" || this.path === "*") {
			return true;
		}

		// Check if the full path matches the path
		if((this.full + this.path) === path) {
			return true;
		}

		// Check if the full path ends with "*" and then check if that path matches
		if((this.full + this.path).endsWith("*") 
			&& path.startsWith((this.full + this.path).substring(0, (this.full + this.path).length - 1))) {
			return true;
		}
	}

	// Return false since there was no match
	return false;
}