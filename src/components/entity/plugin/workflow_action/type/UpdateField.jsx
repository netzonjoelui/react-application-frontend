/**
 * Handle an update field type action
 *
 * All actions have a 'data' field, which is just a JSON encoded string
 * used by the backend when executing the action.
 *
 * When the ActionDetails plugin is rendered it will decode or parse the string
 * and pass it down to the type component.
 *
 */
import React from 'react';
import theme from '../../../form/entity-form.scss';
import Field from '../../../../../models/entity/definition/Field';
import EntityFieldsDropDownContainer from '../../../../../containers/EntityFieldsDropDownContainer';
import FieldInput from '../../../FieldInput';

/**
 * Manage a workflow action that updates an entity field when executed
 */
const UpdateField = (props) => {
  const workflowActionData = props.data;
  const updateField = workflowActionData.update_field || null;
  const updateValue = workflowActionData.update_value || null;

  // Set the field input
  let inputComponent = null;
  let connectionToString = null;

  if (updateField) {
    inputComponent = (
      <FieldInput
        objType={props.objType}
        fieldName={updateField}
        value={updateValue}
        onChange={(fieldName, fieldValue, opt_fieldValueLabel) => {

          props.onChange({update_value: opt_fieldValueLabel || null});
        }}
      />
    );

    connectionToString = " to ";
  }

  return (
    <div className={theme.entityFormField}>
      <div className={theme.entityFormFieldLabel}>
        {'Change'}
      </div>
      <div className={theme.entityFormFieldValue}>
        <div className={theme.entityFormFieldInlineBlock}>
          <EntityFieldsDropDownContainer
            objType={props.objType}
            onChange={(fieldName) => {
              if (fieldName != workflowActionData.update_field) {
                  props.onChange({
                    update_value: "",
                    update_field: fieldName,
                  });
              }
            }}
            showReadOnlyFields={false}
            hideFieldTypes={[Field.types.objectMulti]}
            selectedField={updateField}
          />
        </div>
        <div className={theme.entityFormFieldInlineBlock}>
          {connectionToString}
        </div>
        <div className={theme.entityFormFieldInlineBlock}>
          {inputComponent}
        </div>
      </div>
    </div>
  );
}

/**
 * The props that will be used in the workflow action update field
 */
UpdateField.propTypes = {
  /**
   * Callback to call when a user changes any properties of the action
   */
  onChange: React.PropTypes.func.isRequired,

  /**
   * Data from the action - decoded JSON object
   */
  data: React.PropTypes.object
};

export default UpdateField;
