import fetch from 'isomorphic-fetch'
import Collection from '../models/entity/Collection';
import log from '../log';

/**
 * Action type constants
 *
 * @type {string}
 */
export const ENTITY_COLLECTION_UPDATE = 'ENTITY_COLLECTION_UPDATE';
export const ENTITY_COLLECTION_LOADING = 'ENTITY_COLLECTION_LOADING';
export const ENTITY_COLLECTION_MARK_DIRTY = 'ENTITY_COLLECTION_MARK_DIRTY';
export const NOTIFICATION_UPDATE = 'NOTIFICATION_UPDATE';

/**
 * Update entity collection data
 *
 * @param {string} collectionId The unique id of the collection we are updating
 * @param {Object} query Raw query definition
 * @param {Object} results Results data array from the server
 * @returns {{type: string, objType: string, id: string, data: {}}}
 */
export const updateEntityCollection = (collectionId, query, results) => {
  return {
    type: ENTITY_COLLECTION_UPDATE,
    collectionId: collectionId,
    query: query,
    results: results
  };
};

/**
 * Mark an entity collection as dirty so that calling code knows to refresh
 *
 * @param {string} collectionId
 * @returns {{type: string, collectionId: *}}
 */
export const setEntityCollectionDirty = (collectionId) => {
  return {
    type: ENTITY_COLLECTION_MARK_DIRTY,
    collectionId: collectionId
  };
};

/**
 * Set whether or not a collection is being fetched
 *
 * @param {string} collectionId
 * @param {bool} isLoading
 * @returns {{type: string, collectionId: *}}
 */
export const setCollectionLoading = (collectionId, isLoading) => {
  return {
    type: ENTITY_COLLECTION_LOADING,
    collectionId: collectionId,
    isLoading: isLoading
  };
};

/**
 * Update the notification data
 *
 * @param {string} collectionId collection ID to use rather than generating a new hash
 * @param {Object} query Raw query definition
 * @param {Object} results Results data array from the server
 * @returns {{type: string, objType: string, id: string, data: {}}}
 */
export const updateNotification = (collectionId, query, results) => {
  return {
    type: NOTIFICATION_UPDATE,
    collectionId: collectionId,
    query: query,
    results: results
  };
};

/**
 * Get an entity definition from the server
 *
 * @param {Collection} collection The collection to fetch
 * @param {string} collectionId Optional collection ID to use rather than generating a new hash
 * @returns {Function}
 */
export function fetchEntityCollection(collection, collectionId) {
  return function (dispatch, getState) {
    const state = getState();
    const serverHost = state.account.server;
    const sessionToken = state.account.user.authToken;

    // Convert the collection into consumable data for a backend query
    const queryData = collection.queryToData();

    // Set loading flag
    dispatch(setCollectionLoading(collectionId, true));

    return fetch(`${serverHost}/svr/entity-query/execute`, {
      method: 'POST',
      headers: {
        'Authentication': sessionToken
      },
      body: JSON.stringify(queryData)
    }).then(response => response.json()).then((json) => {
      // Refresh the collection results
      dispatch(updateEntityCollection(collectionId, queryData, json));
      // Set loading flag
      dispatch(setCollectionLoading(collectionId, false));
    }).catch((error) => {
      // TODO: We should probably dispatch another action for the error
      log.error('request failed', error);
      // Set loading flag
      dispatch(setCollectionLoading(collectionId, false));
    });
  }
}

/**
 * Get an entity definition from the server
 *
 * @param {string} collectionId collection ID to use rather than generating a new hash
 * @param {string} userId The id of the current user
 * @returns {Function}
 */
export function fetchNotifications(collectionId, userId) {

  let notificationCollection = new Collection("notification");

  notificationCollection.andWhere("owner_id").value = userId;
  notificationCollection.setOrderBy("ts_entered", "desc");
  notificationCollection.andWhere("f_shown").value = false;
  notificationCollection.andWhere("f_seen").value = false;
  notificationCollection.setLimit(5);

  return function (dispatch, getState) {

    const state = getState();
    const serverHost = state.account.server;
    const sessionToken = state.account.user.authToken;

    // Convert the notificationCollection into consumable data for a backend query
    const queryData = notificationCollection.queryToData();

    return fetch(`${serverHost}/svr/entity-query/execute`, {
      method: 'POST',
      headers: {
        'Authentication': sessionToken
      },
      body: JSON.stringify(queryData)
    }).then(response => response.json()).then((resultData) => {

      // Refresh the notification results
      dispatch(updateNotification(collectionId, queryData, resultData));
    }).catch((error) => {
      log.error('request failed', error);
    });
  }
}
