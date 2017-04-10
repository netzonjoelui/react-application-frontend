import fetch from 'isomorphic-fetch'

/**
 * Action type constants
 *
 * @type {string}
 */
export const GROUPINGS_UPDATE = 'GROUPINGS_UPDATE';

/**
 * Update groupings for an entity field
 *
 * @param {Object} groupingsData An objects that contains the groupings data
 * @returns {{type: string, objType: string, groupingsData: {}}}
 */
export const updateEntityFieldGroupings = (groupingsData) => {
  return {
    type: GROUPINGS_UPDATE,
    fieldName: groupingsData.field_name,
    objType: groupingsData.obj_type,
    groupingsData: groupingsData
  };
};

/**
 * Fetch the entity field groupings from the server
 *
 * @param {string} objType The name of the object type for our entity
 * @param {string} fieldName The name of the grouping field
 * @param {Object} opt_filter An optional filter to use when loading the groupings
 * @param {string} authToken Authorization token
 * @param {string} server The server to fetch account from, if null use state
 * @returns {Function}
 */
export function fetchGroupings(objType, fieldName, opt_filter, authToken = "", server = "") {
  return function (dispatch, getState) {
    const state = getState();
    const serverHost = (server) ? server : state.account.server;
    const sessionToken = (authToken) ? authToken : state.account.user.authToken;

    let filter = opt_filter || null;
    let filterString = '';

    // Check if there a filter specified
    if (filter) {
      filterString = '&filter=' + JSON.stringify(filter)
    }

    return fetch(`${serverHost}/svr/entity/getGroupings?obj_type=${objType}&field_name=${fieldName}${filterString}`, {
      method: 'GET',
      headers: {
        'Authentication': sessionToken
      }
    }).then(response => response.json()).then((data) => {

      // Update the groupings
      dispatch(updateEntityFieldGroupings(data));

    }).catch((error) => {
      // TODO: We should probably dispatch another action for the error
      console.error('request failed', error)
    });
  }
}

/**
 * Save an entity grouping to the server
 *
 * @param {string} action This will determine what type of action we will be executing.
 *                        Expected values are (add, edit, delete)
 * @param {entity/Groupings} groupings The groupings where we will save the group definition
 * @param {entity/definition/Group} group The group definition that will be saved
 * @param {string} authToken Authorization token
 * @param {string} server The server to fetch account from, if null use state
 * @returns {Function}
 */
export function saveGroup(action, groupings, group, authToken = "", server = "") {
  return function (dispatch, getState) {
    const state = getState();
    const serverHost = (server) ? server : state.account.server;
    const sessionToken = (authToken) ? authToken : state.account.user.authToken;

    // Get the group data
    let data = group.getData();

    // Setup the object type of the group
    data['obj_type'] = groupings.objType;
    data['field_name'] = groupings.fieldName;
    data['filter'] = groupings.filter;
    data['action'] = action;

    return fetch(`${serverHost}/svr/entity/saveGroup`, {
      method: 'POST',
      headers: {
        'Authentication': sessionToken
      },
      body: JSON.stringify(data)
    }).then(response => response.json()).then((data) => {

      // If this group still has a null id, then we will update the group id
      if (!group.id) {
        group.id = data.id;
      }

      // Let's update the groupings
      switch (action ) {
        case 'add':
          groupings.addGroup(group);
          break;
        case 'edit':
          groupings.updateGroup(group);
          break;
        case 'delete':
          groupings.removeGroup(group);
          break;
      }

      // Update the groupings data
      dispatch(updateEntityFieldGroupings(groupings.getData()));
    }).catch((error) => {
      // TODO: We should probably dispatch another action for the error
      console.error('request failed', error)
    });
  }
}

