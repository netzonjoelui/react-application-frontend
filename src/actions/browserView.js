import fetch from 'isomorphic-fetch';

/**
 * Action type constants
 *
 * @type {string}
 */
export const BROWSER_VIEW_UPDATE_LIST = 'BROWSER_VIEW_UPDATE_LIST';
export const BROWSER_VIEW_UPDATE = 'BROWSER_VIEW_UPDATE';
export const BROWSER_VIEW_SET_DEFAULT = 'BROWSER_VIEW_SET_DEFAULT';
export const BROWSER_VIEW_CURRENT = 'BROWSER_VIEW_CURRENT';

/**
 * Update the browser view list
 *
 * @param {string} objType The object type of the brower view we are working with
 * @param {Object[]} browserViewDataList An array of data objects that contains the browserView data
 * @returns {{type: string, objType: string, browserViewDataList: {}}}
 */
export const updateBrowserViewList = (objType, browserViewDataList) => {
  return {
    type: BROWSER_VIEW_UPDATE_LIST,
    objType: objType,
    browserViewDataList: browserViewDataList
  };
};

/**
 * Update the browser view
 *
 * @param {int} viewId The id of the browser view we have updated
 * @param {string} objType The object type of the brower view we are working with
 * @param {Object} browserViewData The browser view data that we are updating
 * @returns {{type: string, objType: string, viewId: int, browserViewData: {}}}
 */
export const updateBrowserView = (viewId, objType, browserViewData) => {
  return {
    type: BROWSER_VIEW_UPDATE,
    objType: objType,
    viewId: viewId,
    browserViewData: browserViewData
  };
};

/**
 * Set the default browser view id
 *
 * @param {string} objType The object type of the browser view we are working with
 * @param {int} defaultViewId The id of the browser that will be set as default view
 * @returns {{type: string, defaultViewId: int, objType: string}}
 */
export const updateDefaultBrowserViewId = (objType, defaultViewId) => {
  return {
    type: BROWSER_VIEW_SET_DEFAULT,
    defaultViewId: defaultViewId,
    objType: objType
  };
};

/**
 * Set the current browser view
 *
 * @param {string} objType The object type of the browser view we are working with
 * @param {object} currentBrowserViewData The browser view data that will be set as the current browser view
 * @returns {{type: string, defaultViewId: int, objType: string}}
 */
export const updateCurrentBrowserView = (objType, currentBrowserViewData) => {
  return {
    type: BROWSER_VIEW_CURRENT,
    currentBrowserViewData: currentBrowserViewData,
    objType: objType
  };
};

/**
 * Save the browser view to the server
 *
 * @param {BrowserView} browserView The browser view to be saved
 * @returns {Function}
 */
export function saveBrowserView(browserView) {
  return function (dispatch, getState) {
    const state = getState();
    const serverHost = state.account.server;
    const sessionToken = state.account.user.authToken;

    if (!serverHost) {
      throw 'No server host provided';
    }

    return fetch(`${serverHost}/svr/browserView/save`, {
      method: 'POST',
      headers: {
        'Authentication': sessionToken
      },
      body: JSON.stringify(browserView.getData())
    }).then(response => response.json()).then((viewId) => {
      // If this browser view still has a null id, then we will update the browser view id
      if (!browserView.id) {
        browserView.id = viewId;
      }

      // Update the browser view
      dispatch(updateBrowserView(viewId, browserView.objType, browserView.getData()));

      // If browserView.default is set to true,
      // then we need to update the entity definition that there is a new default view
      if (browserView.default) {
        dispatch(updateDefaultBrowserViewId(viewId, browserView.objType));
      }
    }).catch((error) => {
      // TODO: We should probably dispatch another action for the error
      throw 'saveBrowserView failed: ' + serverHost + ' ' + error.message;
    });
  }
}

/**
 * Set the browser view as the default view
 *
 * @param {BrowserView} browserView The browser view to be set as default
 * @returns {Function}
 */
export function setDefaultBrowserView(browserView) {
  return function (dispatch, getState) {
    const state = getState();
    const serverHost = state.account.server;
    const sessionToken = state.account.user.authToken;

    return fetch(`${serverHost}/svr/browserView/setDefaultView`, {
      method: 'POST',
      headers: {
        'Authentication': sessionToken
      },
      body: JSON.stringify(browserView.getData())
    }).then(response => response.json()).then((viewId) => {
      // Set brower view's default view
      dispatch(updateDefaultBrowserViewId(browserView.objType, viewId));
    }).catch((error) => {
      // TODO: We should probably dispatch another action for the error
      console.error('request failed', error)
    });
  }
}