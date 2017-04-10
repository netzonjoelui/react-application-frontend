/**
 * @fileoverview Plugin Controller
 *
 * Manages the displaying of plugins outside of entity form
 */
'use strict';

import React from 'react';
var ReactDOM = require("react-dom");
var netric = require("../base");
var controller = require("./controller");
var entityLoader = require("../entity/loader");
var entitySaver = require("../entity/saver");
var plugins = require("../entity/plugins");
var AbstractController = require("./AbstractController");
var log = require("../log");

/**
 * Controller that loads a File Upload Component
 */
var EntityPluginController = function () {
}

/**
 * Extend base controller class
 */
netric.inherits(EntityPluginController, AbstractController);

/**
 * Handle to root ReactElement where the UI is rendered
 *
 * @private
 * @type {ReactElement}
 */
EntityPluginController.prototype._rootReactNode = null;

/**
 * The entity we are editing
 *
 * @private
 * @type {netric.entity.Entity}
 */
EntityPluginController.prototype._entity = null;

/**
 * Function called when controller is first loaded but before the dom ready to render
 *
 * @param {function} opt_callback If set call this function when we are finished loading
 */
EntityPluginController.prototype.onLoad = function (opt_callback) {

    var callbackWhenLoaded = opt_callback || null;

    // Now load the entity if set
    if (this.props.eid) {

        // Load the entity and get a promised entity back
        this._entity = this._loadEntity(this.props.objType, this.props.eid);

        // Listen for initial load to re-render this entity
        alib.events.listen(this._entity, "load", function (evt) {

            // Re-render
            this.render();
        }.bind(this));

    } else {

        // Setup an empty entity
        this._entity = this._createEntity(this.props.objType);

        // Since we are creating a new entity, let's set the default values
        this._entity.setDefaultValues("null", this.props);
    }

    if (callbackWhenLoaded) {
        callbackWhenLoaded();
    }
}

/**
 * Render this controller into the dom tree
 */
EntityPluginController.prototype.render = function () {

    if (!this.props.pluginName) {
        throw "Plugin name is required.";
    }

    // Set outer application container
    var domCon = this.domNode_;

    // Unhide toolbars if we are in a page mode
    var hideToolbar = this.props.hideToolbar || true;
    if (this.getType() === controller.types.PAGE) {
        hideToolbar = false;
    }

    // Define the data
    var data = {
        title: this.props.title || "",
        entity: this._entity,
        hideToolbar: hideToolbar,
        loadEntity: function (objType, eid, opt_callback) {
            return this._loadEntity(objType, eid, opt_callback);
        }.bind(this),
        createEntity: function (objType) {
            return this._createEntity(objType);
        }.bind(this),
        saveEntity: function (entity, opt_callback) {
            this._saveEntity(entity, opt_callback);
        }.bind(this),
        displayNewEntity: function (data) {
            this._displayNewEntity(data);
        }.bind(this),
        onActionFinished: function () {
            if (this.props.onFinishedAction) {
                this.props.onFinishedAction();
            }
            this.close();
        }.bind(this),
        onNavBtnClick: function (evt) {
            this.close();
        }.bind(this)
    }

    // Loop thru the plugins.List and get the file path of the props.pluginName
    var uiPlugin = netric.getObjectByName(this.props.pluginName, null, plugins.List);

    // Render browser component
    try {
        this._rootReactNode = ReactDOM.render(
            React.createElement(uiPlugin, data),
            domCon
        );
    } catch (e) {
        log.error("Could not create plugin component: " + this.props.pluginName + ":" + e);
    }
}

/**
 * Load the entity using the objType and entity id
 *
 * @param {string} objType The objType of the entity we want to load
 * @param {int} eid The entity id we want to load
 * @param {function} opt_callback Optional callback function that is called once entity is loaded
 * @returns {Entity}
 *
 * @private
 */
EntityPluginController.prototype._loadEntity = function (objType, eid, opt_callback) {

    // Load the entity and get a promised entity back
    return entityLoader.get(objType, eid, opt_callback);
}

/**
 * Create a new entity using the objType specified
 *
 * @param {string} objType The objType of the entity we want to create
 * @returns {Entity}
 *
 * @private
 */
EntityPluginController.prototype._createEntity = function (objType) {

    // Load the entity and get a promised entity back
    return entityLoader.factory(objType);
}

/**
 * Saves the entity
 *
 * @param {Entity} entity The entity that we want to save
 * @param {function} opt_callback Optional callback function that is called once entity is saved
 *
 * @private
 */
EntityPluginController.prototype._saveEntity = function (entity, opt_callback) {

    var callbackWhenLoaded = opt_callback || null;

    entitySaver.save(entity, function (resp) {
        log.info("Saved " + entity.objType + " entity via plugin controller: ", entity.getName());

        if (callbackWhenLoaded) {
            callbackWhenLoaded(resp);
        }
    }.bind(this));
}

/**
 * Function that will display a new entity form using the data provided.
 * This function is used when an ui/entity/plugin/ wants to display a new entity form
 *
 * @param {Object} data Contains the information to display the new entity form
 * data {
 *  objType: customer
 *  params['customer_id']: 1,
 *  params['customer_id_fval']: test customer
 * }
 *
 * @private
 */
EntityPluginController.prototype._displayNewEntity = function (data) {
    var parentConroller = this.getParentControllerFromRouter();

    try {

        // Try to get the controller's eventsObj
        var eventsObj = parentConroller.getEventsObj();

        if(eventsObj) {

            // If we have controller's eventsObj, then we will trigger the event 'entitycreatenew'
            alib.events.triggerEvent(eventsObj, 'entitycreatenew', data);
        } else {
            log.error("The parent controller does not have an eventsObj which is needed to create a new entity");
        }

    } catch (e) {
        log.error("Could not create a new entity: " + e);
    }


}

module.exports = EntityPluginController;

