import React from 'react';
import ReactDom from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import RecurrencePatternModel from 'netric/models/entity/Recurrence';
import MonthlyComponent from 'netric/components/entity/recurrence/Monthly';
import Controls from 'netric/components/Controls';

/**
 * Test rendering the Monthly Component
 */
describe("Monthly Recurrence Component", () => {

  // Basic validation that render works in edit mode and returns children
  it("Should render Monthly", () => {

    const recurrence = new RecurrencePatternModel("task");

    recurrence.fromData({
      id: 1,
      recur_type: 3, // Monthly Recurrence
      interval: 123,
      day_of_month: 26,
    });

    const renderedDocument = ReactTestUtils.renderIntoDocument(
      <div>
        <MonthlyComponent
          recurrencePatternData={recurrence.toData()}
        />
      </div>
    );

    expect(ReactTestUtils.isDOMComponent(renderedDocument));

    const renderedDOM = ReactDom.findDOMNode(renderedDocument);
    expect(renderedDOM.innerHTML).toContain("Day");
    expect(renderedDOM.innerHTML).toContain("Month");
    expect(renderedDOM.innerHTML).toContain("26");
    expect(renderedDOM.innerHTML).toContain("123");
  });

  it("Should render Month-Nth", () => {

    const recurrence = new RecurrencePatternModel("task");

    recurrence.fromData({
      id: 1,
      recur_type: 4,
      interval: 123,
      instance: 1,
      day_of_week_mask: 1
    });

    const renderedDocument = ReactTestUtils.renderIntoDocument(
      <div>
        <MonthlyComponent
          recurrencePatternData={recurrence.toData()}
        />
      </div>
    );

    expect(ReactTestUtils.isDOMComponent(renderedDocument));

    const renderedDOM = ReactDom.findDOMNode(renderedDocument);
    expect(renderedDOM.innerHTML).toContain("Month");
    expect(renderedDOM.innerHTML).toContain("123");
    expect(renderedDOM.innerHTML).toContain("The First");
    expect(renderedDOM.innerHTML).toContain("Sunday");
  });
});