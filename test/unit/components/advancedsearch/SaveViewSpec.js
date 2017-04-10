import React from 'react';
import ReactDom from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import BrowserViewModel from 'netric/models/entity/BrowserView';
import SaveViewComponent from 'netric/components/advancedsearch/SaveView';
import Controls from 'netric/components/Controls';

/**
 * Test rendering the Advanced Search Column View
 */
describe("Advanced Search Save View Component", () => {

  // Basic validation that render works in edit mode and returns children
  it("Should render", () => {

    let currentBrowserView = new BrowserViewModel("customer");
    currentBrowserView.id = 1;
    currentBrowserView.name = "current browser view";
    currentBrowserView.description = "current description"

    const renderedDocument = ReactTestUtils.renderIntoDocument(
      <div>
        <SaveViewComponent
          browserViewData={currentBrowserView.getData()}
        />
      </div>
    );

    expect(ReactTestUtils.isDOMComponent(renderedDocument));

    const renderedDOM = ReactDom.findDOMNode(renderedDocument);
    expect(renderedDOM.innerHTML).toContain("current browser view");
    expect(renderedDOM.innerHTML).toContain("current description");
  });

  it("Should render error message when no browser name", () => {

    let currentBrowserView = new BrowserViewModel("customer");
    currentBrowserView.id = 1;
    currentBrowserView.name = "";
    currentBrowserView.description = "current description"

    const renderedDocument = ReactTestUtils.renderIntoDocument(
      <div>
        <SaveViewComponent
          browserViewData={currentBrowserView.getData()}
        />
      </div>
    );

    expect(ReactTestUtils.isDOMComponent(renderedDocument));

    const renderedDOM = ReactDom.findDOMNode(renderedDocument);
    expect(renderedDOM.innerHTML).toContain("View Name is Required.");
  });
});
