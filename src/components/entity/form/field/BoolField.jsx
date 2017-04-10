/**
 * Boolean field component
 */
import React from 'react';
import theme from '../entity-form.scss';

// Chamel Controls
import Checkbox from 'chamel/lib/Toggle/Checkbox';

let log = require("../../../../log");

/**
 * Base level element for enetity forms
 */
var BoolField = React.createClass({

  /**
   * Expected props
   */
  propTypes: {
    elementNode: React.PropTypes.object.isRequired,
    entity: React.PropTypes.object,
    editMode: React.PropTypes.bool,
    onChange: React.PropTypes.func.isRequired
  },

  /**
   * Render the component
   */
  render: function () {
    let elementNode = this.props.elementNode;
    let fieldName = elementNode.getAttribute('name');

    let field = this.props.entity.def.getField(fieldName);
    let fieldValue = this.props.entity.getValue(fieldName);

    if (this.props.editMode) {
      return (
        <Checkbox
          name={fieldName}
          value={fieldValue}
          label={field.title}
          onChange={this._handleCheck}
          checked={fieldValue}
        />
      );
    } else {
      let valLabel = (fieldValue) ? "Yes" : "No";
      return (
        <div>
          <div className={theme.entityFormFieldLabel}>{field.title}</div>
          <div className={theme.entityFormFieldValue}>{valLabel}</div>
        </div>
      );
    }
  },

  /**
   * Handle value change
   */
  _handleCheck: function (evt, isInputChecked) {
    var val = evt.target.value;
    log.info("Setting", this.props.elementNode.getAttribute('name'), "to", isInputChecked);
    this.props.entity.setValue(this.props.elementNode.getAttribute('name'), isInputChecked);
    this.props.onChange(this.props.entity.getData());
  }
});

export default BoolField;
