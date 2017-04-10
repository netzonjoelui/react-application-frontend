import {
  ACCOUNT_UPDATE,
  ACCOUNT_FETCHING,
  ACCOUNT_USER_AUTHENTICATING,
  ACCOUNT_USER_UPDATE,
  ACCOUNT_USER_LOGOUT
} from '../actions/account';

/**
 * Define the default structure of our state
 */
const initialState = {
  id: null,
  name: null,
  orgName: null,
  fetching: false,
  server: "",
  availableAccounts: [],
  universalLoginUrl: 'https://login.netric.com',
  user: {
    id: null,
    name: null,
    email: null,
    authToken: null,
    isAuthenticating: false,
    authenticationError: ""
  }
};

/**
 * Handle account transformations
 */
const account = (state = initialState, action) => {

  /**
   * Set the properties of the application state
   */
  if (action.type === ACCOUNT_UPDATE) {
    return Object.assign({}, state, action.data);
  }

  /**
   * Set the properties of the application state
   */
  if (action.type === ACCOUNT_FETCHING) {
    return Object.assign({}, state, {fetching: action.isFetching});
  }

  /**
   * Log a user out by clearing all params
   */
  if (action.type === ACCOUNT_USER_LOGOUT) {
    return Object.assign({}, initialState);
  }

  /**
   * Set a flag to indicate that a user is authenticating
   */
  if (action.type === ACCOUNT_USER_AUTHENTICATING) {
    let newState =  Object.assign({}, state);
    newState.user = Object.assign({}, newState.user, {
      isAuthenticating: action.isAuthenticating
    });
    return newState;
  }

  /**
   * Update the user
   */
  if (action.type === ACCOUNT_USER_UPDATE) {
    let newState =  Object.assign({}, state);
    newState.user = Object.assign({}, newState.user, action.data);
    return newState;
  }

  return state
};

export default account;
