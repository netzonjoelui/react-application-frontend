import EntityCollection from 'netric/models/entity/Collection';

/**
 * Test loading definitions asynchronously and make sure it gets cached for future requests
 */
describe("Entity Collection", function() {

    /*
     // Setup test entity
     beforeEach(function() {

     });
     */

    it("can take andWhere conditions", function() {
        var collection = new EntityCollection("customer");
        collection.where("first_name").equalTo("test");
        expect(collection.getConditions().length).toEqual(1);
    });

    it("can take andWhere conditions", function() {
        var collection = new EntityCollection("customer");
        collection.where("first_name").equalTo("test");
        collection.orWhere("last_name").equalTo("test");
        var conditions = collection.getConditions();
        expect(conditions.length).toEqual(2);
        expect(conditions[0].fieldName).toEqual("first_name");
        expect(conditions[0].operator).toEqual("is_equal");
        expect(conditions[0].bLogic).toEqual("and");
        expect(conditions[0].value).toEqual("test");
    });

    it("sets the limit", function() {
        var collection = new EntityCollection("customer");
        collection.setLimit(50);
        expect(collection.getLimit()).toEqual(50);
    });

    it("sets the offset", function() {
        var collection = new EntityCollection("customer");
        collection.setOffset(50);
        expect(collection.getOffset()).toEqual(50);
    });

    it("sets order by", function() {
        var collection = new EntityCollection("customer");
        collection.setOrderBy("first_name", EntityCollection.orderByDir.DESC);
        var orderBy = collection.getOrderBy();
        expect(orderBy[0].getFieldName()).toEqual("first_name");
        expect(orderBy[0].getDirection()).toEqual(EntityCollection.orderByDir.DESC);
    });

});
