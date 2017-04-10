/**
 * Load a state from localstorage
 *
 * @returns {Object|undefined}
 */
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('appstate');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch(err) {
    return undefined;
  }
};

/**
 * Save the state to local storage
 *
 * @param {object} state The entire application state tree
 */
export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('appstate', serializedState);
  } catch (err) {
    console.error("Could not access localStorage", err.message, state);
  }
};
