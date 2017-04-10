/**
 * @fileOverview Where condition used for querying entities
 *
 * @author:	Sky Stebnicki, sky.stebnicki@aereus.com;
 * 			Copyright (c) 2015 Aereus Corporation. All rights reserved.
 */
'use strict';

/**
 * Represents a filtering condition for a collection of entities
 *
 * @constructor
 * @param {string} fieldName The name of a field we are filtering
 */
var Where = function(fieldName) {

    /**
     * Field name to check
     *
     * If the field name is "*" then conduct a full text query
     *
     * @public
     * @type {string}
     */
    this.fieldName = fieldName || "";

    /**
     * Operator
     *
     * @public
     * @type {Where.operator}
     */
    this.operator = Where.operators.EQUALTO;

    /**
     * Boolean operator for combining with another (preceding) Where
     *
     * @public
     * @type {Where.conjunctives}
     */
    this.bLogic = Where.conjunctives.AND;

    /**
     * The value to check against
     *
     * @public
     * @type {mixed}
     */
    this.value = null;
}



/**
 * Conjunctive operators for combining Where conditions
 *
 * @const
 */
Where.conjunctives = {
    AND : "and",
    OR : "or"
}

/**
 * Conditional operators for comparing field values against input
 *
 * @const
 */
Where.operators = {
    EQUALTO : "is_equal",
    DOESNOTEQUAL : "is_not_equal",
    LIKE : "begins_with",
    ISGREATERTHAN : "is_greater",
    ISGREATEROREQUALTO : "is_greater_or_equal",
    ISLESSTHAN : "is_less",
    ISLESSOREQUALTO : "is_less_or_equal"
}

/**
 * Set condition to match where field equals value
 *
 * @param {string} value The value to check quality against
 */
Where.prototype.equalTo = function(value) {
    this.operator = Where.operators.EQUALTO;
    this.value = value;
}

/**
 * Set condition to match where field does not equal mValue
 *
 * @param {string} value The value to check quality against
 */
Where.prototype.doesNotEqual = function(value) {
    this.operator = Where.operators.DOESNOTEQUAL;
    this.value = value;
}

/**
 * Check if terms are included in a string using the '%' wildcard
 *
 * @param {string} value The value to check quality against
 */
Where.prototype.like = function(value) {
    this.operator = Where.operators.LIKE;
    this.value = value;
}


/**
 * Check if the value in the column/field is greater than the condition value
 *
 * @param {string} value The value to check quality against
 */
Where.prototype.isGreaterThan = function(value) {
    this.operator = Where.operators.ISGREATERTHAN;
    this.value = value;
}


/**
 * Check if the value in the column/field is greater or euqal to the condition value
 *
 * @param {string} value The value to check quality against
 */
Where.prototype.isGreaterorEqualTo = function(value) {
    this.operator = Where.operators.ISGREATEROREQUALTO;
    this.value = value;
}

/**
 * Check if the value in the column/field is less than the condition value
 *
 * @param {string} value The value to check quality against
 */
Where.prototype.isLessThan = function(value) {
    this.operator = Where.operators.ISLESSTHAN;
    this.value = value;
}

/**
 * Check if the value in the column/field is less or equal to the condition value
 *
 * @param {string} value The value to check quality against
 */
Where.prototype.isLessOrEqaulTo = function(value) {
    this.operator = Where.operators.ISLESSOREQUALTO;
    this.value = value;
}

/**
 * Get the condition operator based on the field type
 *
 * @param {string} fieldType    The type of the field
 * @public
 */
Where.prototype.getOperatorsForFieldType = function(fieldType) {
    var operators = null;

    switch(fieldType) {
        case 'fkey_multi':
        case 'fkey':
            operators = {
                is_equal: "is equal to",
                is_not_equal: "is not equal to"
            }
            break;
        case 'number':
        case 'real':
        case 'integer':
            operators = {
                is_equal: "is equal to",
                is_not_equal: "is not equal to",
                is_greater: "is greater than",
                is_less: "is less than",
                is_greater_or_equal: "is greater than or equal to",
                is_less_or_equal: "is less than or equal to",
                begins_with: "begins with"
            };
            break;
        case 'date':
        case 'timestamp':
            operators = {
                is_equal: "is equal to",
                is_not_equal: "is not equal to",
                is_greater: "is greater than",
                is_less: "is less than",
                day_is_equal: "day is equal to",
                month_is_equal: "month is equal to",
                year_is_equal: "year is equal to",
                is_greater_or_equal: "is greater than or equal to",
                is_less_or_equal: "is less than or equal to",
                last_x_days: "within last (x) days",
                last_x_weeks: "within last (x) weeks",
                last_x_months: "within last (x) months",
                last_x_years: "within last (x) years",
                next_x_days: "within next (x) days",
                next_x_weeks: "within next (x) weeks",
                next_x_months: "within next (x) months",
                next_x_years: "within next (x) years"
            };
            break;
        case 'bool':
            operators = {
                is_equal: "is equal to",
                is_not_equal: "is not equal to"
            };
            break;
        default: // Text
            operators = {
                is_equal: "is equal to",
                is_not_equal: "is not equal to",
                begins_with: "begins with",
                contains: "contains"
            };
            break;
    }

    return operators;
}

/**
 * Get the where data object
 *
 * @return {object}
 * @public
 */
Where.prototype.toData = function() {

    // We need to handle _ encoded fields if coming from the backend
    var data = {
        blogic: this.bLogic || this.blogic,
        field_name: this.fieldName || this.field_name,
        operator: this.operator,
        value: this.value
    }

    return data;
}

/**
 * Set where class from data
 *
 * @param {object} data
 * @public
 */
Where.prototype.fromData = function(data) {
    this.bLogic = data.blogic || data.bLogic;
    this.fieldName = data.field_name || data.fieldName;
    this.operator = data.operator;
    this.value = data.value || "";
}

/**
 * Get the human description to be displayed of the where condition
 *
 * @param {bool} hideBlogic Flag that will determine if we should display the bLogic
 * @return string The human description of the where condition
 * @public
 */
Where.prototype.getHumanDesc = function(hideBlogic) {
    var operator = this.operator.replace(/[_]/g, " ");
    var bLogic = this.bLogic + ' ';

    if(hideBlogic) {
        bLogic = '';
    }

    return bLogic + this.fieldName + ' ' + operator + ' ' + this.value;
}

module.exports = Where;
