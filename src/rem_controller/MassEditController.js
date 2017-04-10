/**
 * @fileoverview Mass Edit Controller
 *
 * Manages the displaying of mass edit for entities
 */
'use strict';

import React from "react";
import ReactDOM from "react-dom";
import netric from "../base";
import controller from "./controller";
import entitySaver from "../entity/saver";
import UiMassEdit from "../ui/MassEdit.jsx";
import AbstractController from "./AbstractController";
import log from "../log";
import events from "../util/events";

/**
 * Controller that loads the mass edit component
 */
var MassEditController = function () {
}

/**
 * Extend base controller class
 */
netric.inherits(MassEditController, AbstractController);

/**
 * Handle to root ReactElement where the UI is rendered
 *
 * @private
 * @type {ReactElement}
 */
MassEditController.prototype._rootReactNode = null;

/**
 * Object used for handling custom events through the entity form
 *
 * @private
 * @type {Object}
 */
MassEditController.prototype._eventsObj = null;

/**
 * This will contain the message that will be displayed in the app bar in Mass Edit Ui
 *
 * @private
 * @type {String}
 */
MassEditController.prototype._snackBarMessage = null;

/**
 * Function called when controller is first loaded but before the dom ready to render
 *
 * @param {function} opt_callback If set call this function when we are finished loading
 */
MassEditController.prototype.onLoad = function (opt_callback) {

    let callbackWhenLoaded = opt_callback || null;

    this._eventsObj = {};

    if (this.getType() == controller.types.DIALOG) {

        // Setup the dialog button actions for mass edit ui
        this.props.dialogActions = [
            {
                text: 'Save',
                onClick: function () {
                    events.triggerEvent(this._eventsObj, 'saveMassEdit', {});
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

    this.render();

    if (callbackWhenLoaded) {
        callbackWhenLoaded();
    }
}

/**
 * Render this controller into the dom tree
 */
MassEditController.prototype.render = function () {

    // Set outer application container
    let domCon = this.domNode_;
    let showAppBar = (this.getType() == controller.types.PAGE);

    // Define the data
    let data = {
        title: this.props.title || "",
        objType: this.props.objType,
        eventsObj: this._eventsObj,
        showAppBar: showAppBar,
        snackBarMessage: this._snackBarMessage,
        onSave: function (data) {
            this.save(data);
        }.bind(this),
        onNavBtnClick: function (evt) {
            this.close();
        }.bind(this)
    }

    // Render browser component
    try {
        this._rootReactNode = ReactDOM.render(
            React.createElement(UiMassEdit, data),
            domCon
        );
    } catch (e) {
        log.error("Could not render mass edit ui." + e);
    }

    // Always reset the appBarMessage after rendering
    this._snackBarMessage = '';
}

/**
 * Commit the changes to the selected entities
 *
 * @param {array} data Contains the field details that will be used to update selected entities
 *  data {
 *      customer: 1,
 *      customer_fval: 'test customer'
 *  }
 */
MassEditController.prototype.save = function (data) {

    // Call the entitySaver::edit() to save the changes
    entitySaver.edit(this.props.objType, this.props.selectedEntities, data, function (response) {

        if(response.error) {
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

module.exports = MassEditController;
