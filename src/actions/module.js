import fetch from 'isomorphic-fetch'
import { fetchGroupings } from './groupings';

export const MODULE_UPDATE = 'MODULE_UPDATE';
export const MODULE_UPDATE_DEFAULT = 'MODULE_UPDATE_DEFAULT';
export const MODULE_FETCHING = 'MODULE_FETCHING';
export const MODULES_AVAILABLE_UPDATE = 'MODULE_AVAILABLE_UPDATE';

export const updateModule = (moduleName, moduleData) => {
  return { type: MODULE_UPDATE, name:moduleName, data:moduleData };
};

export const updateDefaultModule = (moduleName) => {
  return { type: MODULE_UPDATE_DEFAULT, moduleName:moduleName };
};

export const updateAvailableModules = (modules) => {
  return { type: MODULES_AVAILABLE_UPDATE, modules: modules };
};

export const moduleFetching = (fetching) => {
  return { type: MODULE_FETCHING, isFetching: fetching };
};

/**
 * Get a module from the server
 *
 * @param {string} moduleName The module name to load
 * @returns {Function}
 */
export function fetchModule(moduleName) {
  return function (dispatch, getState) {
    const state = getState();
    const serverHost = state.account.server;
    const sessionToken = state.account.user.authToken;

    dispatch(moduleFetching(true));

    return fetch(`${serverHost}/svr/module/get?moduleName=${moduleName}`, {
      method: 'GET',
      headers: {
        'Authentication': sessionToken
      }}
    ).then(response => response.json()).then((json) => {

        // Refresh the module data
        dispatch(updateModule(moduleName, json));

        // Let the app know we are no longer fetching
        dispatch(moduleFetching(false));

        // Loop thru the navigation and get fetch the entity groupings
        if (json.navigation) {
          let navigation = json.navigation;

          navigation.map((navItem) => {

            // If navItem has a browse by, then we will fetch the entity groupings based on the item's objType
            if (navItem.objType && navItem.browseby) {
              dispatch(fetchGroupings(navItem.objType, navItem.browseby));
            }
          })
        }
      }
    ).catch((error) => {
      // TODO: We should probably dispatch another action for the error
      console.log('request failed', error)
    });
  }
}