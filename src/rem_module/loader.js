/**
* @fileOverview Module loader
*
* @author:	Sky Stebnicki, sky.stebnicki@aereus.com; 
* 			Copyright (c) 2014 Aereus Corporation. All rights reserved.
*/
'use strict';

var BackendRequest = require("../BackendRequest.js");
var Module = require("./Module.js");

/**
 * Global module loader
 */
var loader = {}

/**
 * Loaded applications
 *
 * @private
 * @param {Array}
 */
loader.loadedModules_ = new Array();

/**
 * Static function used to load the module
 *
 * @param {string} moduleName The name of the module to load
 * @param {function} cbLoaded Callback function once module is loaded
 */
loader.get = function(moduleName, cbLoaded)
{
	// Return (or callback callback) cached module if already loaded
	if (this.loadedModules_[moduleName]) {
		
		if (cbLoaded) {
			cbLoaded(this.loadedModules_[moduleName]);
		}

		return this.loadedModules_[moduleName];
	}

	var request = new BackendRequest();

	if (cbLoaded) {
		alib.events.listen(request, "load", function(evt) {
			var module = loader.createModuleFromData(this.getResponse());
			cbLoaded(module);
		});
	} else {
		// Set request to be synchronous if no callback is set	
		request.setAsync(false);
	}

	request.send("svr/module/get", "GET", {name:moduleName});

	// If no callback then construct netric.module.Module from request date (synchronous)
	if (!cbLoaded) {
		return this.createModuleFromData(request.getResponse());
	}
}

/** 
 * Map data to an module object
 *
 * @param {Object} data The data to create an module from
 */
loader.createModuleFromData = function(data) {
	var module = new Module(data);

	// Make sure the name was set to something other than ""
	if (module.name.length) {
		this.loadedModules_[module.name] = module;		
	}

	return module;
}

/** 
 * Preload/cache modules from data
 *
 * Use data to preload or cache modules by name. This is typically
 * called from netric/account/Account when loading data from the
 * server, all the modules are preloaded at that time.
 *
 * @param {Object[]} modulesData
 */
loader.preloadFromData = function(modulesData) {
	for (var i in modulesData) {
		this.createModuleFromData(modulesData[i]);
	}
}

/**
 * Get all loaded modules
 *
 * @return {netric.module.Module[]}
 */
loader.getModules = function() {
    return this.loadedModules_;
}

module.exports = loader;
