/**
 * @fileOverview Definition loader
 *
 * @author:    Sky Stebnicki, sky.stebnicki@aereus.com;
 *            Copyright (c) 2014 Aereus Corporation. All rights reserved.
 */
'use strict';

var BackendRequest = require("../BackendRequest");
var Definition = require("./Definition");
var log = require("../log");

/**
 * Entity definition loader
 */
var definitionLoader = {};

/**
 * Keep a reference to loaded definitions to reduce requests
 *
 * @private
 * @param {Object}
 */
definitionLoader._definitions = new Array();

/**
 * Flag that will determine if all definitions were already loaded
 *
 * @private
 * @param {Bool}
 */
definitionLoader._flagAllDefinitionsLoaded = false;

/**
 * Keep the reference of the request per objType
 *
 * Every objType will only have one BackendRequest instance.
 * With this, we can make sure that we do not have multiple requests for getting
 *  the object's entity definition
 *
 * @private
 * @param {Object}
 */
definitionLoader._requests = {};

/**
 * Static function used to load an entity definition
 *
 * If no callback is set then this function will try to return the definition
 * from cache. If it has not yet been loaded then it will force a non-async
 * request which will HANG THE UI so it should only be used as a last resort.
 *
 * @param {string} objType The object type we are loading a definition for
 * @param {function} cbLoaded Callback function once definition is loaded
 * @return {Definition|void} If no callback is provded then force a return
 */
definitionLoader.get = function (objType, cbLoaded) {

    if (!objType) {
        throw "The first param {objType} is required and cannot be blank or null";
    }

    // Return (or call callback) cached definition if already loaded
    if (this._definitions[objType] != null) {

        if (cbLoaded) {
            cbLoaded(this._definitions[objType]);
        }

        return this._definitions[objType];
    }

    /*
     * Setup the request
     *
     * If the request is synchronous, then we create a new one each time.
     * If it is asynchronous then we only want one request for this object
     * being sent at a time.
     */
    var request = null;

    if (cbLoaded) {
      // Check if we do not have a backend request for this type of object
      if (!definitionLoader._requests[objType]) {
          // Create a new backend request instance for this object
          definitionLoader._requests[objType] = new BackendRequest();
      }

      request = definitionLoader._requests[objType];
    } else {
      // Not an asynchronous request, just make a new one for each call
      request = new BackendRequest();
    }

    // Log errors
    alib.events.listen(request, "error", function (evt) {
        log.error("Failed to load request", evt);
    });

    if (cbLoaded) {
        alib.events.listen(request, "load", function (evt) {
            var def = definitionLoader.createFromData(this.getResponse());
            cbLoaded(def);
        });
    } else {
        // Set request to be synchronous if no callback is set
        request.setAsync(false);
    }

    /*
     * If this is an async request and there is already another request in
     * progress for this object type, then we do not need to send another
     * request. Instead piggy-back on the previous request but adding the
     * callback above but just wait for the in-progress request previously
     * running to return.
     *
     * If we are either (1) not asynchronous or (2) not in progress then send
     */
    if (!cbLoaded || !definitionLoader._requests[objType].isInProgress()) {
      request.send("svr/entity/getDefinition", "GET", {obj_type: objType});
    }


    // If no callback then construct Definition from request date (synchronous)
    if (!cbLoaded) {
        return this.createFromData(request.getResponse());
    }
}

/**
 * Map data to an entity definition object
 *
 * @param {Object} data The data to create the definition from
 */
definitionLoader.createFromData = function (data) {

    // Construct definition and initialize with data
    var def = new Definition(data);

    // Cache it for future requests
    this._definitions[def.objType] = def;

    return this._definitions[def.objType];
}

/**
 * Get a pre-loaded / cached object definition
 *
 * @param {string} objType The uniqy name of the object entity type
 * @return {Definition} Entity defintion on success, null if not cached
 */
definitionLoader.getCached = function (objType) {
    if (this._definitions[objType]) {
        return this._definitions[objType];
    }

    return null;
}

/**
 * Load all the entity definitions
 *
 * @param {function} cbLoaded Callback function once definition is loaded
 * @return {Definition|void} If no callback is provded then force a return
 *
 * @public
 */
definitionLoader.getAll = function(cbLoaded) {

    // Return (or call callback) cached object if already loaded
    if (definitionLoader._flagAllDefinitionsLoaded) {

        if (cbLoaded) {
            cbLoaded(definitionLoader._definitions);
        }

        return definitionLoader._definitions;
    }

    // Create an instance of BackendRequest
    var request = new BackendRequest();

    // Log errors
    alib.events.listen(request, "error", function (evt) {
        log.error("Failed to load request", evt);
    });

    if (cbLoaded) {
        alib.events.listen(request, "load", function (evt) {
            definitionLoader.preloadAllDefinitions(this.getResponse());
            cbLoaded(definitionLoader._definitions);
        });
    } else {

        // Set request to be synchronous if no callback is set
        request.setAsync(false);
    }

    // Send request
    request.send("svr/entity/allDefinitions", "GET");

    // If no callback then construct Definition from request date (synchronous)
    if (!cbLoaded) {
        definitionLoader.preloadAllDefinitions(request.getResponse());
        return definitionLoader._definitions;
    }
}

/**
 * Map the raw data for a list of definitions to entity/Definition objects
 *
 * @param {array} definitions Array of all definitions
 *
 * @public
 */
definitionLoader.preloadAllDefinitions = function(definitions) {
    if(definitions) {
        definitions.map(function(definition){
            var def = new Definition(definition);

            // Cache it for future requests
            if(!definitionLoader._definitions[def.objType]) {
                definitionLoader._definitions[def.objType] = def;
            }
        })

        definitionLoader._flagAllDefinitionsLoaded = true;
    }
}

/**
 * Update the definition
 *
 * @param {Object} data The data to update the definition from
 * @return {Definition} Entity defintion that has been updated
 */
definitionLoader.updateDefinition = function (data) {
    return definitionLoader.createFromData(data);
}

module.exports = definitionLoader;
