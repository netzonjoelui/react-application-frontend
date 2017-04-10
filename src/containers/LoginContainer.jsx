import React from 'react';
import LoginComponent from '../components/login/Login';
import {login, updateAccount}  from '../actions/account';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

/**
 * Main application class for netric
 */
class LoginContainer extends React.Component {
  /**
   * Set expected property types
   */
  static propTypes = {

    /**
     * Object with a pathname property
     */
    from: React.PropTypes.shape({ pathname: React.PropTypes.string }),

    /**
     * User id of the currently logged-in user
     */
    userId: React.PropTypes.string,

    /**
     * Email address of the current user
     */
    userEmail: React.PropTypes.string,

    /**
     * Authentication token for the user
     */
    authToken: React.PropTypes.string,

    /**
     * Flag to indicate we are trying to auth with the server
     */
    isAuthenticating: React.PropTypes.bool,

    /**
     * ID of the account this user belongs to
     */
    accountId: React.PropTypes.string,

    /**
     * Name of the account this user belong to
     */
    accountName: React.PropTypes.string,

    /**
     * All accounts this user can log into
     */
    availableAccounts: React.PropTypes.array,

    /**
     * Any errors encountered while trying to authenticate
     */
    authenticationError: React.PropTypes.string,

    /**
     * Flag set to true when we are trying to load the user's account
     */
    accountIsFetching: React.PropTypes.bool,

    /**
     * Create session and get an auth token
     */
    onLogin: React.PropTypes.func.isRequired,

    /**
     * Select which account the user would like to use
     */
    onSetAccount: React.PropTypes.func.isRequired
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
   * Render the component
   *
   * @returns {XML}
   */
  render() {
    if (this.props.authToken && this.props.accountName) {
      // User just successfully authenticated, so let's redirect to where they were
      const goTo = (this.props.from && this.props.from.pathname != '/login')
        ? this.props.from.pathname : '/';

      return (
        <Redirect to={{
          pathname: goTo,
          state: {}
        }}/>
      );
    } else {
      // Show login form
      return (
        <LoginComponent
          processing={this.props.isAuthenticating}
          errorText={this.props.authenticationError}
          accounts={this.props.availableAccounts}
          onLogin={this.props.onLogin}
          onSetAccount={this.props.onSetAccount}
        />
      );
    }
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
    userId: state.account.user.id,
    userEmail: state.account.user.email,
    authToken: state.account.user.authToken,
    isAuthenticating: state.account.user.isAuthenticating,
    authenticationError: state.account.user.authenticationError,
    accountId: state.account.id,
    accountName: state.account.name,
    availableAccounts: state.account.availableAccounts,
    accountIsFetching: state.account.fetching
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
    onLogin:(username, password) => {
      dispatch(login(username, password));
    },
    onSetAccount:(instanceUri) => {
      dispatch(updateAccount({server: instanceUri + '/'}));
    }
  }
};

// Connect this container to listen to redux
export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginContainer);