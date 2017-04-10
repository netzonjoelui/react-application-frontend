/**
 * Handle a check condition type action
 *
 * All actions have a 'data' field, which is just a JSON encoded string
 * used by the backend when executing the action.
 *
 * When the ActionDetails plugin is rendered it will decode or parse the string
 * and pass it down to the type component.
 *
 */
import React from 'react';
import theme from '../../../../entity/form/entity-form.scss';
import EntityConditions from '../../../Conditions';
import Where from '../../../../../models/entity/Where';


/**
 * Manage a workflow action that checks the condition(s) first before executing a workflow
 */
const CheckCondition = (props) => {
  const workflowActionData = props.data;
  let conditions = [];
  let conditionDisplay = [];
  let workflowConditionsData = [];

  if (workflowActionData.conditions) {
    // Map thru data.conditions to get the saved conditions
    for (let idx in workflowActionData.conditions) {
      let condition = workflowActionData.conditions[idx];
      let where = new Where();

      where.fromData(condition);
      conditions.push(where);
    }
  }

  return (
    <EntityConditions
      objType={props.objType}
      conditions={conditions}
      onChange={(conditions) => {
        for (let idx in conditions) {
          workflowConditionsData.push(conditions[idx].toData());
        }

        props.onChange({ conditions: workflowConditionsData });
      }}
    />
  );
}

/**
 * The props that will be used in the check condition workflow action
 */
CheckCondition.propTypes = {
  /**
   * Callback to call when a user makes changes to conditions
   */
  onChange: React.PropTypes.func.isRequired,

  /**
   * The object type we are managing conditions for
   */
  objType: React.PropTypes.string.isRequired,

  /**
   * Data from the workflow action - decoded JSON object
   */
  data: React.PropTypes.object
}

export default CheckCondition;
