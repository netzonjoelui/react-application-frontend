/**
 * @fileOverview Object represents the netric account object
 *
 * @author:	Sky Stebnicki, sky.stebnicki@aereus.com; 
 * 			Copyright (c) 2014 Aereus Corporation. All rights reserved.
 */
var user = require("../User");

/**
 * Account instance
 *
 * @param {Object} opt_data Optional data used to initialize the account
 */
var Account = function(opt_data) {
	
	// Initialize empty object if opt_data was not set
	var initData = opt_data || new Object();

	/**
	 * Account ID
	 *
	 * @public
	 * @type {string}
	 */
	this.id = "";

	/**
	 * Unique account name
	 *
	 * @public
	 * @type {string}
	 */
	this.name = "";

	/**
	 * Organization name
	 * 
	 * @public
	 * @type {string}
	 */
	this.orgName = "";

	/**
	 * The default module to load
	 * 
	 * @public
	 * @type {string}
	 */
	this.defaultModule = "home";

	/**
	 * Currently authenticated user
	 * 
	 * @public
	 * @type {netric.User}
	 */
	this.user = null;

	// If data was passed in then load it
	if (initData)
		this.loadData(initData);
}

/**
 * Get the current authenticated user
 *
 * @return netric/User
 */
Account.prototype.getUser = function() {
	return this.user;
}

/**
 * Load data
 *
 * If we are loading in array form that means that properties are not camel case
 * 
 * @param {Object} data
 */
Account.prototype.loadData = function(data) {
	this.id = data.id || "";
	this.name = data.name || "";
	this.orgName = data.orgName || "";
	this.defaultModule = data.defaultModule || "home";
	this.user = (data.user) ? new user(data.user) : null;

	/*
	 * If modules have been pre-loaded in the application data then set
	 */
	if (data.modules)
		moduleLoader.preloadFromData(data.modules);

	// Trigger onchange event to alert any observers that this value has changed
	alib.events.triggerEvent(this, "change");
}

module.exports = Account;
