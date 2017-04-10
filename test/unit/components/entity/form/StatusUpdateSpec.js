import React from 'react';
import ReactDom from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import EntityModel from 'netric/models/entity/Entity'
import EntityDefinitionModel from 'netric/models/entity/Definition'
import StatusUpdateComponent from 'netric/components/entity/form/StatusUpdate';
import Collection from 'netric/models/entity/Collection';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store'
import {mount} from 'enzyme';

const mockStore = configureMockStore([thunk]);

/**
 * Test rendering the Object Field Component
 */
describe("Status Update Component", () => {
  const entityDefComment = new EntityDefinitionModel({obj_type: "comment"});
  const entityDefProject = new EntityDefinitionModel({obj_type: "project"});
  const entityProject = new EntityModel(entityDefProject, {id: 1});

  let collection = new Collection("comment");

  collection.andWhere("owner_id").value = 1;
  collection.setOrderBy("ts_entered", "desc");
  collection.setLimit(5);

  let mockState = {
    account: {
      server: 'mock://localhost',
      user: {
        authToken: 'auth1234'
      }
    },
    device: {
      size: 7
    },
    entity: {
      definitions: {
        comment: entityDefComment.getData()
      },
      collections: {
        commentCollectionId: {
          isDirty: false,
          query: collection.queryToData(),
          results: {
            total_num: "1",
            entities: []
          },
        }
      }
    },
    browserView: {}
  };

  const store = mockStore(mockState);

  // Basic validation that render works in status update
  it("Should render render", () => {

    /*
     * Enzyme mount will depend on a library jsdom which is essentially a headless browser implemented completely in JS.
     * Mount will return the ReactWrapper: The wrapper instance around the rendered output.
     *
     * Meanwhile, the <Provider> makes the Redux store available to the connect() calls in the component hierarchy.
     * Normally, you can’t use connect() without wrapping the root component in <Provider>
     *
     * store (Redux Store): The single Redux store in your application.
     */
    const wrapper = mount(
      <Provider store={store}>
        <StatusUpdateComponent
          entity={entityProject}
        />
      </Provider>
    );

    expect(wrapper.find(StatusUpdateComponent).length).toEqual(1);
  });
});
