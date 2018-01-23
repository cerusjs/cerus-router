# Changelog

## v0.0.4 (2 Nov. 2017)
- (New) Created the module.
- (New) Added the package.json.
- (New) Added the router, response and request class.
- (New) Added the .gitignore.

## v0.0.5 (3 Nov. 2017)
- (New) Added compression options to the send function.

## v0.0.6 (4 Nov. 2017)
- (Fix) Fixed how the router will check for existing routes.

## v0.0.7 (6 Nov. 2017)
- (Fix) Fixed how the type header is set.

## v0.0.8 (11 Nov. 2017)
- (Enh) A 404 message will now be send when no route was found.
- (Fix) The response will now always send a buffer if a string is supplied.

## v0.0.9 (11 Nov. 2017)
- (Fix) Fixed a wrong function being called on a 404 error.

## v0.0.10 (11 Nov. 2017)
- (Fix) Fixed an issue with parsing the cookies.

## v0.1.0 (2 Jan. 2018)
- (New) Redid the whole router.
- (New) Redid the response.
- (New) Redid the request.
- (New) Started adding tests.
- (New) Added a lot of methods to the request class.
- (New) Added the ua-parser-js package to parse the user-agent.
- (Enh) Added an alias for the status method in the response class.
- (Enh) Routes now support RegExps and you can cancel the route.
- (Enh) Added the index file.
- (Fix) Removed some unused code.

## v0.1.1 (23 Jan. 2018)
- (New) Redid everything again.
- (New) Added istanbul.
- (New) Added documentation to all classes.
- (New) Added priorities to layers.
- (New) Added even more tests.
- (New) Added eslint.
- (Enh) Changed the router class to use the correct inheritance.
- (Fix) Removed some unused brackets in the layer.match function.
- (Fix) Fixed some missing this references.