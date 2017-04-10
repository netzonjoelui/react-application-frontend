/**
 * @fileoverview Local data storage abstraction
 */
var localforage = require("localforage");

/**
 * Setup localforage
 */
localforage.config({
    name: 'Netric-DB'
});

/**
 * Try to detect and see if localstorage is available
 *
 * @private
 * @type {bool}
 */
var localStorageAvailable = false;
try {
	localStorageAvailable = 'localStorage' in window && window['localStorage'] !== null;
} catch (e) {
	// localStorage is not available sadly
}

var localData = {

	/**
	 * Retrieve a setting by name
	 * 
	 * Behind the scenes this uses localstorage
	 *
	 * @param {string} name The name of the property to pull
	 */
	getSetting: function(name) {
		
		if (!localStorageAvailable)
			return null;

		if (window.localStorage[name] && window.localStorage[name] != "null") {
			return window.localStorage[name];
		} else {
			return null;
		}
	},

	/**
	 * Retrieve a setting by name
	 * 
	 * Behind the scenes this uses localstorage
	 *
	 * @param {string} name The name of the property to pull
	 * @param {string} value The value to set name to
	 */
	setSetting: function(name, value) {

		if (value === null) {
			value = "";
		}

		if (localStorageAvailable) {
			window.localStorage[name] = value;
			return true;
		} else  {
			return false;
		}
	},

	/**
	 * Get an item from the DB
	 *
	 * @param {string} key The unique key of the item to get
	 * @param {function} cbFinished Callback to call when retrieved
	 */
	dbGetItem: function(key, cbFunction) {
		localforage.getItem(key, function(err, value) {
		    // Send results to the user
		    cbFunction(err, value);
		});
	},

	/**
	 * Get an item from the DB
	 *
	 * @param {string} key The unique key of the item to get
	 * @param {string|array|blog} value Anything to store that can be encoded or raw binary
	 * @param {function} cbFinished Callback to call when retrieved
	 */
	dbSetItem: function(key, value, cbFunction) {
		localforage.setItem(key, value, function(err, value) {
		    // Send results to the user
		    cbFunction(err, value);
		});
	},

	/**
	 * Remove an item from the database
	 *
	 * @param {string} key The unique key of the item to get
	 * @param {function} cbFinished Callback to call when key is removed
	 */
	dbRemoveItem: function(key, cbFunction) {
		localforage.removeItem(key, function(err) {
		    // Run this code once the key has been removed.

		    // TODO: Not yet tested
		    throw "Not yet tested";
		});
	},

	/**
	 * Clear all keys from the local storage including settings and db
	 */
	dbClear: function(cbFunction) {
		localforage.clear(function(err) {
		    // Run this code once the database has been entirely deleted.
			if (err) {
				console.error("There was a problem clearing the local database");
			}
		});
	}
}

module.exports = localData;