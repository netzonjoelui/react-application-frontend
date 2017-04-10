/**
 * @fileoverview Actions for Opportunity
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
let StreetViewIcon = Controls.Icons.StreetViewIcon;

/**
 * This is the opportunity actions class that will display edit, remove, print and follow-up on opportunity action buttons
 */
var OpportunityActions = function () {

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
netric.inherits(OpportunityActions, DefaultActions);

/**
 * Default actions when in view mode
 *
 * @protected
 * @type {Array}
 */
OpportunityActions.prototype.defaultViewActions = [
    {name: "edit", title: "Edit", icon: EditIcon},
    {name: "remove", title: "Delete", icon: DeleteIcon},
    {name: "print", title: "Print", icon: PrintIcon},
    {name: "followup", title: "Follow-Up", icon: StreetViewIcon},
];

/**
 * Action that will enable the user to followup on an opportunity
 *
 * @param {string} objType The type of object to perform the action on
 * @param {int[]} selectedEntities The entities to perform the action on
 * @param {function} finishedFunction A funciton to call when finished
 * @return {string} Working text like "Deleting" or "Saving"
 */
OpportunityActions.prototype.followup = function (objType, selectedEntities, finishedFunction) {

    if (selectedEntities.length > 1) {
        throw "Can only convert one opportunity entity at a time.";
    }

    let opportunityId = selectedEntities[0];

    let EntityPluginController = require("../../controller/EntityPluginController");
    let entityPlugin = new EntityPluginController();


    entityPlugin.load({
        type: controller.types.DIALOG,
        title: "Follow-up Opportunity",
        pluginName: "global.Followup",
        objType: "opportunity",
        eid: opportunityId,
        onFinishedAction: function (postAction) {
            finishedFunction(false, "Follow-up action created");
        }
    });

    // We do not want any working text since this displays a dialog
    return null;
}

module.exports = OpportunityActions;
