import React from 'react';
import ReactDom from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import EntityModel from 'netric/models/entity/Entity';
import EntityDefinitionModel from 'netric/models/entity/Definition'
import ListItemTableRowComponent from 'netric/components/entitybrowser/ListItemTableRow';

/**
 * Test rendering the Object Field Component
 */
describe("Comment Item Component", () => {

  const currentBrowserViewData = {
    obj_type: "customer",
    id: 1,
    name: "current browser view",
    table_columns: ["id", "name", "owner_id"]
  };

  const commentFieldData = {
    id: 1,
    title: "Name",
    name: "name",
    type: "text"
  };

  const ownerFieldData = {
    id: 2,
    title: "User",
    name: "owner_id",
    subtype: "user",
    type: "object"
  };

  const entityDef = new EntityDefinitionModel({obj_type: "customer", fields: [commentFieldData, ownerFieldData]});
  const userEntity = new EntityModel(entityDef, {id: 1});

  userEntity.loadData({
    owner_id: "1",
    owner_id_fval: "Custom Owner",
    name: "Test Customer"
  });

  // Basic validation that render works in edit mode and returns children
  it("Should render", () => {

    const renderedDocument = ReactTestUtils.renderIntoDocument(
      <table>
        <tbody>
          <ListItemTableRowComponent
            entity={userEntity}
            browserViewData={currentBrowserViewData}
          />
        </tbody>
      </table>
    );

    expect(ReactTestUtils.isDOMComponent(renderedDocument));

    const renderedDOM = ReactDom.findDOMNode(renderedDocument);
    expect(renderedDOM.innerHTML).toContain("Test Customer");
    expect(renderedDOM.innerHTML).toContain("Custom Owner");
  });
});
