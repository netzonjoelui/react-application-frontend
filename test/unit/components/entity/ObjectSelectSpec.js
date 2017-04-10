import React from 'react';
import ReactDom from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import FieldModel from 'netric/models/entity/definition/Field';
import ObjectSelectComponent from 'netric/components/entity/ObjectSelect';
import Controls from 'netric/components/Controls';

/**
 * Test rendering the Object Field Component
 */
describe("Object Select Component", () => {

  const projectStoryField = new FieldModel({
    id: 1,
    title: "story",
    name: "story_id",
    subtype: "project_story",
    type: "object"
  });

  // Basic validation that render works in edit mode and returns children
  it("Should render", () => {

    const renderedDocument = ReactTestUtils.renderIntoDocument(
      <ObjectSelectComponent
        objType={"task"}
        field={projectStoryField}
        value="1"
        label="task project story"
      />
    );

    expect(ReactTestUtils.isDOMComponent(renderedDocument));

    const renderedDOM = ReactDom.findDOMNode(renderedDocument);
    expect(renderedDOM.innerHTML).toContain("task project story");
  });
});
