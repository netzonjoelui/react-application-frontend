import Recurrence from 'netric/models/entity/Recurrence';

/**
 * Test the setting up of data for recurrence daily pattern
 */
describe("Setup Recurrence Daily Pattern", function() {
    var recurrenceObject = new Recurrence("task");
    var types = recurrenceObject.getRecurrenceTypes();

    var data = {
        recur_type: types.DAILY,
        interval: 26,
        date_start: "12/04/2015",
        date_end: "12/11/2015"
    }

    recurrenceObject.fromData(data);
    it("Should have setup the data for daily pattern", function() {
        expect(recurrenceObject.type).toEqual(types.DAILY);
        expect(recurrenceObject.interval).toEqual(data.interval);
    });

    var humanDesc = recurrenceObject.getHumanDesc();
    it("Should return the human description", function() {
        expect(humanDesc).toEqual("Every 26 days effective 12/04/2015 until 12/11/2015");
    });

    var dateStart = recurrenceObject.getDateStart();
    it("Should return the human description", function() {
        expect(dateStart).toEqual(data.date_start);
    });

    var dateEnd = recurrenceObject.getDateEnd();
    it("Should return the human description", function() {
        expect(dateEnd).toEqual(data.date_end);
    });
});

/**
 * Test the setting up of data for recurrence weekly pattern
 */
describe("Setup Recurrence Weekly Pattern", function() {
    var recurrenceObject = new Recurrence("task");
    var types = recurrenceObject.getRecurrenceTypes();

    var data = {
        recur_type: types.WEEKLY,
        day_of_week_mask: recurrenceObject.weekdays.FRIDAY | recurrenceObject.weekdays.SATURDAY,
        interval: 26
    }

    recurrenceObject.fromData(data);

    it("Should have setup the data for weekly pattern", function() {
        expect(recurrenceObject.type).toEqual(types.WEEKLY);
        expect(recurrenceObject.interval).toEqual(data.interval);
    });

    var daysOfWeek = recurrenceObject.getDaysOfWeek();
    it("Should get the selected day of week", function() {
        expect(daysOfWeek.Sunday).toEqual(0);
        expect(daysOfWeek.Friday).toEqual(recurrenceObject.weekdays.FRIDAY);
        expect(daysOfWeek.Saturday).toEqual(recurrenceObject.weekdays.SATURDAY);
    });

    // Lets try adding a new dayOfWeek in the dayOfWeekMask
    recurrenceObject.setDayOfWeek(recurrenceObject.weekdays.MONDAY, true);
    var daysOfWeek = recurrenceObject.getDaysOfWeek();
    it("Should set the monday as selected", function() {
        expect(daysOfWeek.Monday).toEqual(recurrenceObject.weekdays.MONDAY);
    });
});

/**
 * Test the setting up of data for recurrence month/year pattern
 */
describe("Setup Recurrence Month/Year Pattern", function() {
    var recurrenceObject = new Recurrence("task");
    var types = recurrenceObject.getRecurrenceTypes();

    var data = {
        recur_type: types.MONTHLY,
        interval: 26,
        instance: 3,
        day_of_month: 3,
        month_of_year: 3,
        day_of_week_mask: recurrenceObject.weekdays.FRIDAY
    }

    recurrenceObject.fromData(data);
    it("Should have setup the data for month/year pattern", function() {
        expect(recurrenceObject.interval).toEqual(data.interval);
        expect(recurrenceObject.instance).toEqual(data.instance);
        expect(recurrenceObject.dayOfMonth).toEqual(data.day_of_month);
        expect(recurrenceObject.monthOfYear).toEqual(data.month_of_year);
        expect(recurrenceObject.dayOfWeekMask).toEqual(recurrenceObject.weekdays.FRIDAY);
    });

    var selectedDay = recurrenceObject.getSelectedDay();
    it("Should get the details of the selected day", function() {
        expect(selectedDay[0].index).toEqual(5); // This is referring to the index value of the selected day
        expect(selectedDay[0].label).toEqual('Friday');
    });

    // Lets try exporting the data from the recurrence entity
    var recurrenceData = recurrenceObject.toData();
    it("Should have get the pattern data", function() {
        expect(recurrenceData.interval).toEqual(recurrenceObject.interval);
        expect(recurrenceData.instance).toEqual(recurrenceObject.instance);
        expect(recurrenceData.day_of_month).toEqual(recurrenceObject.dayOfMonth);
        expect(recurrenceData.month_of_year).toEqual(recurrenceObject.monthOfYear);
        expect(recurrenceData.day_of_week_mask).toEqual(recurrenceObject.weekdays.FRIDAY);
    });
});

/**
 * Test the public functions
 */
describe("Test recurrence public functions", function() {
    var recurrenceObject = new Recurrence("task");
    var types = recurrenceObject.getRecurrenceTypes();

    var data = {
        recur_type: types.MONTHNTH,
        interval: 26,
        instance: 3,
        day_of_month: 3,
        month_of_year: 3,
        day_of_week_mask: recurrenceObject.weekdays.FRIDAY
    }

    recurrenceObject.fromData(data);

    var selectedTypeIndex = recurrenceObject.getRecurrenceTypeOffset();
    it("Should selectedTypeIndex have the monthly value", function() {
        expect(selectedTypeIndex).toEqual(parseInt(types.MONTHLY));
    });

    recurrenceObject.reset();
    it("Should reset the pattern values", function() {
        expect(recurrenceObject.interval).toEqual(1);
        expect(recurrenceObject.dayOfMonth).toBeNull();
        expect(recurrenceObject.monthOfYear).toBeNull();
    });

    recurrenceObject.setDefaultValues();
    it("Should set the default values for MonthNth", function() {
        expect(recurrenceObject.interval).toEqual(1);
        expect(recurrenceObject.instance).toEqual('1');
        expect(recurrenceObject.dayOfWeekMask).toEqual(recurrenceObject.weekdays.SUNDAY);
    });
});
