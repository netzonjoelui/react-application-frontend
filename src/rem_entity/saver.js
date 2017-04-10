/**
 * @fileOverview Entity saver
 *
 * @author:    Sky Stebnicki, sky.stebnicki@aereus.com;
 *            Copyright (c) 2015 Aereus Corporation. All rights reserved.
 */
'use strict';

import definitionLoader from "./definitionLoader";
import BackendRequest from "../BackendRequest";
import Entity from "./Entity";
import netric from "../base";
import log from "../log";

var saver = {

    /**
     * Save an entity
     *
     * @param {netric\entity\Entity} entity The entity to save
     * @param {function} opt_finishedCallback Optional callback to call when saved
     */
    save: function (entity, opt_finishedCallback) {

        if (!entity) {
            throw "entity/saver/save: First param must be an entity";
        }

        // Get data object from the entity properties
        let data = entity.getData();

        // Create a reference to this for tricky callbacks
        let saverObj = this;

        // Let's assume that the server is already online.
        let serverOnline = true;

        // If netric is defined, then let's get the actual status of the server
        if (typeof netric !== "undefined") {
            serverOnline = netric.server.online;
        }

        // If we are connected
        if (serverOnline) {

            // Save the data remotely
            BackendRequest.send("svr/entity/save", function (resp) {

                // First check to see if there was an error
                if (resp.error) {
                    throw "Error saving entity: " + resp.error;
                }

                // Update the data in the original entity
                entity.loadData(resp);

                // Save locally (no callback because we don't care if it fails)
                saverObj.saveLocal(entity);

                // Invoke callback if set
                if (opt_finishedCallback) {
                    opt_finishedCallback(resp);
                }

            }, 'POST', JSON.stringify(data));

        } else {
            // TODO: Save the data locally into an "outbox"
            // to be saved on the next connection
        }
    },

    /**
     * Save an entity
     *
     * @param {netric\entity\Entity} entity The entity to save
     * @param {function} opt_finishedCallback Optional callback to call when saved
     */
    saveLocal: function (entity, opt_finishedCallback) {

        // TODO: save locally

    },

    /**
     * Delete an entity
     *
     * @param {string} objType The type of entity we are deleting
     * @param {string[]} iDs The id or ids of entities we are deleting
     * @param {function} opt_finishedCallback Optional callback to call when deleted
     */
    remove: function (objType, iDs, opt_finishedCallback) {

        if (!objType) {
            throw "entity/saver/remove: First param must be an object type";
        }

        if (!iDs) {
            throw "entity/saver/remove: Second param must be an entity id or array if IDs";
        }

        // Setup request properties
        let data = {obj_type: objType, id: iDs};

        // Create a reference to this for tricky callbacks
        let saverObj = this;

        // Let's assume that the server is already online.
        let serverOnline = true;

        // If netric is defined, then let's get the actual status of the server
        if (typeof netric !== "undefined") {
            serverOnline = netric.server.online;
        }

        // If we are connected
        if (serverOnline) {
            // Save the data remotely
            BackendRequest.send("svr/entity/remove", function (resp) {

                // First check to see if there was an error
                if (resp.error) {
                    throw "Error removing entity: " + resp.error;
                }

                // Remove all IDs locally
                for (let i in resp) {
                    saverObj.removeLocal(objType, resp[i]);
                }

                // Invoke callback if set
                if (opt_finishedCallback) {
                    opt_finishedCallback(resp);
                }

            }, 'POST', data);

        } else {
            // TODO: Save the data locally into an "outbox"
            // to be deleted on the next connection
        }
    },

    /**
     * Queue an entity locally for removal
     *
     * @param {string} objType The type of entity we are deleting
     * @param {string[]} iDs The id or ids of entities we are deleting
     * @param {function} opt_finishedCallback Optional callback to call when deleted
     */
    removeLocal: function (objType, iDs, opt_finishedCallback) {

        // TODO: remove locally
    },

    /**
     * Edit action for entities
     *
     * @param {string} objType The type of entity we are deleting
     * @param {string[]} iDs The id or ids of entities we are editing
     * @param {string[]} entityData Contains the entity fields and values that will be used to update the entities
     * @param {function} opt_finishedCallback Optional callback to call when deleted
     */
    edit: function (objType, iDs, entityData, opt_finishedCallback) {
        if (!objType) {
            throw "entity/saver/edit: First param must be an object type";
        }

        if (!iDs) {
            throw "entity/saver/edit: Second param must be an entity id or array if IDs";
        }

        // Setup request properties
        let data = {
            obj_type: objType,
            id: iDs,
            entity_data: entityData
        };

        // Create a reference to this for tricky callbacks
        let saverObj = this;

        // Let's assume that the server is already online.
        let serverOnline = true;

        // If netric is defined, then let's get the actual status of the server
        if (typeof netric !== "undefined") {
            serverOnline = netric.server.online;
        }

        // If we are connected
        if (serverOnline) {
            // Save the data remotely
            BackendRequest.send("svr/entity/massEdit", function (resp) {

                // First check to see if there was an error
                if (resp.error) {
                    log.error("Error while saving the changes for mass edit. ObjType: " + objType
                        + ". Selected Entities:  " + iDs.join()
                        + ". Error Message: " + resp.error);
                }

                // Invoke callback if set
                if (opt_finishedCallback) {
                    opt_finishedCallback(resp);
                }

            }, 'POST', JSON.stringify(data));

        } else {
            // TODO: Save the data locally into an "outbox"
            // to be saved on the next connection
        }
    },

    /**
     * Merge action for entities
     *
     * @param {string} objType The type of entity we are deleting
     * @param {string[]} entityData Contains the entity fields and values that will be used to merge the entities
     * @param {function} opt_finishedCallback Optional callback to call when deleted
     */
    merge: function (objType, entityData, opt_finishedCallback) {
        if (!objType) {
            throw "entity/saver/merge: First param must be an object type";
        }

        // Setup request properties
        let data = {
            obj_type: objType,
            merge_data: entityData
        };

        // Create a reference to this for tricky callbacks
        let saverObj = this;

        // Let's assume that the server is already online.
        let serverOnline = true;

        // If netric is defined, then let's get the actual status of the server
        if (typeof netric !== "undefined") {
            serverOnline = netric.server.online;
        }

        // If we are connected
        if (serverOnline) {
            // Save the data remotely
            BackendRequest.send("svr/entity/mergeEntities", function (resp) {

                // First check to see if there was an error
                if (resp.error) {
                    log.error("Error while saving the changes for mass edit. ObjType: " + objType
                        + ". Error Message: " + resp.error);
                }

                // Invoke callback if set
                if (opt_finishedCallback) {
                    opt_finishedCallback(resp);
                }

            }, 'POST', JSON.stringify(data));

        } else {
            let errorMsg = "Cannot connect to the server. You need to be online to merge entities";
            log.error(errorMsg);

            if (opt_finishedCallback) {
                opt_finishedCallback({error: errorMsg});
            }
        }
    },

    /**
     * Save action for entity group
     *
     * @param {string} action This will determine what type of action we will be executing.
     *                        Expected values are (add, edit, delete)
     * @param {object} groupings The groupings where we will save the group model
     * @param {entity/definition/Group} group The group model that will be saved
     * @param {function} opt_finishedCallback Optional callback to call when deleted
     */
    saveGroup: function (action, groupings, group, opt_finishedCallback) {
        if (!groupings.objType) {
            throw "entity/saver/saveGroup: Groupings must have an object type";
        }

        // Get the group data
        let data = group.getData();

        // Setup the object type of the group
        data['obj_type'] = groupings.objType;
        data['field_name'] = groupings.fieldName;
        data['filter'] = groupings.filter;
        data['action'] = action;

        // Create a reference to this for tricky callbacks
        let saverObj = this;

        // Let's assume that the server is already online.
        let serverOnline = true;

        // If netric is defined, then let's get the actual status of the server
        if (typeof netric !== "undefined") {
            serverOnline = netric.server.online;
        }

        // If we are connected
        if (serverOnline) {
            // Save the data remotely
            BackendRequest.send("svr/entity/saveGroup", function (resp) {

                // First check to see if there was an error
                if (resp.error) {
                    log.error("Error while saving the group: " + group.name + resp.error);
                }

                // Invoke callback if set
                if (opt_finishedCallback) {
                    opt_finishedCallback(resp);
                }

            }, 'POST', JSON.stringify(data));

        } else {
            let errorMsg = "Cannot connect to the server. You need to be online to save groups";
            log.error(errorMsg);

            if (opt_finishedCallback) {
                opt_finishedCallback({error: errorMsg});
            }
        }
    }
}

module.exports = saver;
