/**
 * @fileoverview Manage a session token from the server
 *
 * @author Sky Stebnicki, sky.stebnicki@aereus.com
 * @copyright Copyright (c) 2014 Aereus Corporation. All rights reserved.
 */
'use strict';

var localData = require("./localData");

/**
 * Session token
 *
 * @private
 * @type {string}
 */
var sessionToken_ = null;

var sessionManager = {
	/**
	 * Retrieve the session token
	 */
	getSessionToken: function() {
		
		// Try to retrieve from local storage if available
		if (!sessionToken_) {
			sessionToken_ = localData.getSetting("sessionToken");
		}

		return sessionToken_;
	},

	/**
	 * Set the session token
	 *
	 * @param {string} token The session token provided from the server
	 */
	setSessionToken: function(token) {
		
		// Save the token to local storage if available
		localData.setSetting("sessionToken", token);

		sessionToken_ = token;
	},

	/**
	 * Clear the session token
	 *
	 */
	clearSessionToken: function() {
		this.setSessionToken(null);
	}
}

module.exports = sessionManager;
