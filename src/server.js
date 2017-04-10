/**
* @fileOverview Server settings object
*
* @author:	Sky Stebnicki, sky.stebnicki@aereus.com; 
* 			Copyright (c) 2014 Aereus Corporation. All rights reserved.
*/
'use strict';

/**
 * Create global namespace for server settings
 */
var server = {};

/**
 * Server host
 * 
 * If = "" then assume server is hosted from the same origin
 * as the client, as in from the web server.
 *
 * If this is set, then make sure the auth token has been
 * negotiated and set.
 *
 * @public
 * @type {string}
 */
server.host = "";

/**
 * The URI for the universal login service
 *
 * This is used if server.host has not been set to determine
 * what instance of netric to actually authenticate the user against.
 *
 * @public
 * @type {string}
 */
server.universalLoginUri = "https://login.netric.com";

/**
 * Connection status used to indicate if we are able to query the server
 *
 * Example"
 * <code>
 *	if (netric.server.online)
 *		server.getData();
 *	else
 * 		localStore.getData();
 * </code>
 *
 * @public
 * @type {bool}
 */
server.online = true;


/**
 * Auth string is returned from the server when a user authenticates
 *
 * @public
 * @type {string}
 */
server.sessionAuthToken = null

module.exports = server;
