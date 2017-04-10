import ReactTestUtils from 'react-addons-test-utils';
import EntityBrowser from 'netric/components/entitybrowser/EntityBrowser';
import EntityModel from 'netric/models/entity/Entity'
import EntityDefinitionModel from 'netric/models/entity/Definition'
import React from 'react';

/**
 * Test rendering the Entity Browse component
 */
describe("Entity Browser component", () => {
  // Basic validation that render works and returns children
  it("Should render", () => {
    const renderer = ReactTestUtils.createRenderer();
    const entityDef = new EntityDefinitionModel({obj_type: "customer"});
    const entityTest = new EntityModel(entityDef, {id: 1});

    const currentBrowserViewData = {
      obj_type: "customer",
      id: 1,
      name: "current browser view",
      table_columns: ["id", "name", "owner_id"]
    };

    renderer.render(
      <EntityBrowser
        entities={[entityTest]}
        browserViewData={currentBrowserViewData}
      />
    );
    const result = renderer.getRenderOutput();

    // Test that the result type if a function
    expect(typeof result.type).toEqual("string");
    expect(result.props.children[0].type).toEqual("div");
  });

});
