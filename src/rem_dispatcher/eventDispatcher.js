/**
 * Use this dispatcher to send and register for global application events
 *
 * This is currently just a thin wrapper around alib.events
 *
 * @author:	Sky Stebnicki, sky.stebnicki@aereus.com;
 * 			Copyright (c) 2015 Aereus Corporation. All rights reserved.
 */
'use strict';

/**
 * n loader
 */
var eventDispatcher = {

    /**
     * Register a new event listener
     *
     * @param {string} objType The object type we are getting actions for
     * @param {function} cbFunction Callback function to call when an event occurs
     * @return {Definition|void} If no callback is provded then force a return
     */
    listen: function(eventType, cbFunction) {

        alib.events.listen(this, eventType, function(evt) {
            cbFunction(evt.data.payload);
        });
    },

    /**
     * Trigger a new even to be sent to all listeners
     *
     * @param eventType
     * @param payload
     */
    triggerEvent: function(eventType, payload) {
        alib.events.triggerEvent(this, eventType, {payload: payload});
    }
};

module.exports = eventDispatcher;
