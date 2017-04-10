import React from 'react';
import Where from '../models/entity/Where';
import EntityBrowserContainer from '../containers/EntityBrowserContainer';
import EntityContainer from '../containers/EntityContainer';

// Chamel Controls
import GridContainer from 'chamel/lib/Grid/Container';
import RaisedButton from 'chamel/lib/Button/RaisedButton';

/**
 * Component that handles the management of workflow action.
 * This will either display the workflow action list or display the workflow action details
 */
class WorkflowAction extends React.Component {
  /**
   * Set expected property types
   */
  static propTypes = {
    /**
     * The id of the workflow we are currently working with
     */
    workflowId: React.PropTypes.string,

    /**
     * The parent id of the workflow.
     */
    parentWorkflowActionId: React.PropTypes.string
  };

  /**
   * Set some sane defaults
   */
  static defaultProps = {
    workflowId: null,
    parentWorkflowActionId: ""
  };

  /**
   * Class constructor
   *
   * @param {Object} props Properties to send to the render function
   */
  constructor(props) {
    // Call parent constructor
    super(props);

    this.state = {
      showWorkflowActionFormFlag: false,
      workflowActionId: null,
      createNewWorkflowActionParentId: null
    };
  };

  /**
   * Render the workflow action
   *
   * @returns {Object}
   */
  render() {
    if (!this.props.workflowId) {
      return <div>Save changes to the workflow before modifying actions</div>;
    }

    const objType = "workflow_action";
    let displayWorkFlowActionForm = null;

    if (this.state.showWorkflowActionFormFlag) {
      displayWorkFlowActionForm = (
        <EntityContainer
          usePageModalFlag={true}
          forceEditModeFlag={true}
          id={this.state.workflowActionId}
          objType={objType}
          onClose={() => {
            this.setState({
              showWorkflowActionFormFlag: false,
              workflowActionId: null
            });
          }}
          initEntityData={{
            workflow_id: this.props.workflowId,
            parent_action_id: this.state.createNewWorkflowActionParentId
          }}
        />
      )
    }

    // Add filters
    let conditions = [];

    // Add filter for workflow id
    let whereCond = new Where("workflow_id");
    whereCond.equalTo(this.props.workflowId);
    conditions.push(whereCond);

    // Add filter for action id
    let whereActCond = new Where("parent_action_id");
    whereActCond.equalTo(this.props.parentWorkflowActionId);
    conditions.push(whereActCond);

    return (
      <div>
        <GridContainer fluid>
          {displayWorkFlowActionForm}
          <EntityBrowserContainer
            objType={objType}
            conditions={conditions}
            hideToolbar={true}
            hideNoItemsMessage={true}
            onSelectEntity={this.handleSelectEntity}
            onCreateNewEntity={this.handleCreateNewChildWorkflowAction}
          />
        </GridContainer>
      </div>
    );
  };

  /**
   * Handles the selecting of workflow action and displaying the workflow action form
   *
   * @param {string} objType The type of entity being selected
   * @param {string} entityId The id of the entity being selected
   */
  handleSelectEntity = (objType, entityId) => {
    this.setState({
      showWorkflowActionFormFlag: true,
      workflowActionId: entityId
    })
  };

  /**
   * Handles the creating of new child workflow action entity
   *
   * @param {string} parentActionId The entity id of the parent workflow action
   */
  handleCreateNewChildWorkflowAction = (parentActionId) => {
    this.setState({
      showWorkflowActionFormFlag: true,
      workflowActionId: null,
      createNewWorkflowActionParentId: parentActionId
    });
  };
}

export default WorkflowAction;
