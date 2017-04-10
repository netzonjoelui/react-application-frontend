/**
 * @fileOverview Order by that is used in sort order
 *
 * @author:	Marl Tumulak, marl.tumulak@aereus.com;
 * 			Copyright (c) 2016 Aereus Corporation. All rights reserved.
 */
'use strict';

/**
 * Represents a filtering condition for a collection of entities
 *
 * @constructor
 * @param {array} opt_data Optional. Contains the data for order by
 */
var OrderBy = function(opt_data) {

    let data = opt_data || {};

    /**
     * Field name to use for sort order
     *
     * @public
     * @type {string}
     */
    this.fieldName = data.field || data.field_name || "";

    /**
     * Direction used tp sort order
     *
     * @public
     * @type {string}
     */
    this.direction = data.direction || "asc";
}

/**
 * Get the orderby data object
 *
 * @return {object}
 * @public
 */
OrderBy.prototype.toData = function() {

    // We need to handle _ encoded fields if coming from the backend
    var data = {
        field_name: this.fieldName,
        direction: this.direction
    }

    return data;
}

/**
 * Set oderby class from data
 *
 * @param {object} data
 * @public
 */
OrderBy.prototype.fromData = function(data) {
    this.fieldName = data.field || data.field_name || "";
    this.direction = data.direction || "asc";
}

/**
 * Set oderby class from data
 *
 * @param {object} data
 * @public
 */
OrderBy.prototype.setFieldName = function(fieldName) {
    this.fieldName = fieldName;
}

/**
 * Set oderby class from data
 *
 * @param {object} data
 * @public
 */
OrderBy.prototype.getFieldName = function() {
    return this.fieldName
}

/**
 * Set oderby class from data
 *
 * @param {object} data
 * @public
 */
OrderBy.prototype.setDirection = function(direction) {
    this.direction = direction || "asc";
}

/**
 * Set oderby class from data
 *
 * @param {object} data
 * @public
 */
OrderBy.prototype.getDirection = function() {
    return this.direction
}

module.exports = OrderBy;
