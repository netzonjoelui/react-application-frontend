/**
 * Numeric field input
 */
import React from 'react';
import theme from '../entity-form.scss';

import TextFieldComponent from 'chamel/lib/Input/TextField';
import DropDownMenu from 'chamel/lib/Picker/SelectField';

/**
 * Field input for numeric field types
 */
const NumberField = (props) => {
  const elementNode = props.elementNode;
  const fieldName = elementNode.getAttribute('name');
  const field = props.entity.def.getField(fieldName);
  let fieldValue = props.entity.getValue(fieldName);

  // Get the optional values of the entity field
  let optionalValuesMenuData = null;
  if (field.optionalValues) {
      optionalValuesMenuData = [];
      for (let key in field.optionalValues) {
          optionalValuesMenuData.push({
              key: key,
              text: field.optionalValues[key]
          });
      }
  }

  if (props.editMode) {

      let fieldDisplay = null;

      // If the entity field has optionalValuesMenuData, then lets display it in a dropdown
      if (optionalValuesMenuData) {
          fieldDisplay = (
              <div>
                  <div className={theme.entityFormFieldLabel}>
                      {field.title}
                  </div>
                  <div className={theme.entityFormFieldValue}>
                      <DropDownMenu
                          menuItems={optionalValuesMenuData}
                          onChange={(e, key, menuItem) => {
                            props.entity.setValue(fieldName, menuItem.key);
                            props.onChange(props.entity.getData());
                          }}/>
                  </div>
              </div>
          );
      } else {

          // If there is no optionalValuesMenuData available, then just display a text field
          fieldDisplay = (
              <TextFieldComponent
                  floatingLabelText={field.title}
                  value={fieldValue}
                  onChange={ (evt) => {
                    const value = evt.target.value;
                    const isNumeric = !isNaN(parseFloat(value)) && isFinite(value);

                    if (isNumeric) {
                      props.entity.setValue(fieldName, value);
                      props.onChange(props.entity.getData());
                    }
                  }}/>
          );
      }

      return (
          fieldDisplay
      );


  } else {

      // If there is no value then we don't need to show this field at all
      if (!fieldValue) {
          return (<div />);
      } else {

          // If there is an optionalValuesMenuData available, then lets try to find the text value of the field value
          if (optionalValuesMenuData) {

              // Loop thru optinalValues to find the corresponding text value of the field value
              optionalValuesMenuData.map(function (optVal) {
                  if (optVal.key == fieldValue) {
                      fieldValue = optVal.text;
                  }
              })
          }

          return (
              <div>
                  <div className={theme.entityFormFieldLabel}>{field.title}</div>
                  <div className={theme.entityFormFieldValue}>{fieldValue}</div>
              </div>
          );
      }
  }

};

/**
 * The props that will be used in the number field
 */
NumberField.propTypes = {

  /**
   * Entity being edited
   *
   * @type {entity}
   */
  entity: React.PropTypes.object,

  /**
   * Current element node level
   *
   * @type {FormNode}
   */
  elementNode: React.PropTypes.object.isRequired,

  /**
   * Flag indicating if we are in edit mode or view mode
   *
   * @type {bool}
   */
  editMode: React.PropTypes.bool,

  /**
   * Callback function that is called when there are any changes made to the number input field
   *
   * @type {func}
   */
  onChange: React.PropTypes.func.isRequired
};

export default NumberField;
