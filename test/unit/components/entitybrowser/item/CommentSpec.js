import React from 'react';
import ReactDom from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import EntityModel from 'netric/models/entity/Entity';
import EntityDefinitionModel from 'netric/models/entity/Definition'
import CommentItemComponent from 'netric/components/entitybrowser/item/Comment';

/**
 * Test rendering the Object Field Component
 */
describe("Comment Item Component", () => {

  const commentFieldData = {
    id: 1,
    title: "Comment",
    name: "comment",
    type: "text"
  };

  const ownerFieldData = {
    id: 2,
    title: "User",
    name: "owner_id",
    subtype: "user",
    type: "object"
  };

  const entityDef = new EntityDefinitionModel({obj_type: "comment", fields: [commentFieldData, ownerFieldData]});
  const commentEntity = new EntityModel(entityDef, {id: 1});

  commentEntity.loadData({
    owner_id: "1",
    owner_id_fval: "Comment Owner",
    comment: "Test Comment Here"
  });

  // Basic validation that render works in edit mode and returns children
  it("Should render", () => {

    const renderedDocument = ReactTestUtils.renderIntoDocument(
      <div>
        <CommentItemComponent
          entity={commentEntity}
        />
      </div>
    );

    expect(ReactTestUtils.isDOMComponent(renderedDocument));

    const renderedDOM = ReactDom.findDOMNode(renderedDocument);
    expect(renderedDOM.innerHTML).toContain("Test Comment Here");
    expect(renderedDOM.innerHTML).toContain("Comment Owner");
  });
});
