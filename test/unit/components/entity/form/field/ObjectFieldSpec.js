import React from 'react';
import ReactDom from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import FormNodeModel from 'netric/models/entity/form/FormNode';
import EntityModel from 'netric/models/entity/Entity'
import EntityDefinitionModel from 'netric/models/entity/Definition'
import FieldModel from 'netric/models/entity/definition/Field';
import ObjectFieldComponent from 'netric/components/entity/form/field/ObjectField';
import ObjectSelectComponent from 'netric/components/entity/ObjectSelect';

/**
 * Test rendering the Object Field Component
 */
describe("Object Field Component", () => {
  const projectStoryField = new FieldModel({
    id: 1,
    title: "story",
    name: "story_id",
    subtype: "project_story",
    type: "object"
  });

  const entityDefTask = new EntityDefinitionModel({
    obj_type: "task",
    fields: {
      story_id: projectStoryField
    }
  });
  const entityTask = new EntityModel(entityDefTask, {id: 1, story_id: "1", story_id_fval: "task project story"});

  let elementNode = new FormNodeModel('Field');

  // Set the name attribute for this element node
  elementNode.setAttribute('name', 'story_id');

  // Basic validation that render works in edit mode and returns children with Object Select Component
  it("Should render in edit mode", () => {

    const renderedDocument = ReactTestUtils.renderIntoDocument(
      <ObjectFieldComponent
        elementNode={elementNode}
        entity={entityTask}
        editMode={true}
      />
    );

    expect(ReactTestUtils.isDOMComponent(renderedDocument));
    const renderedDOM = ReactDom.findDOMNode(renderedDocument);
    expect(renderedDOM.innerHTML).toContain("task project story");
  });

  // Basic validation that render works in display mode and returns children with divs
  it("Should render in display mode (non-edit mode)", () => {
    const renderedDocument = ReactTestUtils.renderIntoDocument(
      <ObjectFieldComponent
        elementNode={elementNode}
        entity={entityTask}
        editMode={false}
      />
    );

    expect(ReactTestUtils.isDOMComponent(renderedDocument));

    const renderedDOM = ReactDom.findDOMNode(renderedDocument);
    expect(renderedDOM.innerHTML).toContain("task project story");
  });
});
