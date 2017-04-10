import React from 'react';
import ReactDom from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import RecurrencePatternModel from 'netric/models/entity/Recurrence';
import WeeklyComponent from 'netric/components/entity/recurrence/Weekly';
import Controls from 'netric/components/Controls';

/**
 * Test rendering the Weekly Component
 */
describe("Weekly Recurrence Component", () => {

  // Basic validation that render works in edit mode and returns children
  it("Should render", () => {

    const recurrence = new RecurrencePatternModel("task");

    recurrence.fromData({
      id: 1,
      recur_type: 2,
      interval: 123,
      day_of_week_mask: 64
    });

    const renderedDocument = ReactTestUtils.renderIntoDocument(
      <div>
        <WeeklyComponent
          recurrencePatternData={recurrence.toData()}
        />
      </div>
    );

    expect(ReactTestUtils.isDOMComponent(renderedDocument));

    const renderedDOM = ReactDom.findDOMNode(renderedDocument);
    expect(renderedDOM.innerHTML).toContain("Week");
    expect(renderedDOM.innerHTML).toContain("Interval");
    expect(renderedDOM.innerHTML).toContain("123");
    expect(renderedDOM.innerHTML).toContain("Sunday");
  });
});