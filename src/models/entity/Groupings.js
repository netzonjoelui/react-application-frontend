/**
 * @fileOverview Groupings for an entity object type
 *
 * @author:	Sky Stebnicki, sky.stebnicki@aereus.com;
 * 			Copyright (c) 2014-2015 Aereus Corporation. All rights reserved.
 */
import Group from './definition/Group';

/**
 * Represents a collection of entities
 *
 * @constructor
 * @param {string} objType The name of the object type that owns the grouping field
 * @param {string} fieldName The name of the grouping field
 * @param {Array} opt_filter Optional filter
 */
var Groupings = function(objType, fieldName, opt_filter) {
    /**
     * The name of the object type we are working with
     *
     * @public
     * @type {string|string}
     */
    this.objType = objType || "";

    /**
     * The grouping field name
     *
     * @public
     * @type {string|string}
     */
    this.fieldName = fieldName || "";

    /**
     * An optional array of filters
     *
     * @public
     * @type {Array}
     */
    this.filter = opt_filter || [];

    /**
     * Array of groupings
     *
     * @type {Array}
     */
    this.groups = [];
}

/**
 * Get the groupings data in object format
 *
 * @returns {object} Returns the groupings data
 */
Groupings.prototype.getData = function() {

    let retObj = {
        obj_type: this.objType,
        field_name: this.fieldName,
        filter: this.filter,
        groups: []
    };

    // Loop thru the this.groups and get the group data
    for (let idx in this.groups) {
        let group = this.groups[idx];

        retObj.groups.push(group.getData());
    }

    return retObj;
}

/**
 * Set groupings from an array
 *
 * @param {object} data The data that will be imported to the Groupings Model
 */
Groupings.prototype.fromArray = function(data) {

    this.filter = data.filter;
    this.setGroups(data.groups);
}

/**
 * Set the groups into the Groupings. After setting the groups, the 'change' event will be triggered
 *
 * @param {array} groups The groups collection that will be set into the Groupings
 */
Groupings.prototype.setGroups = function(groups) {

    // Clear the current groups
    this.groups = [];

    // Loop thru the data.groups and create a entity/defintion/Group model using the group data
    for (let idx in groups) {
        let group = new Group(groups[idx]);
        this.groups.push(group);
    }
}

/**
 * Add a group to the groups collection. After adding a group, the 'change' event will be triggered
 *
 * @param {entity/description/Group} group The Group model that will be added in the group collection
 */
Groupings.prototype.addGroup = function(group) {
    this.groups.push(group);
}

/**
 * Update a group to the groups collection. After updating a group, the 'change' event will be triggered
 *
 * @param {entity/description/Group} group The Group model that will be updated in the group collection
 */
Groupings.prototype.updateGroup = function(group) {

    for (let idx in this.groups) {
        let currentGroup = this.groups[idx];

        // If we found the group that we will update, then just replace it with the updated Group model
        if (currentGroup.id == group.id) {
            this.groups[idx] = group;
            break;
        }
    }
}

/**
 * remove a group in the groups collection. After removing a group, the 'change' event will be triggered
 *
 * @param {entity/description/Group} group The Group model that will be updated in the group collection
 */
Groupings.prototype.removeGroup = function(group) {

    for (let idx in this.groups) {
        let currentGroup = this.groups[idx];

        // If we found the group that we will update, then just replace it with the updated Group model
        if (currentGroup.id == group.id) {
            this.groups.splice(idx, 1);
            break;
        }
    }
}

/**
 * Get all the groups in this grouping
 *
 * @returns {Array}
 */
Groupings.prototype.getGroups = function() {
    return this.groups;
}

/**
 * Get all the groupings in a hierarchical structure with group.children being populated
 *
 * @param {int} parentId Optional parent ID, other start at the root
 */
Groupings.prototype.getGroupsHierarch = function(parentId) {
    var output = [];
    if (typeof parentId == "undefined") {
        parentId == null;
    }

    for (let idx in this.groups) {

        // Copy to variable
        let group = Object.create(this.groups[idx]);

        if (group.parentId == parentId) {

            // If this is not a new group, then get the children
            if (group.id) {
                group.children = this.getGroupsHierarch(group.id);
            }

            // Add to the output buffer
            output.push(group);
        }
    }

    return output;
}

module.exports = Groupings;
