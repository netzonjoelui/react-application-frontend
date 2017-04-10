/**
 * @fileoverview Recurrence Controller
 *
 * Manages the the processing of the recurrence pattern
 */
'use strict';

import React from 'react';
var ReactDOM = require("react-dom");
var netric = require("../base");
var controller = require("./controller");
var AbstractController = require("./AbstractController");
var UiRecurrence = require("../ui/recurrence/Recurrence.jsx");

/**
 * Controller that loads a File Upload Component
 */
var RecurrenceController = function () {
}

/**
 * Extend base controller class
 */
netric.inherits(RecurrenceController, AbstractController);

/**
 * Handle to root ReactElement where the UI is rendered
 *
 * @private
 * @type {ReactElement}
 */
RecurrenceController.prototype._rootReactNode = null;

/**
 * Flag that will determine if we will be saving the recurrence pattern
 *
 * @private
 * @type {bool}
 */
RecurrenceController.prototype._saveRecurrence = false;

/**
 * Function called when controller is first loaded but before the dom ready to render
 *
 * @param {function} opt_callback If set call this function when we are finished loading
 */
RecurrenceController.prototype.onLoad = function (opt_callback) {

    var callbackWhenLoaded = opt_callback || null;

    if (this.getType() == controller.types.DIALOG) {
        this.props.dialogActions = [
            {
                text: 'Save',
                onClick: function() {
                    this._saveRecurrence = true;
                    this.render();
                }.bind(this)
            },
            {
                text: 'Cancel',
                onClick: function() { this.close(); }.bind(this)
            }
        ];
    }


    if (callbackWhenLoaded) {
        callbackWhenLoaded();
    } else {
        this.render();
    }
}

/**
 * Render this controller into the dom tree
 */
RecurrenceController.prototype.render = function () {

    // Set outer application container
    var domCon = this.domNode_;

    // Unhide toolbars if we are in a page mode
    var hideToolbar = this.props.hideToolbar || true;
    if (this.getType() === controller.types.PAGE) {
        hideToolbar = false;
    }

    // Define the data
    var data = {
        title: this.props.title || "Recurrence",
        recurrencePattern: this.props.recurrencePattern,
        saveRecurrence: this._saveRecurrence,
        hideToolbar: hideToolbar,
        onNavBtnClick: function (evt) {
            this.close();
        }.bind(this),
        onSave: function (data) {
            this._handleSave(data);
        }.bind(this)
    }

    // Render browser component
    this._rootReactNode = ReactDOM.render(
        React.createElement(UiRecurrence, data),
        domCon
    );

    // Alway reset the saveRecurrence to false
    this._saveRecurrence = false;
}

/**
 * Render this controller into the dom tree
 *
 * @param {object} data     The pattern data that will be saved
 * @private
 */
RecurrenceController.prototype._handleSave = function (data) {
    var humanDesc = this.props.recurrencePattern.getHumanDesc(data);

    if (this.props.onSetRecurrence) this.props.onSetRecurrence(data, humanDesc);
}

module.exports = RecurrenceController;

