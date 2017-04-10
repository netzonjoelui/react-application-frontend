import React from 'react';
import EntityConditions from '../Conditions';
import WorkflowAction from '../../WorkflowAction';
import Where from '../../../models/entity/Where';
import FieldSet from './Fieldset';

/**
 * Displays the workflow conditions and workflow actions
 */
const Workflow = (props) => {

  // Get conditions from the workflow field 'conditions'
  let conditions = [];
  let conditionsString = props.entity.getValue("conditions");

  if (conditionsString) {
    let conditionsData = JSON.parse(conditionsString);

    for (let i in conditionsData) {
      let where = new Where();
      where.fromData(conditionsData[i]);
      conditions.push(where);
    }
  }


  return (
    <div>
      <FieldSet name="Conditions">
        <EntityConditions
          objType={props.entity.getValue("object_type")}
          conditions={conditions}
          onChange={(conditions) => {
            let conditionsData = [];
            for (let i in conditions) {
              conditionsData.push(conditions[i].toData());
            }

            // Convert to a string and set field value
            let conditionsString = "";
            if (conditionsData.length)
              conditionsString = JSON.stringify(conditionsData);

            // Set the entity value
            props.entity.setValue("conditions", conditionsString);
            props.onChange(props.entity.getData());
          }}
        />
      </FieldSet>
      <FieldSet name="Actions">
        <WorkflowAction
          workflowId={props.entity.id}
          parentWorkflowActionId={null}
        />
      </FieldSet>
    </div>
  );
}

/**
 * The props that will be used in the workflow
 */
Workflow.propTypes = {
  /**
   * The workflow entity that is being worked on
   */
  entity: React.PropTypes.object,

  /**
   * Callback function that is called when workflow action data is changed
   *
   * @type {func}
   */
  onChange: React.PropTypes.func
}

export default Workflow;
