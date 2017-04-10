import {login, logout, fetchAvailableAccountsForEmail } from 'netric/actions/account';
import {
  ACCOUNT_UPDATE,
  ACCOUNT_FETCHING,
  ACCOUNT_USER_AUTHENTICATING,
  ACCOUNT_USER_UPDATE,
  ACCOUNT_USER_LOGOUT
} from 'netric/actions/account';
import { MODULES_AVAILABLE_UPDATE, MODULE_UPDATE_DEFAULT } from 'netric/actions/module';
import server from 'netric/server';
import { applyMiddleware, createStore } from 'redux';
import 'isomorphic-fetch';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)


describe("Account pure actions", () => {

  // TODO: Define

});
