/**
* @fileOverview Modules are sub-applications within the application framework
*
* @author:	Sky Stebnicki, sky.stebnicki@aereus.com; 
* 			Copyright (c) 2014 Aereus Corporation. All rights reserved.
*/
'use strict';

/**
 * Application module instance
 *
 * @param {Object} opt_data Optional data for loading the module
 */
var Module = function(opt_data) {
	var data = opt_data || new Object();

	/**
	 * Unique name for this module
	 * 
	 * @public
	 * @type {string}
	 */
	this.name = data.name || "";

	/**
	 * Human readable title
	 * 
	 * @public
	 * @type {string}
	 */
	this.title = data.title || "";

	/**
	 * Icon class name
	 * 
	 * @public
	 * @type {string}
	 */
	this.icon = data.icon || "";

	/**
	 * The default route to load once the module is rendered
	 * 
	 * @public
	 * @type {string}
	 */
	this.defaultRoute = data.defaultRoute || "";

	/**
	 * Navigation configuration
	 * 
	 * @public
	 * @type {string}
	 */
	this.navigation = data.navigation || "";
}

/**
 * Static function used to load the module
 *
 * @param {function} opt_cbFunction Optional callback function once module is loaded
 */
Module.load = function(opt_cbFunction) {
	// TODO: load module definition
}

/**
 * Run the loaded module
 *
 * @param {DOMElement} domCon Container to render module into
 */
Module.prototype.run = function(domCon) {
	// TODO: render module into domCon
}

module.exports = Module;
