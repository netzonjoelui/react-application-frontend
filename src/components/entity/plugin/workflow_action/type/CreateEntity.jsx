import React from 'react';
import entityLoader from '../../../../../models/entity/entityLoader';
import theme from '../../../../entity/form/entity-form.scss';
import FieldInput from '../../../FieldInput';
import EntityObjectTypeDropdownContainer from '../../../../../containers/EntityObjectTypeDropdownContainer';
import EntityFieldValuesContainer from '../../../../../containers/EntityFieldValuesContainer';
import Field from '../../../../../models/entity/definition/Field';

/**
 * Manage an action that creates a new entity when executed
 */
const CreateEntity = (props) => {
  const workflowActionData = props.data;
  const objType = workflowActionData.obj_type || null;
  let definitionsDropDown = null;
  let entityFieldsDisplay = [];

  definitionsDropDown = (
    <EntityObjectTypeDropdownContainer
      objType={objType}
      onChange={(objType) => {
          props.onChange({obj_type: objType});
       }}
    />
  );

  // If we have an objType selected, then lets display the entity fields
  if (objType) {
    entityFieldsDisplay = (
      <EntityFieldValuesContainer
        objType={objType}
        entityData={workflowActionData}
        onChange={(property, value) => {
          let createEntityData = {};

          createEntityData[property] = value;
          props.onChange(createEntityData);
        }}
      />
    );
  }

  return (
    <div className={theme.entityFormField}>
      <div>
        <div className={theme.entityFormFieldLabel}>
          Object Type
        </div>
        <div className={theme.entityFormFieldValue}>
          {definitionsDropDown}
        </div>
      </div>
      {entityFieldsDisplay}
    </div>
  );
}

/**
 * The props that will be used in the workflow action create entity
 */
CreateEntity.propTypes = {
  /**
   * Callback to call when a user changes any properties of the action
   */
  onChange: React.PropTypes.func.isRequired,

  /**
   * Data from the action - decoded JSON object
   */
  data: React.PropTypes.object
};

export default CreateEntity;
