import {getDefinition} from 'netric/models/entity/definitionLoader';
import { applyMiddleware, createStore } from 'redux';
import 'isomorphic-fetch';
import fetchMock from 'fetch-mock';

// Setup mock store

describe("definitionLoader fetch", () => {

  const definition = { obj_type: 'test', views:[], default_view:1 };
  const mockServer = 'mock://mockhost';

  /**
   * Setup each test
   */
  beforeEach(() => {
    // Mock out endpoint for getting a definition
    fetchMock.mock(
      '/svr/entity/getDefinition?obj_type=test',
      definition
    );
  });

  /**
   * Cleanup each test
   */
  afterEach(() => {
    fetchMock.restore();
  });

  it("should return a definition with getDefinition", (done) => {
    getDefinition('test', (loadedDefinition) => {
      expect(loadedDefinition.objType).toEqual(definition.obj_type);
      done();
    });
  });
});
