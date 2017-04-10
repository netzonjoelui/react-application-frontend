/**
 * @fileoverview Grouping Manager Controller
 *
 * Manages the displaying of mass edit for entities
 */

import React from "react";
import ReactDOM from "react-dom";
import netric from "../base";
import controller from "./controller";
import entitySaver from "../entity/saver";
import UiGroupingList from "../ui/groupings/List.jsx";
import UiGroupingManage from "../ui/groupings/Manage.jsx";
import Group from "../entity/definition/Group";
import AbstractController from "./AbstractController";
import groupingLoader from "../entity/groupingLoader";
import log from "../log";
import events from "../util/events";

/**
 * Controller that loads the Grouping Manager
 */
var GroupingManagerController = function () {
}

/**
 * Extend base controller class
 */
netric.inherits(GroupingManagerController, AbstractController);

/**
 * Handle to root ReactElement where the UI is rendered
 *
 * @private
 * @type {ReactElement}
 */
GroupingManagerController.prototype._rootReactNode = null;

/**
 * Object used for handling custom events through the entity form
 *
 * @private
 * @type {Object}
 */
GroupingManagerController.prototype._eventsObj = null;

/**
 * This will contain the message that will be displayed in the app bar in Mass Edit Ui
 *
 * @private
 * @type {String}
 */
GroupingManagerController.prototype._snackBarMessage = null;

/**
 * The collection of groupings that will be displayed as list
 *
 * @private
 * @type {Object}
 */
GroupingManagerController.prototype._groupings = null;

/**
 * Function called when controller is first loaded but before the dom ready to render
 *
 * @param {function} opt_callback If set call this function when we are finished loading
 */
GroupingManagerController.prototype.onLoad = function (opt_callback) {

    let callbackWhenLoaded = opt_callback || null;

    this._eventsObj = this.props.eventsObj || {};

    // Data that will be passed in the sub route
    var subRouteData = {
        type: controller.types.PAGE,
        fieldName: this.props.fieldName,
        objType: this.props.objType,
        eventsObj: this._eventsObj,
        title: "Manage Grouping",
        action: "manage",
        onClose: function () {
            this.close();
        }.bind(this)
    };

    // Set the subroute for adding new grouping
    this.addSubRoute('add', GroupingManagerController, subRouteData);

    events.listen(this._eventsObj, "addGrouping", function (evt) {
        netric.location.go(this.getRoutePath() + "/add");
    }.bind(this));

    // Set the subroute for editing an existing grouping
    this.addSubRoute('edit/:groupingId', GroupingManagerController, subRouteData);

    events.listen(this._eventsObj, "editGrouping", function (evt) {
        netric.location.go(this.getRoutePath() + "/edit/" + evt.data.groupingId);
    }.bind(this));

    // Check first if we have a grouping that is already in the cache
    this._groupings = groupingLoader.getCached(this.props.objType, this.props.fieldName);

    // If the groups is null, then let's get the grouping values
    if (this._groupings.groups === null) {

        // Load the groupings
        this._groupings = groupingLoader.get(this.props.objType, this.props.fieldName, function (groupings) {
            // Do nothing, let the onchange event listener handle freshly loaded groupings
        }.bind(this));
    }

    events.listen(this._eventsObj, "editGrouping", function (evt) {
        netric.location.go(this.getRoutePath() + "/edit/" + evt.data.groupingId);
    }.bind(this));

    events.listen(this._groupings, "change", this.render.bind(this));

    if (callbackWhenLoaded) {
        callbackWhenLoaded();
    }
}

/**
 * Render this controller into the dom tree
 */
GroupingManagerController.prototype.render = function () {

    // Set outer application container
    let domCon = this.domNode_;

    // Define the data
    let data = {
        title: this.props.title || "",
        eventsObj: this._eventsObj,
        groupings: this._groupings,
        snackBarMessage: this._snackBarMessage,
        onNavBtnClick: function (evt) {
            this.close();
        }.bind(this)
    }

    let UiAction = UiGroupingList;
    if (this.props.action === 'manage') {
        UiAction = UiGroupingManage;

        data.group = this.getGroup(this.props.groupingId);
        data.onSave = function (action, group) {
            this.save(action, group)
        }.bind(this);
    }

    // Render browser component
    try {
        this._rootReactNode = ReactDOM.render(
            React.createElement(UiAction, data),
            domCon
        );
    } catch (e) {
        log.error("Could not render mass edit ui." + e);
    }

    // Always reset the appBarMessage after rendering
    this._snackBarMessage = '';
}

/**
 * Loops thru the this._groupings and will try to find the group using the groupingId
 * Once the group is found, it will create a new instance of entity/definition/Group model
 *
 * @param groupingId The groupingId that will be used to find a group in this._groupings
 * @returns {entity/definition/Group}
 */
GroupingManagerController.prototype.getGroup = function (groupingId) {

    // Create a new group with blank values
    let group = new Group();

    // Make sure that the groupingId is not null, otherwise we do not need to loop thru the groupings
    if (groupingId !== null) {

        // Set the group.id here because if _groupings.groups is still loading, at least we know that this group has an Id
        group.id = groupingId;

        for (let idx in this._groupings.groups) {
            let currentGroup = this._groupings.groups[idx];

            if (currentGroup.id == groupingId) {

                /*
                 * Since the groups in groupins is already a model of entity/definition/Group
                 * We just need to assign the currentGroup into the group variable and break the loop
                 * Make sure that we will just clone the currentGroup so any changes made will not automatically reflect
                 *  to the Group Model without saving it
                 */
                group = Object.create(currentGroup);
                break;
            }
        }
    }

    // Return the entity/definition/Group model
    return group;
}

/**
 * Save the group data
 *
 * @param {string} action The type of action will be executing
 * @param {entity/definition/Group} group The group model that will be saved
 */
GroupingManagerController.prototype.save = function (action, group) {

    // Call the entitySaver::saveGroup() to save the group changes
    entitySaver.saveGroup(action, this._groupings, group, function (response) {

        if (response.error) {
            this._snackBarMessage = "Error saving the changes. " + response.error;
            this.render();
        } else {

            let resultGroup = new Group(response);

            switch (action ) {
                case 'add':
                    this._groupings.addGroup(resultGroup);
                    break;
                case 'edit':
                    this._groupings.updateGroup(resultGroup);
                    break;
                case 'delete':
                    this._groupings.removeGroup(resultGroup);
                    break;
            }

            groupingLoader.cache(this._groupings);

            // After a successful save, then let's close the mass edit ui
            this.close();
        }
    }.bind(this));
}

module.exports = GroupingManagerController;
