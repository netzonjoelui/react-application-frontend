import BrowserView from 'netric/models/entity/BrowserView';
import Where from 'netric/models/entity/Where';

/**
 * Test the setting up of data for browser view
 */
describe("Setup browserView data", function () {
  const data = {
    name: 'browserViewTest',
    conditions: [],
    sort_order: [],
    table_columns: [],
  }

  // Setup where object
  var where = new Where('id');
  where.bLogic = 'and';
  where.operator = Where.operators.EQUALTO;
  where.value = -3;

  data.conditions.push(where);

  data.sort_order.push({
    field_name: 'id',
    order: 'asc'
  });

  data.table_columns.push("id");

  var browserViewObject = new BrowserView("note");
  browserViewObject.fromData(data);

  it("Should have setup data for browserView", function () {
    expect(browserViewObject.name).toEqual("browserViewTest");
    expect(browserViewObject.getConditions().length).toEqual(1);
    expect(browserViewObject.getOrderBy().length).toEqual(1);
    expect(browserViewObject.getTableColumns().length).toEqual(1);
  });

  it("Should get data for browserView", function () {
    var browserViewData = browserViewObject.getData();

    expect(browserViewData.name).toEqual("browserViewTest");
    expect(browserViewData.conditions.length).toEqual(1);
    expect(browserViewData.order_by.length).toEqual(1);
    expect(browserViewData.table_columns.length).toEqual(1);
  });

  it("Should add new condition", function () {
    browserViewObject.addCondition("id");

    expect(browserViewObject.getConditions().length).toEqual(2);
  });

  it("Should remove condition", function () {
    browserViewObject.removeCondition(0);

    expect(browserViewObject.getConditions().length).toEqual(1);
  });

  it("Should add order by", function () {
    browserViewObject.addOrderBy("name", "asc");

    expect(browserViewObject.getOrderBy().length).toEqual(2);
  });

  it("Should remove order by", function () {
    browserViewObject.removeOrderBy(0);

    expect(browserViewObject.getOrderBy().length).toEqual(1);
  });

  it("Should add table column", function () {
    browserViewObject.addTableColumn("id");

    expect(browserViewObject.getTableColumns().length).toEqual(2);
  });

  it("Should update table column", function () {
    browserViewObject.updateTableColumn('name', 0);
    var tableColumns = browserViewObject.getTableColumns();

    expect(tableColumns[0]).toEqual('name');
  });

  it("Should remove table column", function () {
    browserViewObject.removeTableColumn(0);

    expect(browserViewObject.getTableColumns().length).toEqual(1);
  });
});
