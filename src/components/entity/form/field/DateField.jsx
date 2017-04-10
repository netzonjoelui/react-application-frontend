/**
 * Date field component
 */
import React from 'react';
import theme from '../entity-form.scss';

// Chamel Controls
import DatePicker from 'chamel/lib/Picker/DatePicker';

/**
 * Base level element for enetity forms
 */
var DateField = React.createClass({

  /**
   * Expected props
   */
  propTypes: {
    elementNode: React.PropTypes.object.isRequired,
    entity: React.PropTypes.object,
    editMode: React.PropTypes.bool,
    onChange: React.PropTypes.func.isRequired
  },

  render: function() {

    let elementNode = this.props.elementNode;
    let fieldName = elementNode.getAttribute('name');
    let field = this.props.entity.def.getField(fieldName);
    let fieldValue = this.props.entity.getValue(fieldName);

    if (this.props.editMode) {

        return (
          <DatePicker
            floatingLabelText={field.title}
            value={fieldValue}
            type="date"
            onChange={this._handleInputChange}
          />
        );

    } else {

      if (fieldValue) {
        return (
          <div>
            <div className={theme.entityFormFieldLabel}>
              {field.title}
            </div>
            <div className={theme.entityFormFieldLabel}>
              {this.props.entity.getTime(fieldName, true)}
            </div>
          </div>
        );
      } else {
        // Hide if no value was set
        return (<div />);
      }
    }

  },

  /**
   * Handle value change
   */
  _handleInputChange: function(evt, date) {
    this.props.entity.setValue(this.props.elementNode.getAttribute('name'), date.toLocaleString());
    this.props.onChange(this.props.entity.getData());
  }

});

export default DateField;
