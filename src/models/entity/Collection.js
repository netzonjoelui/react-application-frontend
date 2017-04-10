/**
 * @fileOverview Collection of entities
 *
 * Example:
 *
 *    var collection = new entity.Collection("customer");
 *    collection.where("first_name").isEqaulTo("sky");
 *    collection.setLimit(100);
 *    alib.events.listen(collection, "change", function(collection) {
 *		// Load entities into the view
 *		this.loadEntities(collection);
 *	}.bind(this));
 *
 *    // This will trigger a 'change' event if any entities are loaded
 *    collection.load();
 *
 *    // To extend the limit, just go
 *    var lastLoadedOffset = collection.getLastLoadedOffset();
 *    if (lastLoadedOffset < collection.getTotalNum())
 *    {
 *	  var nextLimit = lastLoadedOffset + 100;
 *
 *	  // If we are beyond the boundaries of the query, just point to the end
 *	  if (nextLimit >= collection.getTotalNum())
 *		nextLimit = collection.getTotalNum() - 1;
 *
 *	  collection.setLimit(nextLimit);
 *	  collection.load();
 *	}
 *
 *    // Refresh will trigger change if needed
 *    collection.refresh(function() {
 *	 // Finished refresh
 *	});
 *
 *
 *
 * @author:    Sky Stebnicki, sky.stebnicki@aereus.com;
 *            Copyright (c) 2014-2015 Aereus Corporation. All rights reserved.
 */
import Entity from './Entity';
import Where from './Where';
import OrderBy from './OrderBy';
import createHash from 'sha.js';

/**
 * Represents a collection of entities
 *
 * @constructor
 * @param {string} objType The name of the object type we are collecting
 */
var Collection = function (objType) {

    /**
     * Object type for this list
     *
     * @type {string}
     * @private
     */
    this.objType_ = objType;

    /**
     * Entity definition
     *
     * @type {EntityDefinition}
     */
    this.entityDefinition_ = null;

    /**
     * Array of where conditions
     *
     * @type {Where[]}
     * @private
     */
    this.conditions_ = [];

    /**
     * Array of sort order objects
     *
     * @type {Array}
     * @private
     */
    this.orderBy_ = [];

    /**
     * The current offset of the total number of items
     *
     * @type {number}
     * @private
     */
    this.offset_ = 0;

    /**
     * Number of items to pull each query
     *
     * @type {number}
     * @private
     */
    this.limit_ = 25;

    /**
     * Total number of objects in this query set
     *
     * @type {number}
     * @private
     */
    this.totalNum_ = 0;

    /**
     * Copy static order by direction to this so we can access through this.orderByDir
     *
     * @public
     * @type {Collection.orderByDir}
     */
    this.orderByDir = Collection.orderByDir;

    /**
     * Array of entities in this collection
     *
     * @private
     * @type {Entity[]}
     */
    this.entities_ = [];
};

/**
 * Static order by direction
 *
 * @const
 */
Collection.orderByDir = {
    ASC: "ASC",
    DESC: "DESC"
};

/**
 * Set the entities for this collection from raw data
 *
 * @param {Array} data
 */
Collection.prototype.setEntitiesData = function (data) {

  if (this.offset_ == 0) {
    // Cleanup
    this.entities_ = new Array();
  } else {
    // Remove everything from this.offset_ on
    for (var i = (this.entities_.length - 1); i > this.offset_; i--) {
      this.entities_.pop();
    }
  }

  // Initialize entities
  for (var i in data) {
    this.entities_[this.offset_ + parseInt(i)] = new Entity(this.entityDefinition_, data[i]);
  }

  // Triger change event
  alib.events.triggerEvent(this, "change");
};

/**
 * Get total number of entities in this collection
 *
 * @returns {integer}
 */
Collection.prototype.getTotalNum = function () {
  return this.totalNum_;
};

/**
 * Get array of all entities in this collection
 */
Collection.prototype.getEntities = function () {
  return this.entities_;
};

/**
 * Get updates from the backend and refresh the collection
 */
Collection.prototype.refresh = function () {
  // Reload which will trigger a load event
  this.load();
};

/**
 * Add a Where object directly
 *
 * @param {Where} where The where objet to add to conditions
 */
Collection.prototype.addWhere = function (where) {
  this.conditions_.push(where);
};

/**
 * Proxy used to add the first where condition to this query
 *
 * @param {string} fieldName The name of the field to query
 * @return {Where}
 */
Collection.prototype.where = function (fieldName) {
  return this.andWhere(fieldName);
};

/**
 * Add a where condition using the logical 'and' operator
 *
 * @param {string} fieldName The name of the field to query
 * @return {Where}
 */
Collection.prototype.andWhere = function (fieldName) {
  var where = new Where(fieldName);
  this.conditions_.push(where);
  return where;
};

/**
 * Add a where condition using the logical 'and' operator
 *
 * @param {string} fieldName The name of the field to query
 * @return {Where}
 */
Collection.prototype.orWhere = function (fieldName) {
  var where = new Where(fieldName);
  where.operator = Where.conjunctives.OR;
  this.conditions_.push(where);
  return where;
};

/**
 * Get the conditions for this entity query
 *
 * @return {Array}
 */
Collection.prototype.getConditions = function () {
  return this.conditions_;
};

/**
 * Clear all where conditions
 */
Collection.prototype.clearConditions = function () {
  this.conditions_ = [];
};

/**
 * Add an order by condition
 *
 * @param {string} fieldName The name of the field to sort by
 * @param {Collection.orderByDir} The direction of the sort
 */
Collection.prototype.setOrderBy = function (fieldName, direction) {
  let orderBy = new OrderBy();
  orderBy.setFieldName(fieldName);
  orderBy.setDirection(direction);
  this.orderBy_.push(orderBy);
};

/**
 * Get the order for this entity query
 *
 * @return {Array}
 */
Collection.prototype.getOrderBy = function () {
  return this.orderBy_;
};

/**
 * Clear the order for this entity query
 */
Collection.prototype.clearOrderBy = function () {
  this.orderBy_ = [];
};

/**
 * Set the offset for this query
 *
 * @param {int} offset
 */
Collection.prototype.setOffset = function (offset) {
  this.offset_ = offset;
};

/**
 * Get the current offset
 *
 * @return {int}
 */
Collection.prototype.getOffset = function () {
  return this.offset_;
};

/**
 * Set the limit for this query
 *
 * @param {int} limit
 */
Collection.prototype.setLimit = function (limit) {
  this.limit_ = limit;
};

/**
 * Get the current limit
 *
 * @return {int}
 */
Collection.prototype.getLimit = function () {
  return this.limit_;
};

/**
 * Get the entity definition fields
 *
 * @return {array}
 */
Collection.prototype.getEntityFields = function () {
  return this.entityDefinition_.getFields();
};

/**
 * Load a query for this collection from data
 *
 * @param data
 */
Collection.prototype.queryFromData = function(data) {
  this.objType_ = data.obj_type;

  if (data.conditions) {
    data.conditions.forEach((condition) => {
      let where = new Where();
      where.fromData(condition);
      this.conditions_.push(where);
    });
  }

  if (data.order_by) {
    data.order_by.forEach((order) => {
      let sortOder = new OrderBy(order);
      this.orderBy_.push(sortOder);
    });
  }

  if (data.offset) {
    this.offset_ = data.offset;
  }

  if (data.limit) {
    this.limit = data.limit;
  }

};

/**
 * Convert the query of this collection into a data array
 *
 * @return {Object} Query params, but no entities or results
 */
Collection.prototype.queryToData = function() {
  let ret = { obj_type: this.objType_ };

  // Add any conditions
  ret.conditions = this.conditions_.map((condition) => {
      return condition.toData();
  });

  // Add any order by clauses
  ret.order_by = this.orderBy_.map((order) => {
    return order.toData();
  });

  if (this.offset_) {
    ret.offset = this.offset_;
  }

  if (this.limit_) {
    ret.limit = this.limit_;
  }

  return ret;
};

/**
 * Compute a unique hash basd on the params of this collection
 *
 * @return {string} hash for this collection
 */
Collection.prototype.getHash = function() {
  let message = this.objType_;

  // Loop through this.conditions_ and return a message to have it mapped
  let conditionParts = this.conditions_.map((condition) => {
    return condition.bLogic + condition.fieldName + condition.operator + condition.value;
  });
  message += conditionParts.join();

  // Add an order by conditions
  let orderByParts = this.orderBy_.map((sortOrder) => {
    return sortOrder.fieldName + sortOrder.direction;
  });
  message += orderByParts.join();

  // Create a sha256 hash
  let sha256 = createHash('sha256');
  message = sha256.update(message, 'utf8').digest('hex');

  // Concat the hash length to keep it under 16 chars
  if (message.length > 16) {
    message = message.substr(0, 16);
  }

  return message;
};

export default Collection;
