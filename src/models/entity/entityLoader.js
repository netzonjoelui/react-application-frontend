import Entity from './Entity';
import {getDefinition} from './definitionLoader';
import {fetchEntity} from '../../actions/entity';
import log from '../../log';
import store from '../../store';

/**
 * Get an entity and call a callback when loaded
 * 
 * @param {string} objType The type of entity being loaded
 * @param {string} entId The unique id of the entity
 * @param {function} cbLoaded Callback to be executed when the entity is loaded
 * @returns {Entity}
 */
export const getEntity = (objType, entId, cbLoaded) => {
  const state = store.getState();
  getDefinition(objType, (def) => {
    if (state.entity.entities[objType + "-" + entId]) {
      cbLoaded(new Entity(def, state.entity.entities[objType + "-" + entId]));
    } else {
      store.dispatch(fetchEntity(objType, entId)).then(
        () => {
          cbLoaded(new Entity(def, state.entity.entities[objType + "-" + entId]));
        }, 
        (result) => { log.error("Failed to get entity", result)})
    }
  });
};

/**
 * Create a new object entity
 *
 * @param {string} objType The object type to load
 * @param {function} cbCreated Callback function once entity is initialized
 */
export const entityFactory = (objType, cbCreated) => {
  getDefinition(objType, (def) => {
    cbCreated(new Entity(def));
  });
};

// Export get and factory default functions if not called directly
export default {
  get: getEntity,
  factory: entityFactory
};
