import React from 'react';
import { connect } from 'react-redux';
import { fetchEntity, fetchEntityDefinition, saveEntity, deleteEntity } from '../actions/entity';
import { getActionsForObjType, actionModes } from '../models/entity/userActions';
import { deviceSizes } from '../models/device';
import EntityDefinition from '../models/entity/Definition';
import Entity from '../models/entity/Entity';
import EntityComponent from '../components/entity/Entity';
import Form from '../models/entity/Form';
import PageModalComponent from '../components/PageModal';
import EntityUserActionContainer from './EntityUserActionContainer';

// Chamel controls
import LinearProgress from 'chamel/lib/Progress/LinearProgress';

/**
 * Main application class for netric
 */
class EntityContainer extends React.Component {

  /**
   * Define propTypes that this component
   */
  static propTypes = {

    /**
     * Required. The object type we are working on
     *
     * @var {string}
     */
    objType: React.PropTypes.string.isRequired,

    /**
     * The id of the entity we are working on
     *
     * @var {int}
     */
    id: React.PropTypes.string,

    /**
     * Callback function that is called when fetching an entity
     *
     * @var {function}
     */
    onFetchEntity: React.PropTypes.func.isRequired,

    /**
     * Callback function that is called when fetching an entity definition
     *
     * @var {function}
     */
    onFetchEntityDefinition: React.PropTypes.func.isRequired,

    /**
     * Callback function that is called when saving an entity
     *
     * @var {function}
     */
    onSaveEntity: React.PropTypes.func.isRequired,

    /**
     * Callback function that is called when deliting an entity
     *
     * @var {function}
     */
    onDeleteEntity: React.PropTypes.func.isRequired,

    /**
     * Callback function that is called when closing the entity
     *
     * @var {function}
     */
    onClose: React.PropTypes.func,

    /**
     * The entity data that was loaded from the entity state
     *
     * @var {object}
     */
    data: React.PropTypes.object,

    /**
     * The entity definition data that was loaded from the entity definition state
     *
     * @var {object}
     */
    definitionData: React.PropTypes.object,

    /**
     * Collection of data from the object reference.
     *
     * If the entity browser is loaded from an entity form, then we need the referenced data
     *  so we will know what is the referenced object type and the referenced field we are dealing with.
     *
     * Sample initEntityData structure
     * {
     *  objType: customer,
     *  contact_id: 1,
     *  contact_id_fval: 'test contact'
     * }
     */
    initEntityData: React.PropTypes.object,

    /**
     * Flag that determine that entity container will be displayed in a page modal
     *
     * @var {Bool}
     */
    usePageModalFlag: React.PropTypes.bool,

    /**
     * Flag that will force the entity component to be in the state of edit mode
     *
     * @var {Bool}
     */
    forceEditModeFlag: React.PropTypes.bool,

    /**
     * The current device size
     */
    deviceSize: React.PropTypes.number,

    /**
     * Current path from react router
     */
    currentRoutePath: React.PropTypes.string,
  };

  /**
   * Set some sane defaults
   */
  static defaultProps = {
    onClose: null,
    forceEditModeFlag: false,
    currentRoutePath: ""
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      editedData: {}, // unsaved edits
      userActions: [],
      isDirty: false,
      mode: (!this.props.forceEditModeFlag && this.props.id) ? actionModes.view : actionModes.edit,
      showDialogPopup: false,
    };
  }

  /**
   * Entered the DOM
   */
  componentDidMount() {
    if (!this.props.isFetching && this.props.id) {
      this.props.onFetchEntity(this.props.objType, this.props.id);
    } else if (!this.props.isFetching && this.props.definitionData === null) {
      // If loading a new entity then we should at least get the definition
      this.props.onFetchEntityDefinition(this.props.objType);
    }
    // TODO: We should check here if we need to update the definition (10 minutes?)

    // Get the entity model to check if we need to update the f_seen field
    let entity = this.getEntityFromData();
    if (entity && entity.id && entity.getValue("f_seen") === false) {
      entity.setValue("f_seen", true);
      this.props.onSaveEntity(entity);
    }
  }

  /**
   * About to receive new properties
   *
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    // If we just received a new id then change to view mode
    if (nextProps.id && !this.props.id) {
      this.setState({mode: actionModes.view});
    }
  }

  /**
   * Render the entity container
   *
   * @returns {Object}
   */
  render() {
    // Get an entity objet from props data and state edited data
    let entity = this.getEntityFromData();

    if (!entity) {
      return (
        <div>
          <LinearProgress mode={"indeterminate"}/>
          <div>Loading...</div>
        </div>
      );
    }

    // Get actions the user can perform
    const actions = getActionsForObjType(this.props.objType, this.state.mode);
    // Create an instance of Form Model
    let form = new Form();

    // Select the right form based on the current device size
    let formUiXML = entity.def.forms.small;
    switch (this.props.deviceSize) {
      case deviceSizes.xlarge:
        formUiXML = entity.def.forms.large;
        break;
      case deviceSizes.large:
        formUiXML = entity.def.forms.large;
        break;
      case deviceSizes.medium:
        formUiXML = entity.def.forms.medium;
        break;
      case deviceSizes.small:
        formUiXML = entity.def.forms.small;
        break;
    }
    const UiXmlForm = '<form>' + formUiXML + '</form>';

    // Parse the UiXmlForm and create the from element nodes
    const formElementNode = form.fromXml(UiXmlForm);

    let displayEntityComponent = (
      <div>
        <EntityComponent
          entity={entity}
          toolbarMode={this.props.toolbarMode}
          actions={actions}
          dirty={this.state.isDirty}
          formElementNode={formElementNode}
          onChange={this.updateEntityValue}
          onCancelChanges={this.clearChanges}
          onClose={this.props.onClose}
          deviceSize={this.props.deviceSize}
          editMode={(this.state.mode === actionModes.edit)}
          onPerformAction={(actionName) => {this.performAction(actionName);}}
          initEntityData={this.props.initEntityData}
          currentRoutePath={this.props.currentRoutePath}
        />
      </div>
    );

    if (this.props.usePageModalFlag) {
      return (
        <PageModalComponent
          deviceSize={this.props.deviceSize}
          onCancel={this.props.onClose}
          hideAppbarFlag={true}>
          {displayEntityComponent}
        </PageModalComponent>
      );
    }

    // Add user-generated actions to be performed
    let userActionElments = this.state.userActions.map((actionName, index) => {
      return (
        <EntityUserActionContainer
          key={index}
          actionName={actionName}
          entityIds={[entity.id]}
          entityNames={[entity.getName()]}
          objType={this.props.objType}
          onCompleted={() => {
            this.removeUserAction(actionName);
          }}
        />
      );
    });

    // Show dialog to confirm remove action was intentional
    let displayDeleteConfirmation = '';
    if (this.state.showDialogPopup === true) {
        displayDeleteConfirmation = (
          <PageModalComponent
            deviceSize={this.props.deviceSize}
            title={"Delete Task"}
            continueLabel={"Delete"}
            onContinue={() => { this.performDelete()}}
            onCancel={() => { this.onRemoveConfirmCancel()}}>
            <div onClick={this.performDelete}>
              {"Are you sure you want to delete this " +  entity.getName() + " task?"}
            </div>
        </PageModalComponent>
      );
    }

    return (
      <div>
        {displayEntityComponent}
        {userActionElments}
        {displayDeleteConfirmation}
      </div>
    );
  }

  /**
   * Reset the value of state showDialogPopup when PageModalComponent cancel
   */
  onRemoveConfirmCancel() {
    this.setState({showDialogPopup: false});
  }

  /**
   * Perform the remove action and close the entityComponent when the action is deleted
   */
  performDelete() {
    if (this.state.showDialogPopup === true) {
      this.performAction('remove');
      this.props.onClose();
    }
  }

  /**
   * Create an entity model from the raw data
   *
   * @returns {Entity}
   */
  getEntityFromData = () => {
    // Make sure we have an entity definition
    if (this.props.definitionData) {
      let definition = new EntityDefinition(this.props.definitionData);

      // Combine the actual entity data with any edits made
      let entityData = Object.assign({}, this.props.data, this.state.editedData);

      // If we have an empty object for data (new entity), add obj_type so Entity knows it is valid
      if (!entityData.obj_type) {
        entityData.obj_type = definition.objType
      }

      return new Entity(definition, entityData);
    } else {
      return null;
    }
  };

  /**
   * Hold temporary edits until the user saves changes
   *
   * @param {Object} data New data to set
   *
   */
  updateEntityValue = (data) => {
    this.setState({
      editedData: data,
      isDirty: true
    });
  };

  /**
   * Revert back to original entity value
   */
  clearChanges = () => {
    // All we have to do is remove the state
    this.setState({
      editedData: {}
    });
  };

  /**
   * Save this entity
   */
  saveEntity = () => {
    // Create the entity model for saving
    let entity = this.getEntityFromData();
    this.props.onSaveEntity(entity);

    if (this.props.onClose) {
      if (!this.props.id || this.props.usePageModalFlag) {
        this.props.onClose();
      }
    }
  };

  /**
   * Add an action to the queue of actions to be processed
   *
   * @param {string} actionName The name of the action being performed
   */
  performAction = (actionName) => {
    switch (actionName) {
      case 'edit':
        this.setState({mode: actionModes.edit});
        break;
      case 'view':
        this.setState({mode: actionModes.view});
        break;
      case 'save':
        this.saveEntity();
        this.setState({mode: actionModes.view, isDirty: false});
        break;
      case 'remove':
          if (!this.state.showDialogPopup) {
            // Before we add the 'remove' action we should first ask the user to make sure they did not click it by accident
            this.setState({showDialogPopup: true});
          } else {
            // Add a remove action
            this.setState({userActions: ['remove']});
          }
          break;
      default:
        let userActions = this.state.userActions.slice(0);
        userActions.push(actionName);
        this.setState({userActions});
        break;
    }
  };

  /**
   * Removes an action in the queue maybe because it has already been performed
   *
   * @param {string} actionName The name of the action tha will be removed
   */
  removeUserAction = (actionName) => {
    let userActions = this.state.userActions.slice(0);

    for (let idx in userActions) {
      if (userActions[idx] === actionName) {
        userActions.splice(idx, 1);
      }
    }

    this.setState({userActions});
  }
}

/**
 * Map properties in the application store state to module properties
 *
 * @param {Object} state The current application state
 * @param {Object} ownProps Properties that were passed to this component
 * @returns {{todos: Array}}
 */
const mapStateToProps = (state, ownProps) => {
  const entityState = state.entity;
  const definitionData = entityState.definitions[ownProps.objType] || null;

  // Get entity data to pass to container
  let entityData = null;
  if (ownProps.id && entityState.entities[ownProps.objType + "-" + ownProps.id]) {
    entityData = entityState.entities[ownProps.objType + "-" + ownProps.id];
  }

  // If initial entity data is provided, then we need to merge with the the current entity data saved in the state
  if (ownProps.initEntityData) {
    entityData = Object.assign({}, entityData, ownProps.initEntityData);
  }

  return {
    isFetching: entityState.isFetching,
    data: entityData,
    definitionData: definitionData,
    deviceSize: state.device.size
  }
};

/**
 * Map container callbacks to dispatches into the redux state
 *
 * @param {Function} dispatch Callback to dispatch an action to the store
 * @returns {{onFetchModule: (function())}}
 */
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchEntity: (objType, id) => {
      // Retrieve the entity from the server (or get updates if cached)
      dispatch(fetchEntity(objType, id));
    },
    onFetchEntityDefinition: (objType) => {
      // Get the entity definition from the server
      dispatch(fetchEntityDefinition(objType));
    },
    onSaveEntity: (entity) => {
      // Save the entity into the server
      dispatch(saveEntity(entity));
    },
    onDeleteEntity: (entity) => {
      dispatch(deleteEntity(entity.def.objType, entity.id));
    }
  }
};

// Connect this container to listen to redux
const VisibleEntityContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityContainer);

export default VisibleEntityContainer;
