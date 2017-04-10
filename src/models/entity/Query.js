/**
 * @fileOverview Entity query
 *
 * Example:
 * <code>
 * 	var query = new Query("customer");
 * 	query.where('first_name').equals("sky");
 *  query.andWhere('last_name').contains("steb");
 *	query.orderBy("last_name", Query.orderByDir.desc);
 * </code>
 *
 * @author:	Sky Stebnicki, sky.stebnicki@aereus.com; 
 * 			Copyright (c) 2016 Aereus Corporation. All rights reserved.
 */
import Where from './Where';

/**
 * Query entity object
 *
 * @constructor
 * @param {string} objType Name of the object type we are querying
 */
var Query = function(objType) {
  /**
   * Object type for this list
   *
   * @type {string}
   * @private
   */
  this.objType_ = objType;

  /**
   * Array of condition objects {blogic, fieldName, operator, condValue}
   *
   * @type {Array}
   * @private
   */
  this.conditions_ = new Array();


  /**
   * Array of sort order objects
   *
   * @type {Array}
   * @private
   */
  this.orderBy_ = new Array();

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
  this.limit_ = 100;

  /**
   * Total number of objects in this query set
   *
   * @type {number}
   * @private
   */
  this.totalNum = 0;

  /**
   * Copy static order by direction to this so we can access through this.orderByDir
   *
   * @public
   * @type {Query.orderByDir}
   */
  this.orderByDir = Query.orderByDir;
};

/**
 * Static order by direction
 * 
 * @const
 */
Query.orderByDir = {
	asc : "ASC",
	desc : "DESC"
}

/**
 * Proxy used to add the first where condition to this query
 *
 * @param {string} fieldName The name of the field to query
 * @return {Where}
 */
Query.prototype.where = function(fieldName) {
	return this.andWhere(fieldName);
}

/**
 * Add a where condition using the logical 'and' operator
 * 
 * @param {string} fieldName The name of the field to query
 * @return {Where}
 */
Query.prototype.andWhere = function(fieldName) {
	// TODO: return Where
}

/**
 * Add a where condition using the logical 'and' operator
 * 
 * @param {string} fieldName The name of the field to query
 * @return {Where}
 */
Query.prototype.orWhere = function(fieldName) {
	// TODO: return Where
}

/**
 * Add an order by condition
 * 
 * @param {string} fieldName The name of the field to sort by
 * @param {Query.orderByDir} The direction of the sort
 */
Query.prototype.orderBy = function(fieldName, direction) {
	// TODO: add order by condition
}

/** 
 * Get the conditions for this entity query
 * 
 * @return {Array}
 */
Query.prototype.getConditions = function() {
	return this.conditions_;
}

/** 
 * Get the order for this entity query
 * 
 * @return {Array}
 */
Query.prototype.getOrderBy = function() {
	return this.orderBy_;
}

/**
 * Set the offset for this query
 * 
 * @param {int} offset
 */
Query.prototype.setOffset = function(offset) {
	this.offset_ = offset;
}
/**
 * Get the current offset
 * 
 * @return {int}
 */
Query.prototype.getOffset = function() {
	return this.offset_;
}

/**
 * Set the limit for this query
 * 
 * @param {int} limit
 */
Query.prototype.setLimit = function(limit) {
	this.limit_ = limit;
}
/**
 * Get the current limit
 * 
 * @return {int}
 */
Query.prototype.getLimit = function() {
	return this.limit_;
}

module.exports = Query;
