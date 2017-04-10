import ReactTestUtils from 'react-addons-test-utils';
import LoginComponent from 'netric/components/login/Login';
import React from 'react';

/**
 * Test rendering the login component
 */
describe("Login component", () => {

  // Basic validation that render works and returns children
  it("Should render", () => {
    const renderer = ReactTestUtils.createRenderer();
    renderer.render(
      React.createElement(
        LoginComponent,
        { accounts: [{title: "test", instanceUrl: "local://localhost"}] }
      )
    );
    const result = renderer.getRenderOutput();
    expect(result.props.children.length).toBeGreaterThan(0);
  });

});
