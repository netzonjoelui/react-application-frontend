import React from 'react';
import {login, updateAccount}  from '../actions/account';
import { connect } from 'react-redux';
import PageModal from '../components/PageModal';

// Chamel Controls
import Snackbar from 'chamel/lib/Snackbar/Snackbar';

/**
 * Handle merging 2 or more entities
 */
class EntityMergeContainer extends React.Component {
  /**
   * Set expected property types
   */
  static propTypes = {

    /**
     * Email address of the current user
     */
    objType: React.PropTypes.string.isRequired,

    /**
     * Array of entity IDs to act on
     */
    entityIds: React.PropTypes.array.isRequired,

    /**
     * Select which account the user would like to use
     */
    onCompleted: React.PropTypes.func.isRequired,

    /**
     * The size of the current device
     */
    deviceSize: React.PropTypes.number
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
      completed: false
    }
  }

  /**
   * Check if we should actually log the user out and clear state
   */
  componentDidMount() {
  }

  /**
   * About to receive new properties
   *
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
  }

  /**
   * Handle a user action
   *
   * @returns {Object}
   */
  render() {
    // If this action is completed then show notice and skip the rest
    if (this.state.completed) {
      return (
        <Snackbar
          message={"Merged " + this.props.entityIds.length + " Entities"}
          timeout={3000}
          open={true}
        />
      );
    }

    return (
      <PageModal
        deviceSize={this.props.deviceSize}
        title={"Merge Entities"}
        continueLabel={"Merge"}
        onContinue={this.performMerge}>
        <div onClick={this.performMerge}>
          {"Merge " + this.props.entityIds.length + " entities"}
        </div>
      </PageModal>
    );
  }

  /**
   * This is where we would dispatch options to finish the merge
   */
  performMerge = () => {
    // TODO: perform/dispatch the merge
    this.setState({completed: true});
    this.props.onCompleted();
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
    // TODO: This needs to be changed to a mergeEntities action
    onLogin:(username, password) => {
      dispatch(login(username, password));
    },
  }
};

// Connect this container to listen to redux
export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityMergeContainer);
