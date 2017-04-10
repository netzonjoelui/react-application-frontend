import React from 'react';
import { logout }  from '../actions/account';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

/**
 * Main application class for netric
 */
class LogoutContainer extends React.Component {
  /**
   * Set expected property types
   */
  static propTypes = {
    authToken: React.PropTypes.string,
  };

  /**
   * Class constructor
   *
   * @param {Object} props Properties to send to the render function
   */
  constructor(props) {
    // Call parent constructor
    super(props);
  }

  /**
   * Check if we should actually log the user out and clear state
   */
  componentDidMount() {
    if (this.props.authToken) {
      this.props.onLogout();
    }
  }

  /**
   * Render the component
   *
   * @returns {XML}
   */
  render() {
    return (
      <Redirect to={{
        pathname: '/login',
        state: {}
      }}/>
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
    authToken: state.account.user.authToken
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
    onLogout:() => {
      dispatch(logout());
    },
  }
};

// Connect this container to listen to redux
export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(LogoutContainer);