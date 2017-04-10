import ReactTestUtils from 'react-addons-test-utils';
import BrowserViewDropdown from 'netric/components/entitybrowser/BrowserViewDropdown';
import BrowserViewModel from 'netric/models/entity/BrowserView';
import React from 'react';

/**
 * Test rendering the Browser View Dropdown component
 */
describe("BrowserViewDropdown component", () => {
  // Basic validation that render works and returns children
  it("Should render", () => {
    const renderer = ReactTestUtils.createRenderer();
    const currentBrowserViewData = {
      obj_type: "customer",
      id: 2,
      name: "current browser view"
    };

    const browserViewTest = {
      obj_type: "customer",
      id: 3,
      name: "browser view test"
    };

    let browserViewTest2 = {
      obj_type: "customer",
      id: 4,
      name: "test browser view"
    };

    renderer.render(
      <BrowserViewDropdown
        currentBrowserViewData={currentBrowserViewData}
        browserViewDataList={[browserViewTest, browserViewTest2, currentBrowserViewData]}
        onSelectBrowserView={() => {return;}}
      />
    );
    const result = renderer.getRenderOutput();

    // Test that the result type if a function
    expect(typeof result.type).toEqual("function");

    // Since current browser view is in index 2 in the entityBrowserViews array
    expect(result.props.selectedIndex).toEqual(2);

    expect(result.props.menuItems).toEqual([{payload: 3, text: 'browser view test'}, {
      payload: 4,
      text: 'test browser view'
    }, {payload: 2, text: 'current browser view'}]);
    expect(typeof result.props.onChange).toEqual("function");
  });

});
