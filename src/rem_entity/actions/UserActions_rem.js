/**
 * @fileoverview Actions for User
 */

import ActionModes from './actionModes';
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
 * This is the user actions class that will display edit, remove, print and change password
 */
var UserActions = function () {

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
netric.inherits(UserActions, DefaultActions);

/**
 * Default actions when in view mode
 *
 * @protected
 * @type {Array}
 */
UserActions.prototype.defaultViewActions = [
    {name: "edit", title: "Edit", icon: EditIcon},
    {name: "changePassword", title: "Change Password", icon: SwapHorizIcon},
    {name: "remove", title: "Delete", icon: DeleteIcon},
    {name: "print", title: "Print", icon: PrintIcon},
];

/**
 * Action that will enable the change the password
 *
 * @param {string} objType The type of object to perform the action on
 * @param {int[]} selectedEntities The entities to perform the action on
 * @param {function} finishedFunction A funciton to call when finished
 * @return {string} Working text like "Deleting" or "Saving"
 */
UserActions.prototype.changePassword = function (objType, selectedEntities, finishedFunction) {

    var userId = selectedEntities[0];

    var EntityPluginController = require("../../controller/EntityPluginController");
    var entityPlugin = new EntityPluginController();

    entityPlugin.load({
        type: controller.types.DIALOG,
        pluginName: "user.ChangePassword",
        objType: "user",
        title: "Change Password",
        eid: userId,
        onFinishedAction: function () {
            finishedFunction(false, "Password was successfully changed.");
        }
    });

    // We do not want any working text since this displays a dialog
    return null;
}

module.exports = UserActions;
