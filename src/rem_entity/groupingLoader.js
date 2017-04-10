/**
 * @fileOverview Handle loading a caching entity groupings
 *
 * @author:	Sky Stebnicki, sky.stebnicki@aereus.com;
 * 			Copyright (c) 2015 Aereus Corporation. All rights reserved.
 */
'use strict';

var BackendRequest = require("../BackendRequest");
var Groupings = require("./Groupings");
var hash = require('object-hash');

/**
 * Cache loaded groupings from the server or local store
 * 
 * @type {Object}
 * @private
 */
var groupingCache_ = {};

/**
 * Entity grouping loader
 */
var groupingLoader = {

    /**
     * Get a grouping
     *
     * If no callback is set then this function will try to return the definition
     * from cache. If it has not yet been loaded then it will force a non-async
     * request which will HANG THE UI so it should only be used as a last resort.
     * 
     * @param {string} objType The name of the object type for our entity
     * @param {string} fieldName The name of the grouping field
     * @param {function} cbLoaded Callback to be loaded when the grouping is loaded
     * @param {Object} opt_filter An optional filter to use when loading the groupings
     * @returns {Groupings} Groupings for the given entity object type and field
     */
    get: function(objType, fieldName, cbLoaded, opt_filter) {

        var filter = opt_filter || null;

        // First check to see if we already have this loaded in cache
        var cached = this.getCached(objType, fieldName, filter);
        if (cached) {
            if (cbLoaded) {
                cbLoaded(cached);
            }

            return cached;
        }

        // Initialize groupings object
        var grps = new Groupings(objType, fieldName, filter);

        // Load from the server
        var request = new BackendRequest();

        if (cbLoaded) {
            alib.events.listen(request, "load", function(evt) {
                grps.fromArray(this.getResponse());
                cbLoaded(grps);
            });
        } else {
            // Set request to be synchronous if no callback is set	
            request.setAsync(false);
        }

        request.send("svr/entity/get-groupings", "GET", {
            obj_type: objType,
            field_name: fieldName,
            filter: JSON.stringify(filter)
        });

        // If no callback then construct Groupings from request date (synchronous)
        if (!cbLoaded) {
            grps.fromArray(request.getResponse());
        }

        // Cache it
        this.cache(grps);

        return grps;
    },

    /**
     * Get a pre-loaded / cached object definition
     *
     * @param {string} objType The name of the object type for our entity
     * @param {string} fieldName The name of the grouping field
     * @param {Object} opt_filter An optional filter to use when loading the groupings
     * @return {[]} Entity groupings on success, null if not cached
     */
    getCached: function(objType, fieldName, opt_filter) {

        var filter = opt_filter || null;
        var fieldFilterHash = hash({field: fieldName, filter: filter});

        // Make sure grouping cache has a property named the object type
        if (typeof groupingCache_[objType] == "undefined") {
            groupingCache_[objType] = {}; // Initialize
        }

        // Return (or callback callback) cached definition if already loaded
        if (groupingCache_[objType][fieldFilterHash]) {
            return groupingCache_[objType][fieldFilterHash];
        }

        return null;
    },

    /**
     * Initialize empty
     */

    /**
     * Cache a grouping object for future loads
     *
     * @param {Groupings} grouping
     */
    cache: function(grouping) {
        var filter = null;
        if (grouping.filter && grouping.filter.length) {
            filter = grouping.filter;
        }
        var fieldFilterHash = hash({field: grouping.fieldName, filter: filter});

        // Set for future cache
        groupingCache_[grouping.objType][fieldFilterHash] = grouping;
    }
};

module.exports = groupingLoader;
