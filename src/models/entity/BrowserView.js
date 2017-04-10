/**
 * @fileOverview A view object used to define how a collection of entities is displayed to users
 *
 * @author: Sky Stebnicki, sky.stebnicki@aereus.com;
 *          Copyright (c) 2015 Aereus Corporation. All rights reserved.
 */

import Where from './Where';
import OrderBy from './OrderBy';

/**
 * Define the view of an entity collection
 *
 * @constructor
 * @param {string} objType The name of the object type that owns the grouping field
 */
var BrowserView = function (objType) {

  /**
   * The name of the object type we are working with
   *
   * @public
   * @type {string|string}
   */
  this.objType = objType || "";

  /**
   * Array of where conditions
   *
   * @type {Where[]}
   * @private
   */
  this._conditions = [];

  /**
   * Description of this view
   *
   * @type {string}
   */
  this.description = "";

  /**
   * Unique id if this is a saved custom view
   *
   * @type {string}
   */
  this.id = null;

  /**
   * Short name or label for this view
   *
   * @type {string}
   */
  this.name = "";

  /**
   * Boolean to indicate if this is a system or custom view
   *
   * System views cannot be edited so it is important for the client
   * to know whether or not to allow a user to make changes to the view.
   *
   * @type {boolean}
   */
  this.system = false;

  /**
   * Array of sort order objects
   *
   * @type {Array}
   * @private
   */
  this._orderBy = [];

  /**
   * Which fields to display in a table view
   *
   * @type {string[]}
   * @private
   */
  this._tableColumns = [];

  /**
   * The scope of the view
   *
   * TODO: define
   *
   * @type {string}
   */
  this.scope = "";

  /**
   * The user id that owns this view
   *
   * @type {string}
   */
  this.userId = null;

  /**
   * The team that owns this view
   *
   * @type {string}
   */
  this.teamId = null;

  /**
   * Each report has it's own unique view to define the filter
   *
   * @type {string}
   */
  this.reportId = "";

  /**
   * Default flag for the current user
   *
   * This should only be set for one view. It is managed by the server.
   *
   * @type {bool}
   */
  this.default = false;

  // TODO: Document
  this.filterKey = "";
}

/**
 * Set the view from a data object
 *
 * @param {Object} data
 */
BrowserView.prototype.fromData = function (data) {

  // If no data provided, then no need to map the values
  if (!data) {
    return;
  }

  if (data.hasOwnProperty("id")) {
    this.id = data.id;
  }

  if (data.hasOwnProperty("obj_type")) {
    this.objType = data.obj_type;
  }

  if (data.hasOwnProperty("name")) {
    this.name = data.name;
  }

  if (data.hasOwnProperty("description")) {
    this.description = data.description;
  }

  if (data.hasOwnProperty("default")) {
    this.default = data.default;
  }

  if (data.hasOwnProperty("user_id")) {
    this.userId = data.user_id;
  }

  if (data.hasOwnProperty("team_id")) {
    this.teamId = data.team_id;
  }

  if (data.hasOwnProperty("report_id")) {
    this.reportId = data.report_id;
  }

  if (data.hasOwnProperty("scope")) {
    this.scope = data.scope;
  }

  if (data.hasOwnProperty("system") || data.hasOwnProperty("f_system")) {
    this.system = data.system || data.f_system;
  }


  if (data.hasOwnProperty("filter_key")) {
    this.filterKey = data.filter_key;
  }

  // Setup columns to display for a table view
  if (data.hasOwnProperty("table_columns")) {

    // Clear the conditions first before we push the conditions data
    this._tableColumns = [];

    for (let idx in data.table_columns) {
      this._tableColumns.push(data.table_columns[idx]);
    }
  }

  if (data.hasOwnProperty("conditions")) {

    // Clear the conditions first before we push the conditions data
    this._conditions = [];

    for (let idx in data.conditions) {
      const where = new Where(data.conditions[idx].field_name);

      where.bLogic = data.conditions[idx].blogic;
      where.operator = data.conditions[idx].operator;
      where.value = data.conditions[idx].value;
      this._conditions.push(where);
    }
  }

  if (data.hasOwnProperty("sort_order") || data.hasOwnProperty("order_by")) {

    // Clear the order by first before we push the sort order data
    this._orderBy = [];

    const orderByData = data.sort_order || data.order_by;
    for (let idx in orderByData) {
      const orderBy = new OrderBy(orderByData[idx]);
      this._orderBy.push(orderBy);
    }
  }
}

/**
 * Get the object view data
 *
 * @return {Object} Data of Browser View
 */
BrowserView.prototype.getData = function () {

  let data = {
    id: this.id,
    obj_type: this.objType,
    name: this.name,
    description: this.description,
    f_system: this.system,
    f_default: this.default,
    user_id: this.userId,
    team_id: this.teamId,
    report_id: this.reportId,
    scope: this.scope,
    filter_key: this.filterKey,
  };

  // Table Columns data
  data.table_columns = [];
  for (let idx in this._tableColumns) {
    data.table_columns.push(this._tableColumns[idx]);
  }

  // Conditions data
  data.conditions = [];
  for (let idx in this._conditions) {
    data.conditions.push(this._conditions[idx].toData());
  }

  // Order By data
  data.order_by = [];
  for (let idx in this._orderBy) {
    data.order_by.push(this._orderBy[idx].toData());
  }

  return data;
}

/**
 * Creates a new where object instance and stores it in _conditions
 *
 * @param {string} fieldName The fieldName of the condition we want to create and store in _conditions
 * @public
 */
BrowserView.prototype.addCondition = function (fieldName) {

  // We do not need to specify the bLogic, operator and value since this will be set by the user in the Advanced Search
  const condition = new Where(fieldName);
  this._conditions.push(condition);
}

/**
 * Removes the condition based on the index provided
 *
 * @param {int} index The index of the condition that will be removed
 * @return {Where[]}
 * @public
 */
BrowserView.prototype.removeCondition = function (index) {
  this._conditions.splice(index, 1);
}

/**
 * Get where conditions
 *
 * @return {Where[]}
 */
BrowserView.prototype.getConditions = function () {
  return this._conditions;
}

/**
 * Set where conditions
 *
 * @param {entity/Where[]} conditionData Array of entity/Where conditions
 */
BrowserView.prototype.setConditions = function (conditionData) {
  this._conditions = conditionData;
}

/**
 * Pushes a new orderBy object in _orderBy
 *
 * @param {string} fieldName The fieldName of sort order we want to create
 * @param {string} direction The direction of the sort order we want to create
 * @public
 */
BrowserView.prototype.addOrderBy = function (fieldName, direction) {

  const orderBy = new OrderBy();
  orderBy.setFieldName(fieldName);
  orderBy.setDirection(direction);

  // Push the newly added order by
  this._orderBy.push(orderBy);
}

/**
 * Removes the orderBy based on the index provided
 *
 * @param {int} index The index of the orderBy that will be removed
 * @public
 */
BrowserView.prototype.removeOrderBy = function (index) {
  this._orderBy.splice(index, 1);
}

/**
 * Get the sort order
 *
 * @return {string[]}
 */
BrowserView.prototype.getOrderBy = function () {
  return this._orderBy;
}

/**
 * Set the sort order
 *
 * @param {entity/OrderBy[]} orderByData Array of entity/OrderBy
 */
BrowserView.prototype.setOrderBy = function (orderByData) {
  this._orderBy = orderByData;
}

/**
 * Pushes a new column in _tableColumns
 *
 * @param {string} fieldName The column name we want to create
 * @public
 */
BrowserView.prototype.addTableColumn = function (fieldName) {
  this._tableColumns.push(fieldName);
}

/**
 * Removes the column based on the index provided
 *
 * @param {string} fieldName Column name that will be saved based on the index provided
 * @param {int} index The index of column that will be removed
 * @public
 */
BrowserView.prototype.updateTableColumn = function (fieldName, index) {
  this._tableColumns[index] = fieldName
}

/**
 * Removes the column based on the index provided
 *
 * @param {int} index       The index of column that will be removed
 * @public
 */
BrowserView.prototype.removeTableColumn = function (index) {
  this._tableColumns.splice(index, 1);
}

/**
 * Get the table columns to view
 *
 * @return {string[]}
 */
BrowserView.prototype.getTableColumns = function () {
  return this._tableColumns;
}

/**
 * Set the table columns to view
 *
 * @param {string[]} columnsToViewData Array of column names
 */
BrowserView.prototype.setTableColumns = function (columnsToViewData) {
  this._tableColumns = columnsToViewData;
}

module.exports = BrowserView;
