/**
 * @fileoverview Actions for Customer
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
let MoreVertIcon = Controls.Icons.MoreVertIcon;
let PrintIcon = Controls.Icons.PrintIcon;

/**
 * This is the customer actions class that will display edit, remove, print and followup customer action buttons
 */
var CustomerActions = function () {

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
netric.inherits(CustomerActions, DefaultActions);

/**
 * Default actions when in view mode
 *
 * @protected
 * @type {Array}
 */
CustomerActions.prototype.defaultViewActions = [
    {name: "edit", title: "Edit", icon: EditIcon},
    {name: "remove", title: "Delete", icon: DeleteIcon},
    {name: "print", title: "Print", icon: PrintIcon},
    {name: "followup", title: "Follow-Up", icon: MoreVertIcon},
];

/**
 * Action that will enable the user to follow up with a customer
 *
 * @param {string} objType The type of object to perform the action on
 * @param {int[]} selectedEntities The entities to perform the action on
 * @param {function} finishedFunction A funciton to call when finished
 * @return {string} Working text like "Deleting" or "Saving"
 */
CustomerActions.prototype.followup = function (objType, selectedEntities, finishedFunction) {

    if (selectedEntities.length > 1) {
        throw "Can only convert one customer entity at a time.";
    }

    let customerId = selectedEntities[0];

    let EntityPluginController = require("../../controller/EntityPluginController");
    let entityPlugin = new EntityPluginController();


    entityPlugin.load({
        type: controller.types.DIALOG,
        title: "Follow-up Customer",
        pluginName: "global.Followup",
        objType: "customer",
        eid: customerId,
        onFinishedAction: function () {
            finishedFunction(false, "Follow-up action created");
        }
    });

    // We do not want any working text since this displays a dialog
    return null;
}

module.exports = CustomerActions;
