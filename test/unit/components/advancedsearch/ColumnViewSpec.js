import React from 'react';
import ReactDom from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import EntityDefinitionModel from 'netric/models/entity/Definition';
import FieldModel from 'netric/models/entity/definition/Field';
import ColumnViewComponent from 'netric/components/advancedsearch/ColumnView';
import Controls from 'netric/components/Controls';

/**
 * Test rendering the Advanced Search Column View
 */
describe("Advanced Search Column View Component", () => {

  // Basic validation that render works in edit mode and returns children
  it("Should render", () => {

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
        <ColumnViewComponent
          objType={"note"}
          definitionData={entityDef.getData()}
          fieldNamesList={["name", "date"]}
        />
      </div>
    );

    expect(ReactTestUtils.isDOMComponent(renderedDocument));

    const renderedDOM = ReactDom.findDOMNode(renderedDocument);
    expect(renderedDOM.innerHTML).toContain("Test My Name Column");
    expect(renderedDOM.innerHTML).toContain("Test My Title Column");
  });
});
