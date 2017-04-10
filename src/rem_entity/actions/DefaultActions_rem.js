/**
 * @fileoverview Default actions
 */

import ActionModes from './actionModes';
import entitySaver from '../saver';
import controller from '../../controller/controller';
import events from '../../util/events';
import Controls from '../../components/Controls.jsx';

// Icons
let BorderColorIcon = Controls.Icons.BorderColorIcon;
let CheckIcon = Controls.Icons.CheckIcon;
let DeleteIcon = Controls.Icons.DeleteIcon;
let EditIcon = Controls.Icons.EditIcon;
let PrintIcon = Controls.Icons.PrintIcon;
let TransformIcon = Controls.Icons.TransformIcon;

/**
 * This is the base/default actions class that all other object types will inherit
 */
var DefaultActions = function() {

	/**
	 * Optional setup local confirm messages
	 *
	 * @type {Object}
	 */
	this.confirmMessages = {};
}

/**
 * Example of any derrived classes extending this
 */
//netric.inherits(TaskActions, DefaultActions);

/**
 * Default actions when in browse mode
 *
 * @protected
 * @type {Array}
 */
DefaultActions.prototype.defaultBrowseActions = [
	{ name: "mergeEntities", title: "Merge Entities", icon: TransformIcon, minimunEntities: 2},
	{ name: "massEdit", title: "Mass Edit", icon: BorderColorIcon },
	{ name: "remove", title: "Delete", icon: DeleteIcon },
];

/**
 * Default actions when in view mode
 *
 * @protected
 * @type {Array}
 */
DefaultActions.prototype.defaultViewActions = [
	{ name: "edit", title: "Edit", icon: EditIcon },
	{ name: "remove", title: "Delete", icon: DeleteIcon },
	{ name: "print", title: "Print", icon: PrintIcon }
];

/**
 * Default actions when in edit mode
 *
 * @protected
 * @type {Array}
 */
DefaultActions.prototype.defaultEditActions = [
	{ name: "save", title: "Save", icon: CheckIcon }
];

/**
 * Get available actions depending on whether or not we have selected entities
 *
 * The first action is always assumed to be the PRIMARY action and will be given
 * visual precedence on all devices.
 *
 * @param {int[]} selectedEntities Array of selected entity IDs
 * @return {Array} TODO: Define
 */
DefaultActions.prototype.getActions = function(mode, selectedEntities) {

	let numSelected = (typeof selectedEntities != "undefined") ? selectedEntities.length : 0;
	
	// We return an array of actions filtered based on the mode
	let retActions = new Array();

	switch (mode) {
		case ActionModes.BROWSE:

			let actions = new Array();
			actions = this.defaultBrowseActions;

			// Let's loop the actions and check if there are any conditions needed to meet
			for (let idx in actions) {
				let action = actions[idx];

				// We need to evaluate if an action has a minimum selected entities required
				if(action.minimunEntities && numSelected < action.minimunEntities) {
					continue;
				}

				retActions.push(action);
			}
			break;
		case ActionModes.VIEW:
			retActions = this.defaultViewActions;
			break;
		case ActionModes.EDIT:
			retActions = this.defaultEditActions;
			break;
		default:
			// TODO: Return nothing and log an error
			break;
	}

	return retActions;
}

/**
 * Check to see if we need to prompt the user for a confirmation before perfomring action
 *
 * @param {string} actionName
 * @param {array} selectedEntities
 */
DefaultActions.prototype.getConfirmMessage = function(actionName, selectedEntities) {
	let messages = this.confirmMessages || {};
	return (messages[actionName]) ? messages[actionName] : null;
}

/**
 * Perform an action on the selected entities
 *
 * @param {string} actionName The unique name of the action to perform
 * @param {string} objType The type of object we re performing actions on
 * @param {int[]} selectedEntities The entities to perform the action on
 * @param {function} finishedFunction A funciton to call when finished
 * @return {string} Working text like "Deleting" or "Saving"
 */
DefaultActions.prototype.performAction = function(actionName, objType, selectedEntities, finishedFunction) {

	if (typeof finishedFunction === "undefined") {
		finishedFunction = function() {};
	}

	// Check to see if the handler exists
	if (typeof this[actionName] === "function") {
		var funct = this[actionName];
		return funct(objType, selectedEntities, finishedFunction);
	} else {
		throw "Action function " + actionName + " not defined";
	}

	/*
	file
		upload: file upload dialog
		move: folder open dialog

	folder
		move: folder open dialog

	email:
		reply: open compose window
		replyAll: open compose window
		forward: open compose window

	email_thread
		addToGroup: add a value to multivalue & save

	customer:
		followUp: open follow-up window
	*/

	/*
	TODO:
	Figure out how to deal with actions that require input and/or a dialog like uploading files
	or replying to an email.

	RETURN:
		error: bool
		message: string

	*/
}

/**
 * Entity delete action
 *
 * @param {string} objType The type of object to perform the action on
 * @param {int[]} selectedEntities The entities to perform the action on
 * @param {function} finishedFunction A funciton to call when finished
 * @return {string} Working text like "Deleting" or "Saving"
 */
DefaultActions.prototype.remove = function(objType, selectedEntities, finishedFunction) {

	entitySaver.remove(objType, selectedEntities, function(removedIds) {
		finishedFunction(false, removedIds.length + " Items Deleted");
	});

	return "Deleting";
}

/**
 * Entity delete action
 *
 * @param {string} objType The type of object to perform the action on
 * @param {int[]} selectedEntities The entities to perform the action on
 * @param {function} finishedFunction A funciton to call when finished
 * @return {string} Working text like "Deleting" or "Saving"
 */
DefaultActions.prototype.print = function(objType, selectedEntities, finishedFunction) {

    log.notice("Printing " + selectedEntities.length + " " + objType);

    // TODO: still not implemented

    return "";
}

/**
 * Entity mass edit action
 *
 * @param {string} objType The type of object to perform the action on
 * @param {int[]} selectedEntities The entities to perform the action on
 * @param {function} finishedFunction A funciton to call when finished
 * @return {string} Working text like "Deleting" or "Saving"
 */
DefaultActions.prototype.massEdit = function(objType, selectedEntities, finishedFunction) {

	let MassEditController = require("../../controller/MassEditController");
	let massEdit = new MassEditController();

	massEdit.load({
		type: controller.types.DIALOG,
		objType: objType,
		title: "Mass Edit",
		selectedEntities: selectedEntities,
		onFinishedAction: function () {
			finishedFunction(false, selectedEntities.length + " Items edited");
		}
	});
}

/**
 * Entity merge action
 *
 * @param {string} objType The type of object to perform the action on
 * @param {int[]} selectedEntities The entities to perform the action on
 * @param {function} finishedFunction A funciton to call when finished
 * @return {string} Working text like "Deleting" or "Saving"
 */
DefaultActions.prototype.mergeEntities = function(objType, selectedEntities, finishedFunction) {

	let EntityMergeController = require("../../controller/EntityMergeController");
	let EntityMerge = new EntityMergeController();

	EntityMerge.load({
		type: controller.types.DIALOG,
		objType: objType,
		title: "Entity Merge",
		selectedEntities: selectedEntities,
		onFinishedAction: function () {
			finishedFunction(false, selectedEntities.length + " Items edited");
		}
	});
}

module.exports = DefaultActions;
