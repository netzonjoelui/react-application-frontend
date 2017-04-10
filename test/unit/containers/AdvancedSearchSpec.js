/*
Let's disable the Advanced Search Container unit testing for now
until we find a better way to test the containers.

import AdvancedSearchContainer from 'netric/containers/AdvancedSearchContainer';
import PageModalComponent from 'netric/components/PageModal';
import AdvancedSearchComponent from 'netric/components/AdvancedSearch';
import EntityDefinitionModel from 'netric/models/entity/Definition'
import BrowserViewModel from 'netric/models/entity/BrowserView';
import React from 'react';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store'
import {mount} from 'enzyme';

const mockStore = configureMockStore([thunk]);

**
 * Test rendering the Advanced Search Container
 *
describe("Advanced Search Container", () => {

  let mockState = {
    account: {
      server: 'mock://localhost',
      user: {
        authToken: 'auth1234'
      }
    }
  };

  it("Should render", () => {

    const currentBrowserView = new BrowserViewModel("customer");
    currentBrowserView.id = 1;
    currentBrowserView.name = "current browser view";

    mockState.entity = {
      definitions: {
        customer: {obj_type: "customer"}
      }
    }
    let store = mockStore(mockState);

    *
     * Enzyme mount will depend on a library jsdom which is essentially a headless browser implemented completely in JS.
     * Mount will return the ReactWrapper: The wrapper instance around the rendered output.
     * 
     * Meanwhile, the <Provider> makes the Redux store available to the connect() calls in the component hierarchy.
     * Normally, you can’t use connect() without wrapping the root component in <Provider>
     *
     * store (Redux Store): The single Redux store in your application.
     *
    const wrapper = mount(
      <Provider store={store}>
        <AdvancedSearchContainer
          objType="customer"
          browserViewData={currentBrowserView.getData()}
        />
      </Provider>
    );

    expect(wrapper.find(AdvancedSearchContainer).length).toEqual(1);

    const container = wrapper.find(AdvancedSearchContainer);
    expect(container.find(PageModalComponent).length).toEqual(1);
    expect(container.find(AdvancedSearchComponent).length).toEqual(1);

    const entityDefinition = new EntityDefinitionModel({obj_type: "customer"});
    expect(container.find(AdvancedSearchComponent).props().definition).toEqual(entityDefinition);

    expect(container.find(AdvancedSearchComponent).props().browserViewData).toEqual(currentBrowserView.getData());
    expect(container.find(AdvancedSearchComponent).props().objType).toEqual('customer');
  });
});
*/