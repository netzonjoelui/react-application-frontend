/**
 * @Depricated - We are now using the entity/Collection.js directly to load the entities
 *
 * @fileOverview collection loader
 *
 * @author:    Sky Stebnicki, sky.stebnicki@aereus.com;
 *            Copyright (c) 2014 Aereus Corporation. All rights reserved.
 */
'use strict';

var Collection = require("../Collection");
var BackendRequest = require("../BackendRequest");

/**
 * Entity collection loader
 */
var collectionLoader = {};

/**
 * Static function used to load an entity collection
 *
 * If no callback is set then this function will try to return the collection
 * from cache. If it has not yet been loaded then it will force a non-async
 * request which will HANG THE UI so it should only be used as a last resort.
 *
 * @param {string} objType The object type we are loading a collection for
 * @param {function} cbLoaded Callback function once collection is loaded
 */
collectionLoader.get = function (query, cbLoaded) {

    var collection = new Collection();
    this.loadCollection(query, collection, cbLoaded);

}

/**
 * Querty the backend and set the results for a collection
 *
 * @param {Query} query
 * @param {Collection} collection Collection to store results in
 * @param {function} cbLoaded Callback function once collection is loaded
 */
collectionLoader.loadCollection = function (query, collection, cbLoaded) {
    var request = new BackendRequest();

    if (cbLoaded) {
        alib.events.listen(request, "load", function (evt) {
            var def = collectionLoader.createFromData(this.getResponse());
            cbLoaded(def);
        });
    } else {
        // Set request to be synchronous if no callback is set
        request.setAsync(false);
    }

    request.send("svr/entity/getDefinition", "GET", {obj_type: objType});
}

module.exports = collectionLoader;