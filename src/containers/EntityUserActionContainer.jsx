import React from 'react';
import { connect } from 'react-redux';
import {deleteEntity}  from '../actions/entity';
import {getContainerForAction, actionModes} from '../models/entity/userActions';

// Chamel Controls
import Snackbar from 'chamel/lib/Snackbar/Snackbar';

/**
 * Handle actions that a user can perform on an entity or entities
 */
class EntityUserActionContainer extends React.Component {
  /**
   * Set expected property types
   */
  static propTypes = {

    /**
     * The name of the action we are performing
     */
    actionName: React.PropTypes.string,

    /**
     * Email address of the current user
     */
    objType: React.PropTypes.string.isRequired,

    /**
     * Array of entity IDs to act on
     */
    entityIds: React.PropTypes.array.isRequired,

    /**
     * Array of entity names based on the entity IDs to act on
     */
    entityNames: React.PropTypes.array,

    /**
     * Select which account the user would like to use
     */
    onCompleted: React.PropTypes.func.isRequired,

    /**
     * Callback for dispatching an action
     */
    onDispatchAction: React.PropTypes.func.isRequired
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
      completed: false,
      message: ""
    }
  }

  /**
   * Check if we should actually log the user out and clear state
   */
  componentDidMount() {
    // Make sure this is not an action that does not have its own container
    if (!getContainerForAction(this.props.actionName)) {

      // Convert name of action to action<UpperCaseActionName>
      const actName = this.props.actionName.charAt(0).toUpperCase()
                    + this.props.actionName.slice(1);

      // Check if action exists, otherwise log error
      if (this.hasOwnProperty("action" + actName)) {
        this["action" + actName]();
      } else {
        // TODO: Dispatch error
        console.error("Action not found", "action" + actName);
      }
    }
  }

  /**
   * Handle a user action
   *
   * Actions are processed in the following way:
   * 1. Check to see if any components exist with the action name, else continue
   * 2. Check to see if actions exist in actions/entity[ObjType].js*, else continue
   * 3. Check to see if actions exist in actions/entity.js*, else continue
   * 4. Show error that action is not valid
   *
   * @returns {Object}
   */
  render() {

    /*
     * First we check to see if an action container exists for this user action.
     * Action containers make it possible to create more sophisticated user
     * interactions rather than just dispatching an action via redux.
     */
    const ActionContainer = getContainerForAction(this.props.actionName);
    if (ActionContainer) {
      return (
        <ActionContainer
          objType={this.props.objType}
          entityIds={this.props.entityIds}
          entityNames={this.props.entityNames}
          onCompleted={this.props.onCompleted}
        />
      );
    }

    /*
     * Display status message when completed
     */
    if (this.state.completed && this.state.message) {
      return (
        <Snackbar
          message={this.state.message}
          timeout={3000}
          open={true}
        />
      );
    }

    // By default just display an empty span since actions are handled on component mount
    return (<span />);
  }

  /**
   * Function called when the user action is completed
   */
  completed = () => {
    this.setState({
      completed: true
    });

    this.props.onCompleted();
  };

  /**
   * Delete entities action
   */
  actionRemove = () => {
    this.setState({
      message: this.props.entityIds.length + " Deleted"
    });

    this.props.onDispatchAction(
      deleteEntity(this.props.objType, this.props.entityIds),
      () => { this.completed(); }
    );
  }
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
    userId: state.account.user.id
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
    onDispatchAction:(action, onFinished) => {
      dispatch(action).then(onFinished);
    }
  }
};

// Connect this container to listen to redux
export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityUserActionContainer);
