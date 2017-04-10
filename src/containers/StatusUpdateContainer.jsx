import React from 'react';
import theme from '../components/_entity-comments.scss';
import { connect } from 'react-redux';
import { fetchEntityDefinition, saveEntity } from '../actions/entity';
import { deviceSizes } from '../models/device';
import EntityBrowserContainer from './EntityBrowserContainer';
import EntityDefinition from '../models/entity/Definition';
import Entity from '../models/entity/Entity';
import Where from '../models/entity/Where';
import LinearProgress from 'chamel/lib/Progress/LinearProgress';
import log from '../log';

// Chamel Controls
import IconButton from 'chamel/lib/Button/IconButton';
import TextField from 'chamel/lib/Input/TextField';

// Chamel Icons
import SendIcon from 'chamel/lib/icons/font/SendIcon';

/**
 * Set the status update's ObjType as "comment"
 *
 * Please take note that status update is added as a comment only as pure string value
 * Unlike comments that we can attach files to a comment.
 * @type {string}
 */
const STATUS_UPDATE_OBJTYPE = "comment";
const CURRENT_USER_ID = -3; // -3 is 'current_user' on the backend

/**
 * Main application class for entity status updates
 */
class StatusUpdateContainer extends React.Component {

  /**
   * Define propTypes that this component
   */
  static propTypes = {
    /**
     * Callback function that is called when fetching an entity definition
     *
     * @var {function}
     */
    onFetchEntityDefinition: React.PropTypes.func.isRequired,

    /**
     * Required. The object type of referenced entity that is using the comment module
     *
     * @var {string}
     */
    referencedObjType: React.PropTypes.string.isRequired,

    /**
     * The Id of referenced entity that is using the comment module
     *
     * @var {string}
     */
    referencedEntityId: React.PropTypes.string,

    /**
     * The current device size
     *
     * @var {int}
     */
    deviceSize: React.PropTypes.number,

    /**
     * The entity definition data that was loaded from the entity definition state
     *
     * The defintionData object is set by the redux connector
     * @var {object}
     */
    definitionData: React.PropTypes.object
  };

  /**
   * Set default values
   */
  static defaultProps = {
    referencedEntityId: null,
    definitionData: null
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
  }

  /**
   * Entered the DOM
   */
  componentDidMount() {
    if (this.props.definitionData === null) {
      this.props.onFetchEntityDefinition(STATUS_UPDATE_OBJTYPE);
    }
  }

  /**
   * Render the components that will be used to add a new status update
   *
   * @returns {Object}
   */
  render() {
    // If the entity definition has not loaded then just show a loader
    if (!this.props.definitionData) {
      return (
        <div>
          <LinearProgress mode={"indeterminate"}/>
          <div>{"Loading..."}</div>
        </div>
      );
    }

    let filter = new Where('associations');
    filter.equalTo(
      this.props.referencedObjType +
      ":" + this.props.referencedEntityId
    );

    return (
      <div className={theme.entityComments}>
        <div className={theme.entityCommentsForm}>
          <div className={theme.entityCommentsFormCenter}>
            <TextField ref='statusInput' hintText='Add Status' multiLine={true}/>
          </div>
          <div className={theme.entityCommentsFormRight}>
            <IconButton
              onClick={this.handleAddStatusUpdate}>
              <SendIcon />
            </IconButton>
          </div>
        </div>
        <div>
          <EntityBrowserContainer
            mode={"inline"}
            conditions={[filter]}
            objType={"activity"}
            hideToolbar={true}
          />
        </div>
      </div>
    );
  }

  /**
   * Add a new status update
   */
  handleAddStatusUpdate = () => {

    const status = this.refs.statusInput.getValue();

    // Do not save an empty status
    if (!status) {
      return;
    }

    // Create a new status update entity.
    let statusUpdateEntity = this.createNewStatusUpdateEntity();

    // If statusUpdateEntity is null, then this.props.definitionData is not set and we should log an error
    if (statusUpdateEntity === null) {
      log.error("Cant add a status update because props.definitionData is not set.");
      return;
    }

    // Set the status update value
    statusUpdateEntity.setValue("comment", status);
    this.props.onSaveEntity(statusUpdateEntity);

    this.refs.statusInput.setValue("");
    this.setState({statusCollectionIsDirty: true});
  };

  /**
   * Create an entity model for status update
   *
   * @returns {Entity}
   */
  createNewStatusUpdateEntity = () => {

    let statusUpdateEntity = null;

    // Make sure we have an entity definition and statusUpdateEntity is not yet created/stored in the state
    if (this.props.definitionData) {
      let definition = new EntityDefinition(this.props.definitionData);

      // Create the new entity
      statusUpdateEntity = new Entity(definition, {obj_type: STATUS_UPDATE_OBJTYPE});

      statusUpdateEntity.setValue("owner_id", CURRENT_USER_ID);
      statusUpdateEntity.setValue("obj_reference", this.props.referencedObjType + ':' + this.props.referencedEntityId);
    }

    return statusUpdateEntity;
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
  return {
    deviceSize: state.device.size,
    definitionData: state.entity.definitions[STATUS_UPDATE_OBJTYPE] || null
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
    onFetchEntityDefinition: (objType) => {
      // Get the entity definition from the server
      dispatch(fetchEntityDefinition(objType));
    },
    onSaveEntity: (entity) => {
      // Get the entity definition from the server
      dispatch(saveEntity(entity));
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusUpdateContainer);
