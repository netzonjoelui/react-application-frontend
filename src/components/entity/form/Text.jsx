/**
 * Text Label component
 */

import theme from './entity-form.scss';
import React from 'react';
var EntityFormShowFilter = require("../../mixins/EntityFormShowFilter.jsx");

/**
 * Text Label Element
 *
 * This will basically display the field value as label. There will be no input field displayed in this element
 */
var Text = React.createClass({

  mixins: [EntityFormShowFilter],

  /**
   * Expected props
   */
  propTypes: {

    /**
     * Current element node level
     *
     * @type {entity/form/FormNode}
     */
    elementNode: React.PropTypes.object.isRequired,

    /**
     * Entity being edited
     *
     * @type {entity/Entity}
     */
    entity: React.PropTypes.object,

    /**
     * Generic object used to pass events back up to controller
     *
     * @type {Object}
     */
    eventsObj: React.PropTypes.object,

    /**
     * Flag indicating if we are in edit mode or view mode
     *
     * @type {bool}
     */
    editMode: React.PropTypes.bool
  },

  /**
   * Render the component
   */
  render: function () {
    var elementNode = this.props.elementNode;
    var fieldName = elementNode.getAttribute('field');
    var fieldValue = this.props.entity.getValue(fieldName);
    var showif = this.props.elementNode.getAttribute('showif');
    var className = this.props.elementNode.getAttribute("class");

    var textDisplay = (
      <div className={"entity-form-field-text " + className}>{this.props.children}{fieldValue}</div>
    );
    if (showif) {

      // If ::evaluateShowIf() returns false, it means that the showif did not match the filter specified
      if (!this.evaluateShowIf(showif)) {
        textDisplay = null;
      }
    }

    return (
      textDisplay
    );
  },
});

export default Text;