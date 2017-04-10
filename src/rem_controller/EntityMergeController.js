/**
 * @fileoverview Plugin Controller
 *
 * Manages the displaying of merge entity
 */
'use strict';

import React from "react";
import ReactDOM from "react-dom";
import netric from "../base";
import controller from "./controller";
import entitySaver from "../entity/saver";
import UiEntityMerge from "../ui/EntityMerge.jsx";
import AbstractController from "./AbstractController";
import definitionLoader from '../entity/definitionLoader';
import log from "../log";
import events from "../util/events";

/**
 * Controller that loads the entity merge component
 */
var EntityMergeController = function () {
}

/**
 * Extend base controller class
 */
netric.inherits(EntityMergeController, AbstractController);

/**
 * Handle to root ReactElement where the UI is rendered
 *
 * @private
 * @type {ReactElement}
 */
EntityMergeController.prototype._rootReactNode = null;

/**
 * Object used for handling custom events through the entity form
 *
 * @private
 * @type {Object}
 */
EntityMergeController.prototype._eventsObj = null;

/**
 * The entity definition of the object
 *
 * @private
 * @type {Object}
 */
EntityMergeController.prototype._entityDefinition = null;

/**
 * Function called when controller is first loaded but before the dom ready to render
 *
 * @param {function} opt_callback If set call this function when we are finished loading
 */
EntityMergeController.prototype.onLoad = function (opt_callback) {

    this._eventsObj = {};

    if (this.getType() == controller.types.DIALOG) {

        // Setup the dialog button actions for mass edit ui
        this.props.dialogActions = [
            {
                text: 'Merge',
                onClick: function () {
                    events.triggerEvent(this._eventsObj, 'mergeEntities', {});
                }.bind(this)
            },
            {
                text: 'Cancel',
                onClick: function () {
                    this.close();
                }.bind(this)
            }
        ];
    }

    // After the initial render, let's load the data need for merging
    definitionLoader.get(this.props.objType, function (def) {

        // Assign the entity defintion to the class variable
        this._entityDefinition = def;

        this._snackBarMessage = "";
        this.render();
    }.bind(this));

    let callbackWhenLoaded = opt_callback || null;
    if (callbackWhenLoaded) {
        callbackWhenLoaded();
    }
}

/**
 * Render this controller into the dom tree
 */
EntityMergeController.prototype.render = function () {

    // Set outer application container
    let domCon = this.domNode_;
    let showAppBar = (this.getType() == controller.types.PAGE);

    // Define the data
    let data = {
        title: this.props.title || "",
        objType: this.props.objType,
        eventsObj: this._eventsObj,
        entityDefinition: this._entityDefinition,
        selectedEntities: this.props.selectedEntities,
        snackBarMessage: this._snackBarMessage,
        showAppBar: showAppBar,
        onMerge: function (data) {
            this.merge(data);
        }.bind(this),
        onNavBtnClick: function (evt) {
            this.close();
        }.bind(this)
    }

    // Render browser component
    try {
        this._rootReactNode = ReactDOM.render(
            React.createElement(UiEntityMerge, data),
            domCon
        );
    } catch (e) {
        log.error("Could not render mass edit ui." + e);
    }
}

/**
 * Execute the merging of the selected entities
 *
 * @param {array} data Contains the field data of entities that will be merged
 *  data {
 *      customer: 1,
 *      customer_fval: 'test customer'
 *  }
 */
EntityMergeController.prototype.merge = function (data) {

    // Call the entitySaver::merge() to merge the entities
    entitySaver.merge(this.props.objType, data, function (response) {

        if (response.error) {
            this._snackBarMessage = "Error saving the changes. " + response.error;
            this.render();
        } else {
            if (this.props.onFinishedAction) {
                this.props.onFinishedAction();
            }

            // After a successful save, then let's close the mass edit ui
            this.close();
        }
    }.bind(this));
}

module.exports = EntityMergeController;

