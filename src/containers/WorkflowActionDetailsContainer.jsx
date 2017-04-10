import React from 'react';
import { connect } from 'react-redux';
import log from '../log';
import { fetchEntityDefinition } from '../actions/entity';
import DefinitionModel from '../models/entity/Definition';


// Workflow action types
const _actionTypes = {
  approval: require("../components/entity/plugin/workflow_action/type/RequestApproval.jsx"),
  assign: require("../components/entity/plugin/workflow_action/type/Assign.jsx"),
  check_condition: require("../components/entity/plugin/workflow_action/type/CheckCondition.jsx"),
  create_entity: require("../components/entity/plugin/workflow_action/type/CreateEntity.jsx"),
  send_email: require("../components/entity/plugin/workflow_action/type/SendEmail.jsx"),
  start_workflow: null,
  update_field: require("../components/entity/plugin/workflow_action/type/UpdateField.jsx"),
  wait_condition: require("../components/entity/plugin/workflow_action/type/WaitCondition.jsx"),
  webhook: require("../components/entity/plugin/workflow_action/type/WebHook.jsx"),
};

/**
 * Displays the different types of workflow actions based on the props.entityTypeName provided
 */
class WorkflowActionDetailsContainer extends React.Component {
  /**
   * Set expected property types
   */
  static propTypes = {

    /**
     * The entity id of the workflow we are currently working with
     *
     * @type {string}
     */
    entityWorkflowId: React.PropTypes.string.isRequired,

    /**
     * Determine which type of workflow action to display
     *
     * @type {string}
     */
    entityTypeName: React.PropTypes.string,

    /**
     * The json encoded entity data that is saved in workflow action entity
     *
     * @type {string}
     */
    workflowActionData: React.PropTypes.string,

    /**
     * Callback function that is called when workflow action data is changed
     *
     * @type {func}
     */
    onChange: React.PropTypes.func
  };

  /**
   * Set some sane defaults
   */
  static defaultProps = {
    entityTypeName: null,
    workflowActionData: null
  };

  /**
   * Class constructor
   *
   * @param {Object} props Properties to send to the render function
   */
  constructor(props) {
    // Call parent constructor
    super(props);

    this.state = {};
  };

  /**
   * Entered the DOM
   */
  componentDidMount() {
    if (this.props.definitionData === null) {
      this.props.onFetchEntityDefinition(this.props.workflowData.object_type);
    }
  }

  /**
   * Render the workflow action
   *
   * @returns {Object}
   */
  render() {

    // If no workflow is provided, then display a message and log an error.
    if (!this.props.workflowData) {
      return (
        <div>No workflow provided.</div>
      );

      log.error("No workflow provided");
    }

    // If no entity type name is provided, then just return an empty div
    if (!this.props.entityTypeName) {
      return (
        <div/>
      );
    }

    // If we have a null value of type_name (newly created workflow action) then we set the default value to approval
    const workflowActionType = this.props.entityTypeName;
    const objTypeActedOn = this.props.workflowData.object_type;
    let parsedWorkflowActionData = {};

    // Set the action data
    if (this.props.workflowActionData) {
      parsedWorkflowActionData = JSON.parse(this.props.workflowActionData);
    }

    let entityDefinitionFields = null
    if (this.props.definitionData) {
      const entityDefinition = new DefinitionModel(this.props.definitionData);
      entityDefinitionFields = entityDefinition.getFields();
    }

    // Crete the action type component that sets the data
    let typeComponent = null;
    if (_actionTypes[workflowActionType]) {
      typeComponent = React.createElement(_actionTypes[workflowActionType], {
        entityDefinitionFields,
        data: parsedWorkflowActionData,
        objType: objTypeActedOn,
        onChange: (changedworkflowActionData) => {

          const updatedworkflowActionData = Object.assign({}, parsedWorkflowActionData, changedworkflowActionData);
          this.props.onChange(updatedworkflowActionData);
        }
      });
    } else {
      log.error("No editor plugin found for action type " + workflowActionType);
    }

    return (
      <div>
        {typeComponent}
      </div>
    );

  };
}

/**
 * Map properties in the application store state to module properties
 *
 * @param {Object} state The current application state
 * @param {Object} ownProps Properties that were passed to this component
 * @returns {Object}
 */
const mapStateToProps = (state, ownProps) => {
  const entityState = state.entity;

  // Get entity data to pass to container
  const workflowObjType = "workflow";
  let workflowData = {};

  // Check if the workflow is existing in the state.
  if (entityState.entities[workflowObjType + "-" + ownProps.entityWorkflowId]) {
    workflowData = entityState.entities[workflowObjType + "-" + ownProps.entityWorkflowId];
  }

  const definitionData = entityState.definitions[workflowData.object_type] || null;

  return {
    workflowData,
    definitionData,
    deviceSize: state.device.size,
  }
};

/**
 * Map container callbacks to dispatches into the redux state
 *
 * @param {Function} dispatch Callback to dispatch an action to the store
 * @returns {{onDispatchAction: (function())}}
 */
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchEntityDefinition: (objType) => {
      // Get the entity definition from the server
      dispatch(fetchEntityDefinition(objType));
    }
  }
};

// Connect this container to listen to redux
export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowActionDetailsContainer);
