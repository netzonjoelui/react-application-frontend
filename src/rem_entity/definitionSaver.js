/**
 * @fileOverview Definition Saver
 *
 * @author:    Marl Tumulak, marl.tumulak@aereus.com;
 *            Copyright (c) 2016 Aereus Corporation. All rights reserved.
 */
'use strict';

var BackendRequest = require("../BackendRequest");
var definitionLoader = require("./definitionLoader");
var nertic = require("../base");
var log = require("../log");

/**
 * Entity definition Saver
 */
var definitionSaver = {};

/**
 * Save a field definition
 *
 * @param {object} entityDefinition The entity definition that will be updated
 * @param {function} opt_finishedCallback Optional callback to call when saved
 */
definitionSaver.update = function (entityDefinition, opt_finishedCallback) {

    if (!entityDefinition) {
        throw "entity/definitionSaver/save: Entity definition must be provided";
    }

    let defData = entityDefinition.getData();

    // If we are connected
    if (netric.server.online) {
        // Save the data remotely
        BackendRequest.send("svr/entity/updateEntityDef", function (resp) {

            // First check to see if there was an error
            if (resp.error) {
                throw "Error saving entity definition field: " + resp.error;
            }

            // Update the definition cache
            let def = definitionLoader.updateDefinition(resp);

            // Invoke callback if set
            if (opt_finishedCallback) {
                opt_finishedCallback(def);
            }

        }, 'POST', JSON.stringify(defData));

    } else {
        throw "Error saving entity definition field: Netric server is offline.";
    }
}

module.exports = definitionSaver;