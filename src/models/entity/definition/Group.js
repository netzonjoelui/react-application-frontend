/**
 * @fileOverview Define entity group
 *
 * @author:    Marl Tumulak, marl.tumulak@aereus.com;
 *            Copyright (c) 2016 Aereus Corporation. All rights reserved.
 */

/**
 * Creates an instance of an entity group
 *
 * @param {Object} opt_data The definition data
 * @constructor
 */
var Group = function (opt_data) {

  var data = opt_data || new Object();

  /**
   * Unique id if the group was loaded from a database
   *
   * @public
   * @type {int}
   */
  this.id = data.id || null;

  /**
   * If this group has a parent_id, then this group is a sub group
   *
   * @public
   * @type {int}
   */
  this.parentId = data.parent_id || null;

  /**
   * Name of the group
   *
   * @public
   * @type {string}
   */
  this.name = data.name || "";

  /**
   * The color of the group
   *
   * @public
   * @type {string}
   */
  this.color = data.color || null;

  /**
   * This will determine in what sequence the group will be displayed
   *
   * @public
   * @type {int}
   */
  this.sortOrder = data.sort_order || 0;

  /**
   * Contains the sub group details. This is only applicable if heirarch is true.
   *
   * @public
   * @type {array}
   */
  this.children = data.children;

  /**
   * This will determine if the group can have sub groups
   *
   * @public
   * @var bool
   */
  this.heirarch = data.is_heiarch || false;

  /**
   * Is this a system defined group
   *
   * Only user group can be deleted or edited
   *
   * @public
   * @var bool
   */
  this.system = data.is_system || false;
}

/**
 * Get the group data
 *
 * @returns {object} Contains the group data in an object format
 */
Group.prototype.getData = function () {
  let retObj = {
    id: this.id,
    name: this.name,
    parent_id: this.parentId,
    color: this.color,
    children: this.children,
    sort_order: this.sortOrder,
    is_heiarch: this.heirarch,
    is_system: this.system
  }

  return retObj;
}

module.exports = Group;
