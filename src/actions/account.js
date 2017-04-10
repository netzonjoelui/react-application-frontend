import fetch from 'isomorphic-fetch'
import {updateAvailableModules, updateDefaultModule, updateModule} from './module';

/**
 * Action types
 *
 * @type {string}
 */
export const ACCOUNT_UPDATE = 'ACCOUNT_UPDATE';
export const ACCOUNT_FETCHING = 'ACCOUNT_FETCHING';
export const ACCOUNT_USER_AUTHENTICATING = 'ACCOUNT_USER_AUTHENTICATING';
export const ACCOUNT_USER_UPDATE = 'ACCOUNT_USER_UPDATE';
export const ACCOUNT_USER_LOGOUT = 'ACCOUNT_USER_LOGOUT';

/**
 * Update the online status of this device
 *
 * @param {object} accountData
 * @returns {{type: string, data: object}}
 */
export const updateAccount = (accountData) => {
  return { type: ACCOUNT_UPDATE, data:accountData };
};

/**
 * Update the online status of this device
 *
 * @param {bool} status
 * @returns {{type: string, isFetching: bool}}
 */
export const updateAccountFetching = (status) => {
  return { type: ACCOUNT_FETCHING, isFetching:status };
};

/**
 * Update the online status of this device
 *
 * @param {bool} status
 * @returns {{type: string, isAuthenticating: bool}}
 */
export const updateUserAuthenticating = (status) => {
  return { type: ACCOUNT_USER_AUTHENTICATING, isAuthenticating:status };
};

/**
 * Update the online status of this device
 *
 * @param {Object} data
 * @returns {{type: string, data: object}}
 */
export const updateUser = (data) => {
  return { type: ACCOUNT_USER_UPDATE, data:data };
};

/**
 * Emit an action to un-authenticate this user
 *
 * @returns {{type: string}}
 */
export const updateUserLogout = () => {
  return { type: ACCOUNT_USER_LOGOUT };
};

/**
 * Retrieve account details from the server
 *
 * @param {string} authToken Authorization token
 * @param {string} server The server to fetch account from, if null use state
 * @returns {Function}
 */
export function fetchAccount(authToken = "", server = "") {

  return function (dispatch, getState) {
    const state = getState();
    const serverHost = (server) ? server : state.account.server;
    const sessionToken = (authToken) ? authToken : state.account.user.authToken;

    // If the host has not been set yet, then skip fetching the account
    if (!serverHost || !sessionToken) {
      console.error(
        "Could not get account because either serverHost or sessionToken were not set",
        serverHost,
        sessionToken
      );
      return;
    }

    // Check if we are already fetching this account
    if (state.account.fetching) {
      return;
    }

    dispatch(updateAccountFetching(true));

    return fetch(`${serverHost}/svr/account/get`, {
      method: 'GET',
      headers: {
        'Authentication': sessionToken
      }}
    ).then(response => response.json()).then((json) => {

      // Split out data
      let {
        modules,
        defaultModule,
        ...everythingElse
      } = json;

      // Send everything but module details
      dispatch(updateAccount(everythingElse));

      // Set available modules
      dispatch(updateAvailableModules(modules));

      // Set individual modules
      for (var i in modules) {
        dispatch(updateModule(modules[i].name, modules[i]));

        // If no default module was set, then set it here
        if (!defaultModule) {
          defaultModule = modules[i].name;
        }
      }

      // Set default module
      dispatch(updateDefaultModule(defaultModule));

      // Set no longer fetching
      dispatch(updateAccountFetching(false));
    }).catch((error) => {
      dispatch(updateAccountFetching(false));
      // TODO: We should probably dispatch another action for the error
      console.error('fetchAccount failed', error);
    });
  }
}

/**
 * Get accounts this user's email address are associated with
 *
 * @param {string} emailAddress Get any accounts that this email is associated with
 * @param {string} password Optional password to attempt automatically logging
 * @returns {Function}
 */
export function fetchAvailableAccountsForEmail(emailAddress, password="") {

  return function (dispatch, getState) {

    const serverHost = getState().account.universalLoginUrl;

    // This should never happen since there is a default set in the reducer
    if (!serverHost) {
      throw "A critical param account.universalLoginUri was not set";
    }

    dispatch(updateUserAuthenticating(true));

    let loginForm = new FormData();
    loginForm.append("email", emailAddress);
    return fetch(`${serverHost}/svr/authentication/get-accounts`, {
      method: 'POST',
      body: loginForm
    }).then(response => response.json()).then((json) => {

      // Update available accounts
      dispatch(updateAccount({
        availableAccounts: json
      }));

      // If there is only one account then try to login
      if (1 == json.length && password) {
        dispatch(updateAccount({server: json[0].instanceUri}));

        // Now log in
        return dispatch(login(emailAddress, password, json[0].instanceUri));

      } else if (json.length == 0) {
        dispatch(updateUser({authenticationError: "Invalid username and/or password"}));
      }

      dispatch(updateUserAuthenticating(false));
    }).catch((error) => {

      // TODO: We should probably dispatch another action for the error
      console.error('fetchAvailableAccountsForEmail failed', error);

      dispatch(updateUserAuthenticating(false));
    });
  }
}

/**
 * Log the use in
 *
 * @param {string} username The name or email address of the user
 * @param {string} password Challenge password for the account
 * @returns {Function}
 */
export function login(username, password) {

  return function (dispatch, getState) {

    const serverHost = getState().account.server;

    // Set flag to indicate the user is authenticating
    dispatch(updateUserAuthenticating(true));

    // If an account has not been set, then we need to query the server for available accounts
    if (!serverHost) {
      return dispatch(fetchAvailableAccountsForEmail(username, password));
    }

    // Initialize login form
    let loginForm = new FormData();
    loginForm.append("username", username);
    loginForm.append("password", password);

    return fetch(`${serverHost}/svr/authentication/authenticate`, {
      method: 'POST',
      body: loginForm
    }).then(response => response.json()).then((json) => {
      let finalPromise = null;

      switch (json.result) {
        case "SUCCESS":
          // Set user details
          dispatch(updateUser({username: username, id: json.user_id, authToken:json.session_token}));

          // Get all account info now that we can authenticate
          finalPromise = dispatch(fetchAccount(json.session_token, serverHost));
          break;
        case "FAIL":
        default:
          const reason = (json.reason)
            ? json.reason : "Invalid username and/or password";
          finalPromise = dispatch(updateUser({authenticationError: reason}));
          console.error("Failed to authenticate with server", serverHost, json);
          break;
      }

      // Set no longer fetching
      dispatch(updateUserAuthenticating(false));

      return finalPromise;
    }).catch((error) => {
      // TODO: We should probably dispatch another action for the error
      console.error('login failed', error);
    });
  }
}

/**
 * Log the user out
 *
 * @returns {Function}
 */
export function logout() {
  return function (dispatch, getState) {

    const state = getState();
    const serverHost = state.account.server;
    const sessionToken = state.account.user.authToken;

    dispatch(updateUserLogout());

    /*
    return fetch(`${serverHost}/svr/authentication/authenticate`, {
      method: 'POST',
      headers: {
        'Authentication': sessionToken
      },
      body: JSON.stringify({"username": username, "password": password})
    }).then(response => response.json()).then((json) => {

        // Set available modules
        //dispatch(updateAvailableModules(modules));

        // Set default module
        //dispatch(updateDefaultModule(defaultModule));

        // Set no longer fetching
        dispatch(updateUserAuthenticating(false));
      }
    ).catch((error) => {
      // TODO: We should probably dispatch another action for the error
      console.log('request failed', error)
    });
    */
  }
}