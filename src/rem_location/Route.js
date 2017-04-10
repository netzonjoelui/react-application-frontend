/**
* @fileOverview Route represents a single route segment
*
* @author:	Sky Stebnicki, sky.stebnicki@aereus.com;
* 			Copyright (c) 2015 Aereus Corporation. All rights reserved.
*/
'use strict';

var Router = require("./Router");
var locationPath = require("./path");

/**
 * Route segment
 *
 * @constructor
 * @param {Router} parentRouter Instance of a parentRouter that will own this route
 * @param {string} segmentName Can be a constant string or a variable with ":" prefixed which falls back to the previous route(?)
 * @param {Controller} controller The controller to load
 * @param {Object} opt_data Optional data to pass to the controller when routed to
 * @param {ReactElement} opt_element Optional parent element to render a fragment into
 */
var Route = function(parentRouter, segmentName, controller, opt_data, opt_element) {

	/**
	 * Path of this route segment
	 *
	 * @type {string}
	 */
	this.name_ = segmentName;

	/**
	 * Set and cache number of segments represented in this route
	 *
	 * @private
	 * @type {int}
	 */
	this.numPathSegments_ = ("/" == segmentName) ? 1 : this.name_.split("/").length;

	/**
	 * Parent inbound router
	 *
	 * @private
	 * @type {Router}
	 */
	this.parentRouter_ = parentRouter;

	/**
	 * Controller class that acts and the UI handler for this route
	 *
	 * This is just the class name, it has not yet been instantiated
	 *
	 * @type {classname: AbstractController}
	 */
	this.controllerClass_ = controller;

	/**
	 * Cached instance of this.controllerClass_
	 *
	 * We are lazy with the loading of the controller to preserve resources
	 * until absolutely necessary.
	 *
	 * @type {AbstractController}
	 */
	this.controller_ = null;

	/**
	 * Data to pass to the controller once instantiated
	 *
	 * @private
	 * @type {Object}
	 */
	this.controllerData_ = opt_data || {};

	/**
	 * Outbound next-hop router
	 *
	 * @private
	 * @type {Router}
	 */
	this.nexthopRouter_ = new Router(this.parentRouter_);

	/**
	 * The domNode that we should render this route into
	 *
	 * @private
	 * @type {ReactElement|DomElement}
	 */
	this.domNode_ = opt_element;

}

/**
 * Called when the router moves to this route for the first time
 *
 * @param {Object} opt_params Optional URL params object
 * @param {function} opt_callback If set call this function when we are finished loading route
 */
Route.prototype.enterRoute = function(opt_params, opt_callback) {
	var doneLoadingCB = opt_callback || null;

	// Instantiate the controller if not already done (lazy load)
	if (null == this.controller_) {
		this.controller_ = new this.controllerClass_;
	}

	/*
	 * Make sure we will not overwrite the this.controllerData_
	 * So it will not inherit the previous opt_params from the previous url
	 * Lets clone the controllerData_ and add the opt_params
	 * instead of directly updating the controllerData_
	 */
	var controllerData = Object.create(this.controllerData_);

	if (opt_params) {
		for (var name in opt_params) {
			controllerData[name] = opt_params[name];
		}
	}

	// Load up the controller and pass the callback if set
	this.controller_.load(controllerData, this.domNode_, this.getChildRouter(), doneLoadingCB);
}

/**
 * Called when the router moves away from this route to show an alternate route
 */
Route.prototype.exitRoute = function() {
	// Exit all childen first
	if (this.getChildRouter().getActiveRoute()) {
		this.getChildRouter().exitActiveRoute();
	}

	// Now unload the controller
	if (this.getController()) {

		this.getController().unload();

		// Delete the controller object
		this.controller_ = null;
	}
}

/**
 * Get this route segment name
 *
 * @return {string}
 */
Route.prototype.getName = function() {
	return this.name_;
}

/**
 * Get the full path to this route
 *
 * @return {string} Full path leading up to and including this path
 */
Route.prototype.getPath = function() {
	return this.parentRouter_.getActivePath();
}

/**
 * Get the router for the next hops
 */
Route.prototype.getChildRouter = function() {
	return this.nexthopRouter_;
}

/**
 * Get the number of segments in this route path name
 *
 * This is important paths like myroute/:varA/:varB
 * because we need to pull all three segmens from a path
 * in order to determine if the route matches any given path.
 *
 * @return {int} The number of segments this route handles
 */
Route.prototype.getNumPathSegments = function() {
	return this.numPathSegments_;
}

/**
 * Test this route against a path to see if it matches
 *
 * @param {string} path The path to test
 * @return {Object|null} If a match is found it retuns an object with .params object and nextHopPath to continue route
 */
Route.prototype.matchesPath = function(path) {

	// If this is a simple one to one then retun a basic match and save cycles
	if (path === this.name_ || ("" == path && this.name_ == "/")) {
		return { path:path, params:{}, nextHopPath:"" }
	}

	// Pull this.numPathSegments_ from the front of the path to test
	var pathReq = this.getPathSegments(path, this.numPathSegments_);
	if (pathReq != null) {

		// We need to split the pathReq so when extracting the location path it will not include the query params
		var targetParts = pathReq.target.split("?");

		// Now check for a match and parse params in the string (not including the query params)
		var params = locationPath.extractParams(this.name_, targetParts[0]);

		// Get any query params
		var queryParams = locationPath.extractQuery(pathReq.target);

		// Merge url params with query params if they exist for this segment
		if (params !== null && queryParams !== null) {
			for (var pname in queryParams) {
				// Do not override URL params
				if (!params[pname]) {
					params[pname] = queryParams[pname];
				}
			}
		} else if (queryParams !== null) {
			params = queryParams;
		}


		// If params is null then the path does not match at all
		if (params !== null) {
			return {
				path: pathReq.target,
				params: params,
				nextHopPath: pathReq.remainder
			}
		}
	}

	// No match was found
	return null;
}

/**
 * Extract a number of segments from a path for matching
 *
 * @param {string} path
 * @param {int} numSegments
 * @return {Object} Format: {target:"math/with/my/num/segs", remainder:"any/trailing/path"}
 */
Route.prototype.getPathSegments = function(path, numSegments) {

	var testTarget = "";

	var parts = path.split("/");

	// If the path does not have enough segments to match this route then return
	if (parts.length < numSegments)
		return null;

	// Set the targetPath for this route
	var targetPath = "";
	for (var i = 0; i < numSegments; i++) {
		if (targetPath.length > 0 || parts[i] == "") {
			targetPath += "/";
		}

		targetPath += parts[i];
	}

	// Get the remainder
	var rem = "";
	if (parts.length != numSegments) {
		// Step over "/" if exists
		var startPos = ("/" == path[targetPath.length]) ? targetPath.length + 1 : targetPath.length;
		rem = path.substring(startPos);
	}

	return {target:targetPath, remainder:rem}

}

/**
 * Get the controller instance for this route
 *
 * @return {AbstractController}
 */
Route.prototype.getController = function() {
	return this.controller_;
}

module.exports = Route;
