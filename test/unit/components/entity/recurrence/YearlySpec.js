import React from 'react';
import ReactDom from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import RecurrencePatternModel from 'netric/models/entity/Recurrence';
import YearlyComponent from 'netric/components/entity/recurrence/Yearly';
import Controls from 'netric/components/Controls';

/**
 * Test rendering the Yearly Component
 */
describe("Yearly Recurrence Component", () => {

  // Basic validation that render works in edit mode and returns children
  it("Should render Yearly", () => {

    const recurrence = new RecurrencePatternModel("task");

    recurrence.fromData({
      id: 1,
      recur_type: 5,
      month_of_year: 12,
      day_of_month: 26,
    });

    const renderedDocument = ReactTestUtils.renderIntoDocument(
      <div>
        <YearlyComponent
          recurrencePatternData={recurrence.toData()}
        />
      </div>
    );

    expect(ReactTestUtils.isDOMComponent(renderedDocument));

    const renderedDOM = ReactDom.findDOMNode(renderedDocument);
    expect(renderedDOM.innerHTML).toContain("Every");
    expect(renderedDOM.innerHTML).toContain("Day");
    expect(renderedDOM.innerHTML).toContain("26");
    expect(renderedDOM.innerHTML).toContain("12");
  });

  it("Should render Year-Nth", () => {

    const recurrence = new RecurrencePatternModel("task");

    recurrence.fromData({
      id: 1,
      recur_type: 6,
      month_of_year: 12,
      instance: 1,
      day_of_week_mask: 1
    });

    const renderedDocument = ReactTestUtils.renderIntoDocument(
      <div>
        <YearlyComponent
          recurrencePatternData={recurrence.toData()}
        />
      </div>
    );

    expect(ReactTestUtils.isDOMComponent(renderedDocument));

    const renderedDOM = ReactDom.findDOMNode(renderedDocument);
    expect(renderedDOM.innerHTML).toContain("12");
    expect(renderedDOM.innerHTML).toContain("The First");
    expect(renderedDOM.innerHTML).toContain("Sunday");
  });
});