import React from 'react';
import ReactDOM from 'react-dom';
import ApplicationContainer from './containers/ApplicationContainer';
import base from './base';
var Device = require("./Device");
var server = require("./server");
var sessionManager = require("./sessionManager");

// Redux
import { updateOnline, sendHearbeat } from './actions';
import { updateAccount } from './actions/account';
import store from './store';

/**
 * Main application entry point
 *
 * @param {string} universalLoginUrl URL to a login page for any account
 */
var Application = function(universalLoginUrl = "") {
	
	/**
	 * Represents the actual netric account
	 *
	 * @public
	 * @var {Application.Account}
	 */
	this.account = null;

	/**
	 * Device information class
	 *
	 * @public
	 * @var {netric.Device}
	 */
	this.device = new Device();

	/**
	 * DOM Node to render this applicaiton into
	 *
	 * @private
	 * @var {DOMNode}
	 */
	this.appDomNode_ = null;

  /**
   * URL used by the application to login to accounts if not server is set
   *
   * @type {string}
   */
  this.universalLoginUrl = universalLoginUrl;
};

/**
 * Static function used to load the application
 *
 * @param {function} cbFunction Callback function once app is loaded
 * @param {string} universalLoginUrl URL to a login page for any account
 */
Application.load = function(cbFunction, universalLoginUrl) {

  // Initialize a new application
	var application = new Application(universalLoginUrl);

  // Set global in netric base
  base.setApplication(application);

	// Execute the callback so we can run the app
	cbFunction(application);
};

/**
 * Get the current account
 *
 * @return {Object}
 */
Application.prototype.getAccount = function() {
	return store.getState().account;
};

/**
 * Set the current account for this application
 *
 * @param {Object} account
 */
Application.prototype.setAccount = function(account) {
	this.account = account;
};

/**
 * New run function loads root react application container
 */
Application.prototype.run = function(domCon) {

  // Update the login url in the application state
	if (this.universalLoginUrl) {
		store.dispatch(updateAccount({universalLoginUrl: this.universalLoginUrl}));
	}
  
  ReactDOM.render(
    React.createElement(ApplicationContainer, {
      store: store
    }),
    domCon
  );

  // Start the heartbeat
  this.queueHeartBeat();
};

/**
 * Queue up a heartbeat check
 *
 * @param {int} delay Optional number of ms to delay the check
 */
Application.prototype.queueHeartBeat = function(delay) {
	// Default check every 30 seconds
	var inMs = delay || 300000;
	setTimeout(function() { this.heartBeat(); }.bind(this), inMs);
};

/**
 * Heartbeat function used to make sure the current session is still validated
 *
 * This is where netric issues and session invalidation on the server side are handled.
 */
Application.prototype.heartBeat = function() {

  // If the user logged-in online send a heartbeat request to the server
  if (store.getState().account.user.authToken) {
    store.dispatch(sendHearbeat(server.host, store.getState().account.user.authToken));
  }

  // Queue another check in 30 seconds
  this.queueHeartBeat(null);
};

/**
 * This is just a test function to watch the status change in the state
 */
const updateLegacyModels = () => {
  const state = store.getState();
  server.online = state.device.status;
  server.host = state.account.server;
	sessionManager.setSessionToken(state.account.user.authToken);
};

let unsubscribe = store.subscribe(updateLegacyModels);

export default Application;
