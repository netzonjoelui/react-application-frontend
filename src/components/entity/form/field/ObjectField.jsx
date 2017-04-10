import React from 'react';
import theme from '../entity-form.scss';
import FormNodeModel from '../../../../models/entity/form/FormNode';
import EntityModel from '../../../../models/entity/Entity';
import ObjectSelect from '../../ObjectSelect';
import EntityObjectTypeDropdownContainer from '../../../../containers/EntityObjectTypeDropdownContainer';

/**
 * Handle displaying an object refrence
 */
class ObjectField extends React.Component {
  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      fieldSubType: null
    }
  };

  /**
   * Render the component
   */
  render() {
    const entity = this.props.entity;
    const fieldName = this.props.elementNode.getAttribute('name');
    const field = entity.def.getField(fieldName);
    const fieldValue = entity.getValue(fieldName);

    let valueLabel = (fieldValue) ?
      entity.getValueName(fieldName, fieldValue) : "Not Set";

    // Handle blank labels
    if (!valueLabel && fieldValue) {
      valueLabel = fieldValue;
    }

    let fieldSubtype = field.subtype || this.state.fieldSubType;

    /*
     * If we still do not have a value for fieldSubtype but we have a fieldValue
     * Then we try to get the subtype value from the fieldValue by decoding it and use the objType as our fieldSubtype
     * The format of fieldValue is usually objType:entityId
     */
    if (!fieldSubtype && fieldValue) {
      const objRef = entity.decodeObjRef(fieldValue);
      fieldSubtype = objRef.objType || null;
    }

    let displayObjTypesDropdown = null;

    // If this field does NOT have a subtype, then load the definitions and let the user pick a subtype
    if (!fieldSubtype) {
      displayObjTypesDropdown = (
        <div className={theme.entityFormObjectTypeDropdown}>
          <EntityObjectTypeDropdownContainer
            objType={fieldSubtype}
            onChange={this._handleDefintionsMenuSelect}
          />
        </div>
      );
    }

    if (this.props.editMode) {
      return (
        <div>
          <div className={theme.entityFormFieldLabel}>
            {field.title}
          </div>
          {displayObjTypesDropdown}
          <div className={theme.entityFormFieldValueObject}>
            <ObjectSelect
              onChange={this._handleSetValue}
              objType={entity.def.objType}
              field={field}
              subtype={fieldSubtype}
              value={fieldValue}
              label={valueLabel}
            />
          </div>
        </div>
      );
    } else {
      // Only display the field if a value exists
      if (valueLabel != 'Not Set') {
        return (
          <div>
            <div className={theme.entityFormFieldLabel}>
              {field.title}
            </div>
            <div className={theme.entityFormFieldValue}>
              {valueLabel}
            </div>
          </div>
        );
      } else {
        return (<div />);
      }
    }
  };


  /**
   * Set the value of the entity which will trigger an onchange
   *
   * When the entity controller triggers an onChange, it will set the value here
   *
   * @param {int} oid The unique id of the entity selected
   * @param {string} title The human readable title of the entity selected
   * @private
   */
  _handleSetValue = (oid, title) => {
    const fieldName = this.props.elementNode.getAttribute('name');
    const entity = this.props.entity;

    entity.setValue(fieldName, oid, title);
    this.props.onChange(entity.getData());
  };

  /**
   * Callback used to handle the selecting of definition
   *
   * @param {string} objType The object type that was selected
   * @private
   */
  _handleDefintionsMenuSelect = (objType) => {
    this.setState({fieldSubType: objType});
  }
}

/**
 * Expected props
 */
ObjectField.propTypes = {
  /**
   * Current element node level
   *
   * @type {FormNode}
   */
  elementNode: React.PropTypes.instanceOf(FormNodeModel).isRequired,

  /**
   * Entity being edited
   *
   * @type {Entity}
   */
  entity: React.PropTypes.instanceOf(EntityModel),

  /**
   * Flag indicating if we are in edit mode or view mode
   *
   * @type {bool}
   */
  editMode: React.PropTypes.bool,

  /**
   * Handle when a value changes
   */
  onChange: React.PropTypes.func,
};

export default ObjectField;
