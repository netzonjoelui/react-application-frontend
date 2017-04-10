/**
 * @fileOverview Define the xml node object data
 *
 * Use the public function loadXmlData() to import the xml node data into this form node model
 * Form Node model can also set and get its attributes just like in xml node document
 *  Use public function setAttribute() and getAttribute()
 *
 * @author =    Marl Tumulak; marl.tumulak@aereus.com;
 *            Copyright (c) 2016 Aereus Corporation. All rights reserved.
 */
'use strict';

/**
 * Creates an instance of a node object
 *
 * @param {string} nodeName The name of the node we are creating
 * @constructor
 */
var FormNode = function (nodeName) {

    /**
     * The name of the node
     *
     * @type {string|null}
     */
    this._nodeName = nodeName || null;

    /**
     * The value/element inside the node
     *
     * e.g. <header>My Node Value</> (this.nodeValue will get the 'My Node Value' string)
     *
     * @type {null}
     */
    this._nodeValue = null;

    /**
     * Here we will store the xml node attributes
     *
     * @type {Array}
     * @private
     */
    this._attributes = new Array;

    /**
     * This is where we store the child nodes if it is available
     *
     * @type {Array}
     */
    this._childNodes = new Array;
}

/**
 * Function that will get the name of this node model
 *
 * @returns {string} Name of this node model
 * @public
 */
FormNode.prototype.getName = function () {
    return this._nodeName;
}

/**
 * Function that will get the text value of the xml node if there is any
 *
 * @returns {string|null} Returns the text value if there is any
 * @public
 */
FormNode.prototype.getText = function () {
    return this._nodeValue;
}

/**
 * Function that will get the child nodes
 *
 * @returns {Array}
 * @public
 */
FormNode.prototype.getChildNodes = function () {
    return this._childNodes;
}

/**
 * Function that will get the specific child node using the index provided
 *
 * @param {int} index The index of the child to be retrieved
 * @returns {entity/form/FormNode}
 * @public
 */
FormNode.prototype.getChildNode = function (index) {
    return this._childNodes[index];
}

/**
 * Function that will add a new child node for this node model
 *
 * @param {entity/form/FormNode} formNode The new instance of formNode model that will be added
 * @public
 */
FormNode.prototype.addChildNode = function (formNode) {
    this._childNodes.push(formNode);
}

/**
 * Function that will remove a child node based on the index that was provided
 *
 * @param {int} index The index of the child node to be removed
 * @public
 */
FormNode.prototype.removeChildNode = function (index) {
    this._childNodes.splice(index, 1)
}

/**
 * Load xml data from a data object to define this node model
 *
 * @param {object} data The data object where we map its values and assign it to this node model variables
 * @private
 */
FormNode.prototype.loadXmlData = function (data) {

    // Data is a required param and we should fail if called without it
    if (!data) {
        throw "'data' is a required param to load the xml data";
    }

    /*
     * If we have a child node, and first child node has a node type of TEXT_NODE
     *  Then we will consider this as the node value
     */
    if (data.childNodes
        && data.childNodes.length
        && data.childNodes[0].nodeType == data.childNodes[0].TEXT_NODE) {
        this._nodeValue = data.childNodes[0].nodeValue;
    }

    // If we have xml data attributes, then let's map it and store in the _attributes
    if (data.attributes && data.attributes.length) {
        for (var idx in data.attributes) {
            let attribute = data.attributes[idx];

            // Make sure that we have and attribute name and value before setting
            if (attribute.name && attribute.value) {
                this.setAttribute(attribute.name, attribute.value);
            }
        }
    }
}

/**
 * Function that will generate an element class name based on the node model name
 *
 * Basically, we will just format the nodeName as camel case and remove the underscores
 *
 * @return {string} The generated element class name
 * @public
 */
FormNode.prototype.generateElementClassName = function () {

    // Set the default value of componentName to an empty string
    let componentName = "";

    // Make sure we have a valid nodeName before we generate a component name
    if (!this._nodeName || typeof this._nodeName === 'undefined') {
        return componentName;
    }

    let parts = this._nodeName.split("_");

    for (var idx in parts) {

        // Convert to uc first
        let firstChar = parts[idx].charAt(0).toUpperCase();
        componentName += firstChar + parts[idx].substr(1);
    }

    return componentName;
}

/**
 * Function that will get the attribute value of the node model
 *
 * @param {string} name The name of the attribute where we want to get its value
 * @returns {mixed} The attribute value
 * @public
 */
FormNode.prototype.getAttribute = function (name) {

    // Make sure that attribute name is provided before getting the attribute value
    if (typeof name == "undefined") {
        return null;
    }

    // Get value from fieldValue
    if (this._attributes[name]) {
        return this._attributes[name];
    }

    return null;
}

/**
 * Function that will set an attribute for this node model
 *
 * @param {string} name The name of the attribute that we are going to save
 * @param {mixed} value The value of the attribute to be saved
 * @public
 */
FormNode.prototype.setAttribute = function (name, value) {

    // Can't set an attribute without a name
    if (typeof name == "undefined") {
        return;
    }


    this._attributes[name] = value;
}

module.exports = FormNode;
