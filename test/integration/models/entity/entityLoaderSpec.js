import {getEntity} from 'netric/models/entity/entityLoader';
import { applyMiddleware, createStore } from 'redux';
import 'isomorphic-fetch';
import fetchMock from 'fetch-mock';

// Setup mock store

describe("entityLoader fetch", () => {

  const definition = { obj_type: 'test', views:[], default_view:1 };
  const testEntity = { id:'123', obj_type: 'test', name: 'tester' };
  const mockServer = 'mock://mockhost';

  /*
   * Setup each test
   */
  beforeEach(() => {
    // Mock out endpoint for getting a definition
    fetchMock.mock(
      '/svr/entity/getDefinition?obj_type=test',
      definition
    );

    // Mock out endpoint for getting a definition
    fetchMock.mock(
      '/svr/entity/get?obj_type=test&id=123',
      testEntity
    );
  });

  /*
   * Cleanup each test
   */
  afterEach(() => {
    fetchMock.restore();
  });

  it("should return an entity with getEntity", (done) => {
    getEntity('test', 123, (entity) => {
      expect(entity.id).toEqual(testEntity.id);
      done();
    });
  });
});
