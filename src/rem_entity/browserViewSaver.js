/**
 * @fileOverview Browser View Saver.
 * @Use: Pass the browserView object in the ::save() first argument
 *
 * @author:  Marl Tumulak, marl.tumulak@aereus.com;
 *           Copyright (c) 2015 Aereus Corporation. All rights reserved.
 */
'use strict';

var BackendRequest = require("../BackendRequest");
var nertic = require("../base");

var browserViewSaver = {

    /**
     * Save a browser view
     *
     * @param {netric\entity\BrowserView} browserView   The browser view to save
     * @param {function} opt_finishedCallback Optional callback to call when saved
     * @public
     */
    save: function(browserView, opt_finishedCallback) {
        
        if (!browserView) {
            throw "entity/browserViewSaver: First param must be a browserView";
        }
            
        var data = browserView.getData();
            
        // If we are connected
        if (netric.server.online) {
            // Save the data remotely
            BackendRequest.send("svr/browserview/save", function(resp) {
        
                // First check to see if there was an error
                if (resp.error) {
                    throw "Error saving view: " + resp.error;
                }
        
                // Update the id of the browserView
                browserView.setId(resp);

                // Invoke callback if set
                if (opt_finishedCallback) {
                    opt_finishedCallback(browserView);
                }
        
            }, 'POST', JSON.stringify(data));
                
        } else {
            throw "Error saving browserView: Netric server is offline.";
        }
    },

    /**
     * Set a browser view as default view
     *
     * @param {netric\entity\BrowserView} browserView   The browser view that will be set as default view
     * @param {function} opt_finishedCallback Optional callback to call when finished
     * @public
     */
    setDefaultView: function (browserView, opt_finishedCallback) {

        if (!browserView) {
            throw "entity/browserViewSaver: First param must be a browserView";
        }

        if(!browserView.id) {
            throw "BrowserView should be saved first before setting as the default view.";
        }

        var data = browserView.getData();

        // If we are connected
        if (netric.server.online) {

            // Save the data remotely
            BackendRequest.send("svr/browserview/setDefaultView", function(resp) {

                // First check to see if there was an error
                if (resp.error) {
                    throw "Error setting the browser view as default: " + resp.error;
                }

                // Invoke callback if set
                if (opt_finishedCallback) {
                    opt_finishedCallback(browserView);
                }

            }, 'POST', JSON.stringify(data));

        } else {
            throw "Error setting the browser view as default: Netric server is offline.";
        }
    }
}

module.exports = browserViewSaver;