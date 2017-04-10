// Redux
import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import reducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { saveState, loadState } from './storage';
import { routerMiddleware } from 'react-router-redux';
import routerHistory from './router-history';



// Build the middleware for intercepting and dispatching navigation actions
const routeMiddlewareHistory = routerMiddleware(routerHistory);

// Create new store logger instance
const loggerMiddleware = createLogger();

// Load previous state
const persistedState = loadState();

// lets us dispatch() functions
let middleWare = applyMiddleware(thunkMiddleware);

// Do not log the state changes while running automated tests
// TODO: This should later only work in local development OR send to the logger in debug mode
if (process.env.NODE_ENV !== "test") {
  middleWare = compose(
    applyMiddleware(
      thunkMiddleware, // lets us dispatch() functions
      loggerMiddleware, // neat middleware that logs actions
      routeMiddlewareHistory // middleware for route
    ),
    // Required! Enable Redux DevTools with the monitors you chose
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );
}

const store = createStore(reducer, persistedState, middleWare);

// Any chances should be saved to local storage
store.subscribe(() => {
  saveState(store.getState());
});

export default store;

