/**
 * @fileoverview Default actions
 */

import ActionModes from './actionModes';
import entitySaver from '../saver';
import DefaultActions from './DefaultActions';
import netric from '../../base';
import log from '../../log';
import controller from '../../controller/controller';
import Controls from '../../components/Controls.jsx';

// Icons
let AccessTimeIcon = Controls.Icons.AccessTimeIcon;
let DeleteIcon = Controls.Icons.DeleteIcon;
let EditIcon = Controls.Icons.EditIcon;
let PrintIcon = Controls.Icons.PrintIcon;

/**
 * This is the base/default actions class that all other object types will inherit
 */
var TaskActions = function() {

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
netric.inherits(TaskActions, DefaultActions);

/**
 * Default actions when in view mode
 *
 * @protected
 * @type {Array}
 */
TaskActions.prototype.defaultViewActions = [
    { name: "edit", title: "Edit", icon: EditIcon },
    { name: "remove", title: "Delete", icon: DeleteIcon },
    { name: "print", title: "Print", icon: PrintIcon },
    { name: "addtime", title: "Add Time", icon: AccessTimeIcon },
];

/**
 * Add time entity action
 *
 * @param {string} objType The type of object to perform the action on
 * @param {int[]} selectedEntities The entities to perform the action on
 * @param {function} finishedFunction A funciton to call when finished
 * @return {string} Working text like "Deleting" or "Saving"
 */
TaskActions.prototype.addtime = function(objType, selectedEntities, finishedFunction) {

    log.notice("Action called: addtime");

    let taskId = selectedEntities[0];

    let EntityController = require("../../controller/EntityController");
    let timeEntity = new EntityController();
    timeEntity.load({
        objType: "time",
        type: controller.types.DIALOG,
        title: "Add Time",
        entityData: {
            task_id: taskId,
            owner_id: {key: "-3", value: "Me"},
            creator_id: {key: "-3", value: "Me"}
        },
        onSave: function(timeEntity) {
            finishedFunction(false, "Time Added");
        }
    });

    /*
    entitySaver.remove(objType, selectedEntities, function(removedIds) {
        finishedFunction(false, removedIds.length + " Items Deleted");
    });

    return "Deleting";
    */

    // We do not want any working text since this displays a dialog
    return null;
}

module.exports = TaskActions;
