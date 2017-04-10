/**
 * @fileoverview Actions for Lead
 */

import ActionModes from './actionModes';
import entitySaver from '../saver';
import DefaultActions from './DefaultActions';
import netric from '../../base';
import log from '../../log';
import controller from '../../controller/controller';
import Controls from '../../components/Controls.jsx';

// Icons
let DeleteIcon = Controls.Icons.DeleteIcon;
let EditIcon = Controls.Icons.EditIcon;
let PrintIcon = Controls.Icons.PrintIcon;
let SwapHorizIcon = Controls.Icons.SwapHorizIcon;

/**
 * This is the lead actions class that will display edit, remove, print and convert lead action buttons
 */
var LeadActions = function () {

    /**
     * Optional setup local confirm messages
     *
     * @type {Object}
     */
    this.confirmMessages = {};
}

/**
 * Extend base actions class
 */
netric.inherits(LeadActions, DefaultActions);

/**
 * Default actions when in view mode
 *
 * @protected
 * @type {Array}
 */
LeadActions.prototype.defaultViewActions = [
    {name: "edit", title: "Edit", icon: EditIcon},
    {name: "remove", title: "Delete", icon: DeleteIcon},
    {name: "print", title: "Print", icon: PrintIcon},
    {name: "convertlead", title: "Convert Lead", icon: SwapHorizIcon, showif: "f_converted=0"},
];

/**
 * Action that will enable the user to convert a lead
 *
 * @param {string} objType The type of object to perform the action on
 * @param {int[]} selectedEntities The entities to perform the action on
 * @param {function} finishedFunction A funciton to call when finished
 * @return {string} Working text like "Deleting" or "Saving"
 */
LeadActions.prototype.convertlead = function (objType, selectedEntities, finishedFunction) {

    if (selectedEntities.length > 1) {
        throw "Can only convert one lead entity at a time.";
    }

    let leadId = selectedEntities[0];

    let EntityPluginController = require("../../controller/EntityPluginController");
    let entityPlugin = new EntityPluginController();
    

    entityPlugin.load({
        type: controller.types.DIALOG,
        pluginName: "lead.Convert",
        objType: "lead",
        title: "Convert Lead",
        eid: leadId,
        onFinishedAction: function () {
            finishedFunction(false, "Lead Converted");
        }
    });

    // We do not want any working text since this displays a dialog
    return null;
}

module.exports = LeadActions;
