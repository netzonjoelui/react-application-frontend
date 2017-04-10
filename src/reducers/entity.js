import * as ActionTypes from '../actions';

/**
 * Define the default structure of our entity state
 */
const initialState = {
  entities: {},
  definitions: {},
  collections: {}
};

/**
 * Merge an entity state
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object} newState
 */
const handleEntityUpdate = (state, action) => {
  let newState = Object.assign({}, state);
  let oldEntityState = newState.entities[action.objType + "-" + action.id] || {};
  newState.entities[action.objType + "-" + action.id] = Object.assign(oldEntityState, action.data);

  // TODO: We should set a dirty flag on any cached list of objType so it can refresh

  return newState;
};

/**
 * Update the results state of a collection
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object} newState
 */
const handleCollectionUpdate = (state, action) => {
  let newState = Object.assign({}, state);
  let lastUpdatedTime = action.lastUpdatedTime || (new Date()).getTime()

  try {
    newState.collections[action.collectionId] = {
      isDirty: false,
      query: action.query,
      results: action.results,
      lastUpdated: lastUpdatedTime
    };

    // Cache each entity
    action.results.entities.forEach((entityData) => {
      newState = handleEntityUpdate(
        newState,
        {objType: entityData.obj_type, id: entityData.id, data: entityData}
      );
    });
  } catch (e) {
    console.error("Problem reducing collection", e);
  }

  return newState;
};

/**
 * Update the entity definition
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object} newState
 */
const handleEntityDefinitionUpdate = (state, action) => {
  let entityData = Object.assign({}, action.data);
  let newState = Object.assign({}, state);

  // We don't need the views to be in the entity definition as browser views has its own state
  if (entityData.hasOwnProperty("views")) {
    delete entityData.views;
  }

  // We don't need the default_view to be in the entity definition as browser views has its own state
  if (entityData.hasOwnProperty("default_view")) {
    delete entityData.default_view;
  }

  newState.definitions[action.objType] = entityData;

  // Set last fetched
  let lastFetchedTime = entityData.lastFetchedTime || (new Date()).getTime()
  newState.definitions[action.objType].lastFetched = lastFetchedTime;

  return newState;
}

/**
 * Mark a collection as dirty
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object} new state or state if no changes
 */
const handleMarkCollectionDirty = (state, action) => {
  if (state.collections[action.collectionId]) {
    let newState = Object.assign({}, state);
    newState.collections[action.collectionId].isDirty = true;
    return newState;
  }

  // No changes
  return state;
};

/**
 * Mark a flag indicating that a collection is loading
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object} new state or state if no changes
 */
const handleMarkCollectionLoading = (state, action) => {
  if (state.collections[action.collectionId]) {
    let newState = Object.assign({}, state);
    newState.collections[action.collectionId].isLoading = action.isLoading;
    return newState;
  }

  // No changes
  return state;
};

/**
 * Handle device transformations
 */
const entity = (state = initialState, action) => {

  let newState = Object.assign({}, state);

  switch (action.type) {

    case ActionTypes.ENTITY_UPDATE:
      return handleEntityUpdate(state, action);
      break;

    case ActionTypes.ENTITY_DEFINITION_UPDATE:
      return handleEntityDefinitionUpdate(state, action);
      break;

    case ActionTypes.ENTITY_COLLECTION_UPDATE:
    case ActionTypes.NOTIFICATION_UPDATE:
      return handleCollectionUpdate(state, action);
      break;

    case ActionTypes.ENTITY_COLLECTION_MARK_DIRTY:
      return handleMarkCollectionDirty(state, action);
      break;

    case ActionTypes.ENTITY_COLLECTION_LOADING:

      // Set loading flag for a collection when getting data from the server
      return handleMarkCollectionLoading(state, action);
      break;

    case ActionTypes.ENTITY_DEFINITION_UPDATE_ALL:
      for (let idx in action.entityDefinitionAllObjTypes) {
        let entityDefinitionData = action.entityDefinitionAllObjTypes[idx];

        newState = handleEntityDefinitionUpdate(newState, {
          data: entityDefinitionData,
          objType: entityDefinitionData.obj_type
        });
      }

      return newState;
      break;

    case ActionTypes.ENTITY_DEFINITION_FETCHING_ALL:
      newState.definitions.isEntityDefinitionAllObjTypesFetching = action.isEntityDefinitionAllObjTypesFetching;

      return newState;
      break;
  }

  // Leave it alone
  return state
};

export default entity;
