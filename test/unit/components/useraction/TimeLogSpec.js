import ReactTestUtils from 'react-addons-test-utils';
import TimeLogComponent from 'netric/components/useraction/TimeLog';
import React from 'react';

/**
 * Test rendering the TimeLog component
 */
describe("TimeLog User Action component", () => {
  // Basic validation that render works and returns children
  it("Should render", () => {
    const renderer = ReactTestUtils.createRenderer();
    renderer.render(
      <TimeLogComponent
        entityIds={[1]}
        entityNames={['task time log']}
        onCompleted={() => {}}
      />
    );
    const result = renderer.getRenderOutput();

    // Test that the result type if a function
    expect(typeof result.type).toEqual("function");

    /*
     * Since in TimeLog user action component we used the EntityContainer as an output
     * Then we can test its props to make sure that the TimeLog component is working properly
     */
    expect(result.props.initEntityData).toEqual({task_id: 1, task_id_fval: 'task time log'})
    expect(result.props.objType).toEqual("time")
  });

});
