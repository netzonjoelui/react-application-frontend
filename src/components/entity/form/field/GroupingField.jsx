/**
 * Grouping field component
 */
import React from 'react';
import GroupingChip from '../../GroupingChip';
import EntityGroupingSelectContainer from '../../../../containers/EntityGroupingSelectContainer';
import EntityModel from '../../../../models/entity/Entity';
import FormNodeModel from '../../../../models/entity/form/FormNode';

/**
 * Handles the displaying of entity field that has the field type of fkey/fkeyMulti or objectMulti
 */
const GroupingField = (props) => {
  const elementNode = props.elementNode;
  const fieldName = elementNode.getAttribute('name');
  const field = props.entity.def.getField(fieldName);
  const fieldValues = props.entity.getValueName(fieldName);

  let chips = [];
  let selectedValue = null;
  let selectedValueName = null;

  /*
   * If field.type is either objectMulti or fkeyMulti then we need to loop thru the saved value
   * and display then inside the <GroupingChip>
   */
  switch (field.type) {
    case field.types.objectMulti:
    case field.types.fkeyMulti:
      let chipProps = null;

      if (props.editMode) {
        chipProps = {
          onRemove: (id, name) => {
            props.entity.remMultiValue(props.elementNode.getAttribute('name'), id);
          }
        }
      }

      // If the fieldValues is an array then lets loop thru it to get the actual values
      if (Array.isArray(fieldValues)) {
        for (let idx in fieldValues) {

          // Setup the GroupingChip
          chips.push(
            <GroupingChip
              {...chipProps}
              key={idx}
              id={parseInt(fieldValues[idx].key)}
              name={fieldValues[idx].value}
            />
          );
        }
      } else if (typeof fieldValues === 'object') {

        for (let idx in fieldValues) {

          /*
           * If fieldValues is an object, then let's use the idx as the id
           *  and use the fieldValue[idx] as the name
           */
          chips.push(
            <GroupingChip
              {...chipProps}
              key={idx}
              id={parseInt(idx)}
              name={fieldValues[idx]}
            />
          );
        }
      }
      break;
    default:

      // Here we will handle fields that has fkey or object field.type
      if (fieldValues) {
        selectedValue = props.entity.getValue(fieldName);
        selectedValueName = fieldValues[selectedValue];
      }
      break;
  }

  let selectElement = null;

  if (props.editMode) {

    let addLabel = "Set " + field.title;

    if (field.type == field.types.fkeyMulti) {
      addLabel = "Add " + field.title;
    }

    selectElement = (
      <EntityGroupingSelectContainer
        objType={props.entity.def.objType}
        fieldName={fieldName}
        onChange={(id, name) => {
          
          /*
           * If field.type is either objectMulti or fkeyMulti then we need to use entity.addMultiValue
           * Since multi fields can save multiple values
           */
          if(field.type == field.types.objectMulti || field.type == field.types.fkeyMulti) {
              props.entity.addMultiValue(fieldName, id, name);
          } else {
              props.entity.setValue(fieldName, id, name);
          }
          
          props.onChange(props.entity.getData());
        }}
        label={addLabel}
        selectedValue={selectedValue}
      />
    );

    // If we are on edit mode, we do not need to display the selectedValueName
    selectedValueName = null;
  }

  return (
    <div>{chips} {selectedValueName} {selectElement}</div>
  );
}

/**
 * The props that will be used in the grouping field
 */
GroupingField.propTypes = {

  /**
   * Entity being edited
   *
   * @type {entity}
   */
  entity: React.PropTypes.instanceOf(EntityModel),

  /**
   * Current element node level
   *
   * @type {FormNode}
   */
  elementNode: React.PropTypes.instanceOf(FormNodeModel),

  /**
   * Callback function that is called when there's a change in the recurrence
   *
   * @type {func}
   */
  onChange: React.PropTypes.func,

  /**
   * Flag indicating if we are in edit mode or view mode
   *
   * @type {bool}
   */
  editMode: React.PropTypes.bool
};

export default GroupingField;