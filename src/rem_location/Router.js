/**
* @fileOverview Main router for handling hashed URLS and routing them to views
*
* Views are a little like pages but stay within the DOM. The main advantage is 
* hash codes are used to navigate though a page. Using views allows you to 
* bind function calls to url hashes. Each view only handles one lovel in the url 
* but can have children so /my/url would be represented by views[my].views[url].show
*
* @author:	Sky Stebnicki, sky.stebnicki@aereus.com; 
* 			Copyright (c) 2015 Aereus Corporation. All rights reserved.
*/
'use strict';

var location = require("./location.js");

/**
 * Creates an instance of AntViewsRouter
 *
 * @constructor
 * @param {Router} parentRouter If set this is a sub-route router
 */
var Router = function(parentRouter) {
	
	/**
	 * Routes for this router
	 *
	 * We store them in an array rather than an object with named params
	 * so that we can simulate fall-through where the first match is
	 * navigated to when it loops throught the routes to find a match.
	 *
	 * @private
	 * @type {Route[]}
	 */
	this.routes_ = new Array();

	/**
	 * Parent router
	 *
	 * @private
	 * @type {Router}
	 */
	this.parentRouter_ = parentRouter || null;

	/**
	 * Cache the last path loaded so we do not reload a path every route follow
	 *
	 * @private
	 * @type {string}
	 */
	this.lastRoutePath_ = "";

	/**
	 * Store a reference to the currently active route
	 *
	 * @private
	 * @type {Route}
	 */
	this.activeRoute_ = null;

	/**
	 * Set a default route path to call if no match is found
	 *
	 * @private
	 * @type {Object} .pattern, path, data
	 */
	this.defaultRoute_ = null;
}

/**
 * Add a route segment to the current level
 * 
 * @param {string} segmentPath Can be a constant string or a variable with ":" prefixed which falls back to the previous route(?)
 * @param {Controller} controller The controller to load
 * @param {Object} opt_data Optional data to pass to the controller when routed to
 * @param {ReactElement} opt_element Optional parent element to render a fragment into
 */
Router.prototype.addRoute = function(segmentPath, controller, opt_data, opt_element) {

	// Set defaults
	var data = opt_data || {};
	var ele = opt_element || null;

	// Make sure route does not already exist
	this.removeRoute(segmentPath);

	// Create a fresh new route
	var Route = require("./Route.js");
	var route = new Route(this, segmentPath, controller, data, ele);

	// Add to this.routes_
	this.routes_.push(route);

	// Return for post-add setup
	return route;
}

/**
 * Delete remote a route and cleanup it's children
 *
 * @param {string} segmentPath The path/pattern for the route to remove
 */
Router.prototype.removeRoute = function(segmentPath) {
	for (var i in this.routes_) {
		if (this.routes_[i].getName() == segmentPath) {
			this.routes_.splice([i], 1);
			return;
		}
	}
}

/**
 * Get a route by a segment name
 *
 * @param {string} name The name of the route to get
 * @return {Route|bool} A route if one exists by that name, otherwise return false
 */
Router.prototype.getRoute = function(name) {
	for (var i in this.routes_) {
		if (this.routes_[i].getName() == name) {
			return this.routes_[i];
		}
	}

	return false;
}

/**
 * Get the parent router of this router
 *
 * @return {Router}
 */
Router.prototype.getParentRouter = function() {
	return this.parentRouter_;
}

/**
 * Get the active path leading up to but NOT including this router
 *
 * @return {string} Full path
 */
Router.prototype.getBasePath = function() {
	var basePath = "";

	if (this.getParentRouter()) {
		basePath = this.getParentRouter().getActivePath();
	}


	return basePath;
}

/**
 * Get the active path leading up to and including this router
 *
 * @return {string} Full path
 */
Router.prototype.getActivePath = function() {
	var pre = this.getBasePath();

	if (pre && pre != "/") {
		pre += "/";
	}

	return pre + this.lastRoutePath_;
}

/**
 * Go to a route by path
 * 
 * @param {string} path Path to route to
 * @return {bool} return true if route was found and followed, false if no route matched path
 */
Router.prototype.go = function(path) {

	var route = null;

	/*
	 * TODO: future optimization
	 * If we cached not only the path last loaded, but that pattern
	 * that was matched from the route, we could probably determine right
	 * here if anything needs to happen or if we should just jump to the next
	 * hop of this.activeRoute_ and forgo looping through each route and 
	 * matching the pattern to the path.
	 * - Sky Stebnicki
	 */

	// Loop through each route and see if we have a match
	for (var i in this.routes_) {
		var matchObj = this.routes_[i].matchesPath(path);
		if (matchObj) {
			// Follow matched route down to next hope
			return this.followRoute(this.routes_[i], matchObj.path, matchObj.params, matchObj.nextHopPath);
		}
	}

	/*
	 * No match was found. Check to see if there is a default that is 
	 * different than the current path (circular calls to self = bad),
	 */
	if (this.defaultRoute_ && this.defaultRoute_ != path) {
		return this.goToDefaultRoute();
		//return this.go(this.defaultRoute_);
	}

	return false;
}

/**
 * Goto a specific route
 *
 * @param {Route} route The route to load
 * @param {string} opt_path If we are loading a route from a path, what the actual path was
 * @param {Object} opt_params URL params
 * @param {string} opt_remainingPath The rest of the path to continue loading past route
 */
Router.prototype.followRoute = function(route, opt_path, opt_params, opt_remainingPath) {
	var segPath = opt_path || "";
	var params = opt_params || {};
	var remPath = opt_remainingPath || "";

    // Trigger route change event
    alib.events.triggerEvent(this, "routechange", {
        path: segPath,
        relativePath: (remPath) ? segPath + "/" + remPath : segPath
    });

	// Check to see if we have already loaded this path
	if (segPath != this.lastRoutePath_) {

		// Exit the last active route
		this.exitActiveRoute();

		// Set local history to keep from re-rendering when a subroute changes
		this.lastRoutePath_ = segPath;

		// Save new active route
		this.activeRoute_ = route;

		// Load up and enter the route
		route.enterRoute(params, function() {
			if (remPath) {
				// If we have more hops then continue processing full path at next hop
				route.getChildRouter().go(remPath);
			} else {
				// There may be a default route for the next router to navigate to
				route.getChildRouter().goToDefaultRoute();
			}
		});

	} else  if (remPath) {
		// Send the remainder down to the next hop because this segment is unchanged
		route.getChildRouter().go(remPath);
	} else {
		/* 
		 * This is the end of the path. Find out if the next router has a default 
		 * we should load, otherwise exit.
		 */
		if (!route.getChildRouter().goToDefaultRoute()) {
			route.getChildRouter().exitActiveRoute();
		}
	}
	
}

/**
 * Exit active route
 */
Router.prototype.exitActiveRoute = function() {
	var actRoute = this.getActiveRoute();
	if (actRoute) {
		actRoute.exitRoute();
	}

	this.activeRoute_ = null;
	this.lastRoutePath_ = "";
}

/**
 * Get the currently active route
 *
 * @return {Route} Route if active, null of no routes are active
 */
Router.prototype.getActiveRoute = function() {
	return this.activeRoute_;
}

/**
 * Set the default route to use if no route is provided
 *
 * @param {string} defaultRoute
 */
Router.prototype.setDefaultRoute = function(defaultRoute) {
	this.defaultRoute_ = defaultRoute;
}

/**
 * Navigate to the default route if one exists
 *
 * @return {bool} true if there was a default route, false if no default exists
 */
Router.prototype.goToDefaultRoute = function() {

	if (this.defaultRoute_) {
		// Get the base path
		var basePath = this.getBasePath();
		if (basePath != "/") {
			basePath += "/";
		}

		// We can't just call this.go because we need to change the location object
		location.go(basePath + this.defaultRoute_);
		return true;
	} 

	// There was no default route
	return false;
}

module.exports = Router;