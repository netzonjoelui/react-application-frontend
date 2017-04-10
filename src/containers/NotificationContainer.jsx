import React from 'react';
import { connect } from 'react-redux';
import Collection from '../models/entity/Collection';
import Definition from '../models/entity/Definition';
import Entity from '../models/entity/Entity';
import { fetchEntityDefinition, saveEntity } from '../actions/entity';
import { fetchNotifications } from '../actions/entityCollection';
import { deviceSizes } from '../models/device';

// Chamel Controls
import Snackbar from 'chamel/lib/Snackbar/Snackbar';

// Constants
const MS_PER_MINUTE = 60000;
const COLLECTION_ID = "notifications";

/**
 * Processes the notification entities to be displayed in the mobile notification container
 */
class NotificationContainer extends React.Component {

  /**
   * Define propTypes that this component
   */
  static propTypes = {

    /**
     * Callback set by redux .connect function to dispatch fetch action
     */
    onFetchNotifications: React.PropTypes.func.isRequired,

    /**
     * These are the entities that are currently saved in the redux state.
     *
     * entities are using a unique index for each record which has the format of EntityObjType:EntityId
     *
     * example:
     * entities[task:1] = Entity {objType:task, id: 1}
     */
    entities: React.PropTypes.object,

    /**
     * Contains the definitions of all entity object types
     *
     * example:
     * entityDefinitions.notification = Definition {objType: notification, title: Notifications}
     */
    entityDefinitions: React.PropTypes.object,

    /**
     * Array of notifications (raw data) loaded in the given collection
     */
    notifications: React.PropTypes.array,

    /**
     * The size of the device as defined by /Device.js
     */
    deviceSize: React.PropTypes.number,

    /**
     * This will determine when will the notification disappear
     */
    notificationTimeout: React.PropTypes.number,

    /**
     * The id of the current user
     */
    userId: React.PropTypes.string
  };

  /**
   * Set default values
   */
  static defaultProps = {
    notificationTimeout: MS_PER_MINUTE / 12, // Default notification timeout is 5 seconds
    entities: {},
    entityDefinitions: {},
    notifications: [],
    userId: null
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      currentNotificationIndex: 0
    };
  };

  /**
   * Entered the DOM
   */
  componentDidMount() {

    // If notifications is empty, then we try to fetch the notifications from the server
    if (this.props.notifications.length == 0) {
      this.props.onFetchNotifications(this.props.userId);
    }

    // Check if we have no definition or if it has been 5 minutes since last pulled
    const staleDate = (new Date()).getTime() - (5 * MS_PER_MINUTE);
    const lastUpdated = (this.props.notificationDefinitionData && this.props.notificationDefinitionData.lastFetched)
      ? this.props.notificationDefinitionData.lastFetched : 0;
    if (lastUpdated < staleDate) {
      this.props.onFetchNotificationDefinition();
    }
  };

  /**
   * Handle incoming new props
   */
  componentWillReceiveProps(nextProps) {
    this.setupFetchNotificationsTimer()
  }

  /**
   * When the DOM component has been updated
   */
  componentDidUpdate() {
    this.setupFetchNotificationsTimer()
  }

  componentWillUnmount() {
    clearTimeout(this.fetchNotificationsTimer);
  }

  /**
   * Render the module
   *
   * @returns {Object}
   */
  render() {
    const notifications = this.props.notifications;
    const currentNotificationIndex = this.state.currentNotificationIndex;

    let snackbarProps = {
      open: false,
      message: ""
    };

    /*
     * If we have not finished loading the entity definition then display nothing for now
     * Or if we do not have an userId since notifications are specific for every user
     */
    if (!this.props.entityDefinitions.notification || this.props.userId === null) {
      return (
        <div />
      );
    } else if (notifications.length > currentNotificationIndex) {

      // Set the snackbar properties
      snackbarProps = {
        timeout: this.props.notificationTimeout,
        onDismiss: () => {
          this.setState({currentNotificationIndex: currentNotificationIndex + 1});
        },
      };

      // Get the current notification based on the current index
      const notificationEntityData = notifications[currentNotificationIndex] || null;

      // Make sure that we have a valid notification entity before setting the snackbar message
      if (notificationEntityData) {

        // Create a new entity model from the notification entity data
        const notificationObjDef = new Definition(this.props.entityDefinitions.notification);
        const notificationEntity = new Entity(notificationObjDef, notificationEntityData);

        snackbarProps.open = true;
        snackbarProps.message = this.createNotificationMessage(notificationEntity);
        snackbarProps.onDismiss = () => {

          // Update the notification entity that it is already showed as mobile notification
          notificationEntity.setValue("f_shown", true);
          this.props.onUpdateNotification(notificationEntity);

          this.setState({currentNotificationIndex: currentNotificationIndex + 1});
        };
      }
    }

    return (
      <div>
        <Snackbar
          {...snackbarProps}
        />
      </div>
    );
  };

  /**
   * Uses notification entity to create a readable notification message
   *
   * @param {Entity} notificationEntity An Entity model of the notification object
   * @return {string} A readable notification message
   */
  createNotificationMessage = (notificationEntity) => {

    // Get the decoded object reference
    const objReference = notificationEntity.getValue("obj_reference");
    const decodedObjReference = notificationEntity.decodeObjRef(objReference);

    /*
     * Since props.entities object is using "ObjType-EntityId" as an index for its record
     * We need to concatenate the objType and id with a dash
     */
    const objRefEntityData = this.props.entities[decodedObjReference.objType + '-' + decodedObjReference.id]
    let getNotificationMessage = notificationEntity.getValue("name");

    // Make sure we have object reference before we get its details
    if (objRefEntityData) {

      // Create a new entity model based on the object reference of the notification entity
      const objDefData = this.props.entityDefinitions[decodedObjReference.objType];
      const objDef = new Definition(objDefData);
      const entity = new Entity(objDef, objRefEntityData);

      // Get the entity name as this will serve as a detailed description of the notification message
      getNotificationMessage += " - " + entity.getName();
    }

    return getNotificationMessage;
  }

  /**
   * Sets up the timeout for fetching the notifications.
   * The current setting is it will fetch every 5 minutes.
   */
  setupFetchNotificationsTimer = () => {

    // If we have notification timer set, then we need to clear it first before setting a new timeout
    if (this.fetchNotificationsTimer) {
      clearTimeout(this.fetchNotificationsTimer);
    }

    // Configure the notification timer to fetch the notifications every 5 minutes
    this.fetchNotificationsTimer = setTimeout(() => {
      this.props.onFetchNotifications(this.props.userId)

      // Reset the current notification index to 0 so we can display the new notifications
      this.setState({currentNotificationIndex: 0});
    }, 5 * MS_PER_MINUTE);
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

  // Get the values from the state and set it as constants
  const entities = state.entity.entities || null;
  const entityDefinitions = state.entity.definitions || null;
  const collectionState = state.entity.collections || null;
  const userId = state.account.user.id || null;
  const deviceSize = state.device.size

  let notifications = [];

  if (collectionState && collectionState[COLLECTION_ID] && collectionState[COLLECTION_ID].results) {
    notifications = collectionState[COLLECTION_ID].results.entities;
  }

  return {
    entities,
    entityDefinitions,
    notifications,
    userId,
    deviceSize
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
    onFetchNotificationDefinition: () => {
      // Get the notification definition from the server
      dispatch(fetchEntityDefinition("notification"));
    },
    onFetchNotifications: (userId) => {
      // Fetch the notifications from the server
      dispatch(fetchNotifications(COLLECTION_ID, userId));
    },
    onUpdateNotification: (entity) => {
      // Update the notification in the server
      dispatch(saveEntity(entity));
    }
  }
};

// Connect this container to listen to redux
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationContainer);
