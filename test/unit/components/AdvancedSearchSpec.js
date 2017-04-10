import React from 'react';
import ReactDom from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import FieldModel from 'netric/models/entity/definition/Field';
import BrowserViewModel from 'netric/models/entity/BrowserView';
import EntityDefinitionModel from 'netric/models/entity/Definition';
import AdvancedSearchComponent from 'netric/components/AdvancedSearch';
import Controls from 'netric/components/Controls';

/**
 * Test rendering the Advanced Search Column View
 */
describe("Advanced Search Component", () => {

  // Basic validation that render works in edit mode and returns children
  it("Should render", () => {

    const currentBrowserView = new BrowserViewModel("note");
    currentBrowserView.id = 1;
    currentBrowserView.name = "current browser view";
    currentBrowserView.addOrderBy("name", "asc");
    currentBrowserView.addOrderBy("title", "desc");
    currentBrowserView.addTableColumn("name");
    currentBrowserView.addTableColumn("title");

    const nameField = new FieldModel({
      id: 1,
      title: "Test My Name Column",
      name: "name"
    });

    const titleField = new FieldModel({
      id: 2,
      title: "Test My Title Column",
      name: "title"
    });

    const entityDef = new EntityDefinitionModel({
      obj_type: "note",
      fields: {
        name: nameField,
        title: titleField
      }
    });

    const renderedDocument = ReactTestUtils.renderIntoDocument(
      <div>
        <AdvancedSearchComponent
          objType={"note"}
          definitionData={entityDef.getData()}
          browserViewData={currentBrowserView.getData()}
        />
      </div>
    );

    expect(ReactTestUtils.isDOMComponent(renderedDocument));

    const renderedDOM = ReactDom.findDOMNode(renderedDocument);
    expect(renderedDOM.innerHTML).toContain("Test My Name Column");
    expect(renderedDOM.innerHTML).toContain("Test My Title Column");
    expect(renderedDOM.innerHTML).toContain("Ascending");
    expect(renderedDOM.innerHTML).toContain("Descending");
  });
});
