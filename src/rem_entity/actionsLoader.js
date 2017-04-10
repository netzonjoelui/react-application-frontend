/**
* @fileOverview Load actions for an object
*
* @author:	Sky Stebnicki, sky.stebnicki@aereus.com; 
* 			Copyright (c) 2015 Aereus Corporation. All rights reserved.
*/
'use strict';

var BackendRequest = require("../BackendRequest");

// Import all actions classes here for all object types
var ActionClasses = {
	base: require("./actions/DefaultActions"),
	task: require("./actions/TaskActions"),
	lead: require("./actions/LeadActions"),
	customer: require("./actions/CustomerActions"),
	opportunity: require("./actions/OpportunityActions"),
	user: require("./actions/UserActions"),
};

/**
 * Actions cache available for a given object type
 *
 * @private
 * @param {Array}
 */
var actionsCache_ = {};

/**
 * n loader
 */
var actionsLoader = {

	/**
	 * Static function used to load actions for an entity
	 *
	 * @param {string} objType The object type we are getting actions for
	 * @param {function} cbLoaded Callback function once definition is loaded
	 * @return {Definition|void} If no callback is provded then force a return
	 */
	get: function(objType, cbLoaded) {
		
		// Get the name of the class to load
		var objTypeClassName = (ActionClasses[objType]) ? objType : "base";

		// Check to see if the object is already cached & load if not
		if (!actionsCache_[objTypeClassName]) {
			actionsCache_[objTypeClassName] = new ActionClasses[objTypeClassName];
		}

		// Get cached actions object
		var objTypeActions = actionsCache_[objTypeClassName];

		if (cbLoaded) {
			cbLoaded(objTypeActions);
		} else {
			return objTypeActions;
		}	
	}

};

module.exports = actionsLoader;
