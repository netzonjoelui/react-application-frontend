/**
* @fileOverview Static location proxy for the client to replace things like window.location
*
* @author:	Sky Stebnicki, sky.stebnicki@aereus.com; 
* 			Copyright (c) 2015 Aereus Corporation. All rights reserved.
*/
'use strict';

var Hash = require("./adaptor/Hash.js");
var locationPath = require("./path");

/**
 * Create namespace for server settings
 */
var location = {
	path: locationPath
};

/**
 * The type of actions that can take place in the location of this device
 */
location.actions = {

  // Indicates a new location is being pushed to the history stack.
  PUSH: 'push',

  // Indicates the current location should be replaced.
  REPLACE: 'replace',

  // Indicates the most recent entry should be removed from the history stack.
  POP: 'pop'

};

/**
 * Location adaptor handle
 *
 * @private
 * @type {location.adaptor}
 */
location.adaptor_ = null;

/**
 * Go to a path
 */
location.go = function(path, queryParams) {

	if (typeof queryParams !== "undefined") {
		path = this.path.withQuery(path, queryParams);
	}

	// Push the location to the current adaptor
	this.getAdaptor().push(path);
}

/**
 * Try to go back if there is anything in history
 *
 * @return bool true 
 */
location.goBack = function() {
	if (typeof window != "undefined") {
		window.history.back();
		return true;
	}
	return false;
}

/**
 * Setup a router to listen for location change events
 * 
 * @param {location.Router} router The router that handles location changes
 * @param {location.adaptor} opt_handler Manually set the location adaptor
 */
location.setupRouter = function(router, opt_adaptor) {
	// Check to see if we should be manually setting the adaptor
	if (opt_adaptor) {
		this.setAdaptor(opt_adaptor);
	}

	/*
	 * Get the location adaptor which will setup a listener which calls this.triggerPathChange_
	 * when the location of the adaptor changes.
	 */
	var adaptor = this.getAdaptor();

	// Listen for a path change and tell the router to go to that path
	alib.events.listen(this, "pathchange", function(evt) {
		router.go(evt.data.path);
	});

	// Go to the current path in the adaptor
	var currentPath = adaptor.getCurrentPath();
	if (currentPath) {
		router.go(currentPath);
	} else {
		router.go("/");
	}
}

/** 
 * Temp hack
 */
location.checkNav = function() {
	var load = "";
	if (document.location.hash)
	{
		var load = document.location.hash.substring(1);
	}
    
	if (load == "" && this.defaultRoute != "")
		load = this.defaultRoute;

	if (load != "" && load != this.lastLoaded)
	{
		this.lastLoaded = load;
		//ALib.m_debug = true;
		//ALib.trace(load);
		this.triggerPathChange_(load, location.actions.PUSH);
	}
}

/**
 * Trigger location change events
 *
 * @param {string} path The path we changed to
 * @param {location.actions} type The type of action that triggered the event
 */
location.triggerPathChange_ = function(path, type) {
	alib.events.triggerEvent(this, "pathchange", {path:path, actionType:type});
}

/**
 * Get the current path
 * 
 * @return {string}
 */
location.getCurrentPath = function() {
	var adaptor = this.getAdaptor();
	return adaptor.getCurrentPath();
}

/**
 * Get the relative URL root of the current path
 *
 * For example:
 *  www.host.com/my/deep/path would return ../../..
 *  www.host.com#/my/deep/path would return . because of the #
 *
 * @returns {string}
 */
location.getRelativeUrlRoot = function() {
    var adaptor = this.getAdaptor();
    return adaptor.getRelativeRoot();
}

/**
 * Get the location adaptor
 * 
 * @return {location.adaptor}
 */
location.getAdaptor = function() {
	// If we do not have an adaptor set then get the best option with setAdaptor
	if (null == this.adaptor_)
		this.setAdaptor();

	return this.adaptor_;
}

/**
 * Initialize location managers
 *
 * @param {Object} opt_handler Manually set the location adaptor
 */
location.setAdaptor = function(opt_adaptor) {

	// Set local location adaptor
	this.adaptor_ = opt_adaptor || this.getBestAdaptor_();

	alib.events.listen(this.adaptor_, "pathchange", function(evt) {
		location.triggerPathChange_(evt.data.path, evt.data.type);
	});

	return this.adaptor_;
}

/**
 * Detect best adaptor for current device
 *
 * @private
 */
location.getBestAdaptor_ = function() {
	return new Hash();
}

module.exports = location;
