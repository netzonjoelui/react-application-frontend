import ReactTestUtils from 'react-addons-test-utils';
import AppBarBrowse from 'netric/components/entitybrowser/AppBarBrowse';
import React from 'react';

/**
 * Test rendering the App Bar Browse component
 */
describe("App Bar Browse component", () => {
  // Basic validation that render works and returns children
  it("Should render", () => {
    const renderer = ReactTestUtils.createRenderer();
    const browserViewData = {
      obj_type: "customer",
      id: 2,
      name: "current browser view"
    };

    renderer.render(
      <AppBarBrowse
        currentBrowserViewData={browserViewData}
        onSelectBrowserView={()=>{return;}}
      />
    );
    const result = renderer.getRenderOutput();

    // Test that the result type if a function
    expect(typeof result.type).toEqual("function");
    expect(result.props.title).toEqual("current browser view");

    // Now let's test that app bar browse do not have a curent browser view
    renderer.render(
      <AppBarBrowse
        title="app bar browse"
        onSelectBrowserView={()=>{return;}}
      />
    );
    const resultNoTitle = renderer.getRenderOutput();

    // App bar should display the title set since we do not have a current browser view
    expect(resultNoTitle.props.title).toEqual("app bar browse");
  });

});
