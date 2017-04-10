import React from 'react';
import EntityModel from '../../../../models/entity/Entity';
import WorkflowActionDetailsContainer from '../../../../containers/WorkflowActionDetailsContainer';

/**
 * Manage actions for a workflow action details
 */
const WorkflowActionDetails = (props) => {
  return (
    <WorkflowActionDetailsContainer
      entityWorkflowId={props.entity.getValue("workflow_id")}
      entityTypeName={props.entity.getValue("type_name")}
      workflowActionData={props.entity.getValue("data")}
      onChange={(updatedworkflowActionEntityData) => {
        props.entity.setValue("data", JSON.stringify(updatedworkflowActionEntityData));
        props.onChange(props.entity.getData());
      }}
    />
  );
}

/**
 * The props that will be used in the workflow action details
 */
WorkflowActionDetails.propTypes = {

  /**
   * Entity being edited
   *
   * @type {Entity}
   */
  entity: React.PropTypes.instanceOf(EntityModel),

  /**
   * Callback function that is called when workflow action data is changed
   *
   * @type {func}
   */
  onChange: React.PropTypes.func
};

export default WorkflowActionDetails;
