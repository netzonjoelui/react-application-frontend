import Definition from '../../models/entity/Definition';
import {fetchEntityDefinition} from '../../actions/entity';
import log from '../../log';
import globalStore from '../../store';

/**
 * Get an entity definition and call a callback when loaded
 *
 * @param {string} objType The type of entity definition being loaded
 * @param {function} cbLoaded Callback to be executed when the definition is loaded
 * @param {Object} reduxStore Alternate store to use
 * @returns {Entity}
 */
export const getDefinition = (objType, cbLoaded, reduxStore = null) => {
  const store = reduxStore || globalStore;
  const state = store.getState();

  if (state.entity.definitions[objType]) {
    cbLoaded(new Definition(state.entity.definitions[objType]));
  } else {
    store.dispatch(fetchEntityDefinition(objType, state.account.user.authToken, state.account.server)).then(
      () => {cbLoaded(new Definition(state.entity.definitions[objType])); },
      (result) => { log.error("Failed to get entity definition", result)})
  }
};

// Export get and factory default functions if not called directly
export default {
  get: getDefinition
};
