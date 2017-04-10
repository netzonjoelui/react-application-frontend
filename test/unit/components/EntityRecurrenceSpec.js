import React from 'react';
import ReactDom from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import RecurrencePatternModel from 'netric/models/entity/Recurrence';
import EntityRecurrenceComponent from 'netric/components/EntityRecurrence';
import Controls from 'netric/components/Controls';

/**
 * Test rendering the Daily Component
 */
describe("Entity Recurrence Component", () => {

  // Basic validation that render works in edit mode and returns children
  it("Should render", () => {

    const recurrence = new RecurrencePatternModel("task");

    recurrence.fromData({
      id: 1,
      recur_type: 3, // Monthly Recurrence
      interval: 123,
      day_of_month: 26,
    });

    const renderedDocument = ReactTestUtils.renderIntoDocument(
      <div>
        <EntityRecurrenceComponent
          recurrencePatternData={recurrence.toData()}
          editMode={false}
          deviceSize={7}
        />
      </div>
    );

    expect(ReactTestUtils.isDOMComponent(renderedDocument));

    const renderedDOM = ReactDom.findDOMNode(renderedDocument);
    expect(renderedDOM.innerHTML).toContain(recurrence.getHumanDesc());
  });
});