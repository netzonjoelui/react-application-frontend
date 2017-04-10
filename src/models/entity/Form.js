/**
 * @fileOverview Form model that will parse the xml form string and get its childNodes
 *
 * Use the public function parseXML() to parse the xml form string
 *
 * @author =    Marl Tumulak; marl.tumulak@aereus.com;
 *            Copyright (c) 2016 Aereus Corporation. All rights reserved.
 */
'use strict';

var FormNode = require('./form/FormNode');

/**
 * Create an instance of Form Model
 *
 * @constructor
 */
var Form = function () {
}

/**
 * Parses the xmlString then creates the form element nodes. Maps the xmlData children to create the child element nodes
 *
 * @param {string} xmlString The xml form string that will be parsed
 * @returns {entity/form/FormNode}
 * @public
 */
Form.prototype.fromXml = function (xmlString) {

    // http://api.jquery.com/jQuery.parseXML/
    let xmlDoc = jQuery.parseXML(xmlString);
    let xmlData = xmlDoc.documentElement;

    // Create an instance of node using the xmlData.nodeName
    let formNode = new FormNode(xmlData.nodeName);

    // Let's load the xmlData so we can define our formNode model
    formNode.loadXmlData(xmlData);

    // Get the xml child nodes if there is any
    this._getXmlNodes(xmlData, formNode);

    return formNode;
}

/**
 * Function that will get the xml child nodes
 *
 * @param {object} xmlNode The xml form node where we will map its child nodes
 * @param {entity/form/FormNode} parentNode The parent node where we will save the mapped child nodes
 * @private
 */
Form.prototype._getXmlNodes = function (xmlNode, parentNode) {

    var xmlChildNodes = xmlNode.childNodes;

    // Process through children
    for (let i = 0; i < xmlChildNodes.length; i++) {
        let childNode = xmlChildNodes[i];

        // Make sure that the xml child node is an element node type (ELEMENT_NODE)
        if (childNode.nodeType == childNode.ELEMENT_NODE) {

            // Let's create a new instance of node form model for this child node
            let childFormNode = new FormNode(childNode.nodeName);

            // Load the xml data using the childNode (xmlChildNodes[i])
            childFormNode.loadXmlData(childNode);

            // Now let's add the child form node model to the parentNode
            parentNode.addChildNode(childFormNode);

            /*
             * Call this function again to check if this child has its own child nodes
             * Use the node model created as our parentNode
             */
            this._getXmlNodes(childNode, childFormNode);
        }
    }
}

module.exports = Form;