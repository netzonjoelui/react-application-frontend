import fetch from 'isomorphic-fetch'
import log from '../log';
import { updateBrowserViewList, updateDefaultBrowserViewId } from './browserView';
import { setEntityCollectionDirty } from './entityCollection';

/**
 * Action type constants
 *
 * @type {string}
 */
export const ENTITY_UPDATE = 'ENTITY_UPDATE';
export const ENTITY_FETCHING = 'ENTITY_FETCHING';
export const ENTITY_DELETED = 'ENTITY_DELETED';
export const ENTITY_DEFINITION_UPDATE = 'ENTITY_DEFINITION_UPDATE';
export const ENTITY_DEFINITION_FETCHING = 'ENTITY_DEFINITION_FETCHING';
export const ENTITY_DEFINITION_UPDATE_ALL = 'ENTITY_DEFINITION_UPDATE_ALL';
export const ENTITY_DEFINITION_FETCHING_ALL = 'ENTITY_DEFINITION_FETCHING_ALL';

/**
 * Update entity data
 *
 * @param {string} objType The object type we are updating
 * @param {string} id The unique id of the entity
 * @param {Object} entityData Raw entity data
 * @returns {{type: string, objType: string, id: string, data: {}}}
 */
export const updateEntity = (objType, id, entityData) => {
  return {type: ENTITY_UPDATE, objType: objType, id: id, data: entityData};
};

/**
 * Action triggered any time an entity gets deleted
 *
 * @param {string} objType The object type we are updating
 * @param {string} id The unique id of the entity
 * @returns {{type: string, objType: string, id: string, data: {}}}
 */
export const updateEntityDeleted = (objType, id) => {
  return {type: ENTITY_DELETED, objType: objType, id: id};
};


/**
 * Flag to indicate we are fetching an entity
 *
 * @param {string} objType The object type we are updating
 * @param {string} id The unique id of the entity
 * @param {bool} fetching Flag to indicate if we are fetching the entity from the server
 * @returns {{type: string, isFetching: *}}
 */
export const entityFetching = (objType, id, fetching) => {
  return {type: ENTITY_FETCHING, objType: objType, id: id, isFetching: fetching};
};

/**
 * Update definition data
 *
 * @param {string} objType The object type we are updating
 * @param {Object} defData Raw entity definition data
 * @returns {{type: string, objType: string, id: string, data: {}}}
 */
export const updateEntityDefinition = (objType, defData) => {
  return {type: ENTITY_DEFINITION_UPDATE, objType: objType, data: defData};
};

/**
 * Flag to indicate we are fetching an entity definition
 *
 * @param {string} objType The object type we are updating
 * @param {bool} fetching Flag to indicate if we are fetching the entity from the server
 * @returns {{type: string, isFetching: *}}
 */
export const entityDefinitionFetching = (objType, fetching) => {
  return {
    type: ENTITY_DEFINITION_FETCHING,
    objType: objType,
    isFetching: fetching
  };
};

/**
 * Update all the entity object types definitions
 *
 * @param {array} entityDefinitionAllObjTypes Collection of Raw entity definition data of all object types
 * @returns {{type: string, entityDefinitionAllObjTypes: {}}}
 */
export const updateAllEntityDefinitions = (entityDefinitionAllObjTypes) => {
  return {
    type: ENTITY_DEFINITION_UPDATE_ALL,
    entityDefinitionAllObjTypes
  };
};

/**
 * Flag to indicate we are fetching the entity definition all object types
 *
 * @param {bool} fetching Flag to indicate if we are fetching the entity from the server
 * @returns {{type: string, isFetching: *}}
 */
export const entityDefinitionsFetchingAll = (fetching) => {
  return {
    type: ENTITY_DEFINITION_FETCHING_ALL,
    isEntityDefinitionAllObjTypesFetching: fetching
  };
};

/**
 * Get an entity from the server
 *
 * @param {string} objType Object type
 * @param {string} id The unique id of the entity to pull
 * @param {string} authToken Authorization token
 * @param {string} server The server to fetch account from, if null use state
 * @returns {Function}
 */
export function fetchEntity(objType, id) {
  return function (dispatch, getState) {
    const state = getState();
    const serverHost = state.account.server;
    const sessionToken = state.account.user.authToken;

    dispatch(entityFetching(objType, id, true));

    return fetch(`${serverHost}/svr/entity/get?obj_type=${objType}&id=${id}`, {
      method: 'GET',
      headers: {
        'Authentication': sessionToken
      }
    }).then(response => response.json()).then((json) => {
        // Refresh the entity data
        dispatch(updateEntity(objType, id, json));

        // Let the app know we are no longer fetching
        dispatch(entityFetching(objType, id, false));
      }
    ).catch((error) => {
      // TODO: We should probably dispatch another action for the error
      log.error('request failed', error)
    });
  }
}

/**
 * Get an entity definition from the server
 *
 * @param {string} objType Object type
 * @param {string} authToken Authorization token
 * @param {string} server The server to fetch account from, if null use state
 * @returns {Function}
 */
export function fetchEntityDefinition(objType) {
  return function (dispatch, getState) {
    const state = getState();
    const serverHost = state.account.server;
    const sessionToken = state.account.user.authToken;

    dispatch(entityDefinitionFetching(objType, true));

    return fetch(`${serverHost}/svr/entity/getDefinition?obj_type=${objType}`, {
      method: 'GET',
      headers: {
        'Authentication': sessionToken
      }
    }).then(response => response.json()).then((json) => {

        // Refresh the browser view list
        dispatch(updateBrowserViewList(objType, json.views));

        // Update the browser view's default view
        dispatch(updateDefaultBrowserViewId(objType, json.default_view))

        // Refresh the definition data
        dispatch(updateEntityDefinition(objType, json));

        // Let the app know we are no longer fetching
        dispatch(entityDefinitionFetching(objType, false));
      }
    ).catch((error) => {
      // TODO: We should probably dispatch another action for the error
      log.error('request failed', error)
    });
  }
}

/**
 * Get all entity definition from the server
 *
 * @param {string} authToken Authorization token
 * @param {string} server The server to fetch account from, if null use state
 * @returns {Function}
 */
export function fetchAllEntityDefinitions() {
  return function (dispatch, getState) {
    const state = getState();
    const serverHost = state.account.server;
    const sessionToken = state.account.user.authToken;

    dispatch(entityDefinitionsFetchingAll(true));

    return fetch(`${serverHost}/svr/entity/allDefinitions`, {
      method: 'GET',
      headers: {
        'Authentication': sessionToken
      }
    }).then(response => response.json()).then((entityDefinitionAllObjTypes) => {

        // Refresh the definition data
        dispatch(updateAllEntityDefinitions(entityDefinitionAllObjTypes));

        dispatch(entityDefinitionsFetchingAll(false));
      }
    ).catch((error) => {
      // TODO: We should probably dispatch another action for the error
      log.error('request failed', error)
    });
  }
}

/**
 * Save an entity to the server
 *
 * @param {Entity} entity The entity to save
 * @param {string} authToken Authorization token
 * @param {string} server The server to fetch account from, if null use state
 * @returns {Function}
 */
export function saveEntity(entity) {
  return function (dispatch, getState) {
    const state = getState();
    const serverHost = state.account.server;
    const sessionToken = state.account.user.authToken;

    // Immediately update the local state so everyone has the latest copy
    dispatch(updateEntity(entity.def.objType, entity.id, entity.getData()));

    return fetch(`${serverHost}/svr/entity/save`, {
      method: 'POST',
      headers: {
        'Authentication': sessionToken
      },
      body: JSON.stringify(entity.getData())
    }).then(response => response.json()).then((json) => {
      // Refresh the entity data
      dispatch(updateEntity(json.obj_type, json.id, json));
      // Mark any collections for this objType as dirty
      setCollectionsDirtyForObjType(dispatch, state, json.obj_type);
    }).catch((error) => {
      // TODO: We should probably dispatch another action for the error
      log.error('request failed', error)
    });
  }
}

/**
 * Delete an entity
 *
 * @param {string} objType The type of object
 * @param {string|array} ids Either a string of the entity id or an array of IDs
 * @param {string} server Optional server to call
 * @param {string} authToken Optional user auth token
 * @returns {Function}
 */
export function deleteEntity(objType, ids) {
  return function (dispatch, getState) {

    const state = getState();
    const serverHost = state.account.server;
    const sessionToken = state.account.user.authToken;

    if (!serverHost || !sessionToken) {
      throw 'User is not authenticated, cannot delete an entity';
    }

    let form = new FormData();
    form.append("obj_type", objType);
    if (typeof someVar === 'string') {
      form.append('id', ids);
    } else {
      for (var index in ids) {
        form.append('id[]', ids[index]);
      }
    }
    return fetch(`${serverHost}/svr/entity/remove`, {
      method: 'POST',
      headers: {'Authentication': sessionToken},
      body: form
    }).then(response => response.json()).then((json) => {
      if (json.error) {
        log.error("Could not delete entity:", json.error);
      } else {
        for (let idx in json) {
          // Update cached entity and set the deleted flag
          dispatch(updateEntity(objType, json[idx], {f_deleted: true}));

          // Dispatch deleted action so that reducers can clean themselves up
          dispatch(updateEntityDeleted(objType, json[idx]));

          // Mark any collections for this objType as dirty
          setCollectionsDirtyForObjType(dispatch, state, objType);
        }
      }

    }).catch((error) => {
      // TODO: We should probably dispatch another action for the error
      log.error('deleteEntity request failed', error)
    });
  }
}

/**
 * Post a status update
 *
 * @param {string} objType The type of object
 * @param {string|array} ids Either a string of the entity id or an array of IDs
 * @param {string} server Optional server to call
 * @param {string} authToken Optional user auth token
 * @returns {Function}
 */
export function addStatusUpdate(objType, ids) {
  return function (dispatch, getState) {

    const state = getState();
    const serverHost = state.account.server;
    const sessionToken = state.account.user.authToken;

    if (!serverHost || !sessionToken) {
      throw 'User is not authenticated, cannot delete an entity';
    }

    /* TODO: This came from the old /entity/StatusManager but should be an action
     // Do not save an empty status update/comment
     if (!comment) {
     return;
     }

     var entity = opt_entity || null;

     // Create a new comment and save it
     var statusReferenceEntity = entityLoader.factory('status_update');

     if (comment) {
     statusReferenceEntity.setValue("comment", comment);
     }

     // Add the user
     var userId = -3; // -3 is 'current_user' on the backend
     if (netric.getApplication().getAccount().getUser()) {
     userId = netric.getApplication().getAccount().getUser().id;
     }
     statusReferenceEntity.setValue("owner_id", userId);

     // Add an object reference
     var objReference = null;
     if (entity && entity.id) {
     objReference = entity.objType + ":" + entity.id;

     statusReferenceEntity.setValue('obj_reference', objReference);
     }
     */
  }
}

/**
 * Dispatch setEntityCollectionDirty actions for any collections of type objType
 *
 * @param {function} dispatch
 * @param {Object} state The current application state
 * @param {string} objType The object type that was just changed and should be refreshed
 */
const setCollectionsDirtyForObjType = (dispatch, state, objType) => {
  if (state.entity && state.entity.collections) {
    for (let id in state.entity.collections) {
      const query = state.entity.collections[id].query;
      // If the collection is the same type and not already loading then mark it as dirty
      if (query && query.obj_type === objType && state.entity.collections[id].isLoading === false) {
        dispatch(setEntityCollectionDirty(id));
      }
    }
  }
};