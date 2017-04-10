import Definition from 'netric/models/entity/Definition';
import Entity from 'netric/models/entity/Entity';

/**
 * Test loading definitions asynchronously and make sure it gets cached for future requests
 */
describe("Get and Set Entity Values", function() {
	var entity = null;

	// Setup test entity
	beforeEach(function() {
		var definition = new Definition({
			obj_type: "test",
			title: "Test Object",
			id: "1",
			fields: [
				{
					"id" : 2,
					"name" : "id",
					"title" : "Id",
					"type" : "number",
					"subtype" : "integer",
					"default_val" : {
						"on" : "null",
						"value" : "3"
					},
					"mask" : "xxx,xxx",
					"required" : true,
					"system" : true,
					"readonly" : true,
					"unique" : true,
					"use_when" : "",
					"optional_values" : ""
				},
				{
					"id" : 3,
					"name" : "name",
					"title" : "Name",
					"type" : "string",
					"subtype" : "",
					"default_val" : null,
				},
				{
					"id" : 5,
					"name" : "status",
					"title" : "Status",
					"type" : "fkey",
					"subtype" : "",
					"default_val" : null,
				},
				{
					"id" : 6,
					"name" : "categories",
					"title" : "Cateogires",
					"type" : "fkey_multi",
					"subtype" : "",
					"default_val" : null,
				},
				{
					"id" : 6,
					"name" : "person",
					"title" : "Person",
					"type" : "object",
					"subtype" : "customer",
					"default_val" : null,
				},
				{
					"id" : 7,
					"name" : "people",
					"title" : "People",
					"type" : "object_multi",
					"subtype" : "customer",
					"default_val" : null,
				},
				{
					"id" : 8,
					"name" : "obj_reference",
					"title" : "Reference",
					"type" : "object",
					"subtype" : "",
					"default_val" : null,
				}
			]
		});
		entity = new Entity(definition);
	});

	it("should be able to get and set string values", function() {
		var testStr = "My Test Value";
		entity.setValue("name", testStr);
		expect(entity.getValue("name")).toEqual(testStr);
	});

	it("should be able to get and set fkey values with valueNames", function() {
		var statusName = "My Test Value";
		var statusId = 2;
		entity.setValue("status", statusId, statusName);
		expect(entity.getValue("status")).toEqual(statusId);
		expect(entity.getValueName("status")).toEqual(statusName);
	});

	it("should be able to get and set object values with valueNames", function() {
		var objRefName = "Test Customer ObjRef";
		var ObjRefValue = "customer:1";
		entity.setValue("obj_reference", ObjRefValue, objRefName);
		expect(entity.getValue("obj_reference")).toEqual(ObjRefValue);
		expect(entity.getValueName("obj_reference", ObjRefValue)).toEqual(objRefName);
	});

	it("should be able to get and add fkey_multi values with valueNames", function() {
		var catName = "My Test Value";
		var catId = 2;
		entity.addMultiValue("categories", catId, catName);
		expect(entity.getValue("categories")).toEqual([catId]);
		expect(entity.getValueName("categories")).toEqual([{key: catId, value:catName}]);
		expect(entity.getValueName("categories", catId)).toEqual(catName);
	});

	it("should be able to remove fkey_multi fields", function() {
		var catName = "My Third Test Value";
		var catId = 3;
		entity.addMultiValue("categories", catId, catName);
		expect(entity.getValue("categories")).toContain(catId);
		expect(entity.remMultiValue("categories", catId)).toBeTruthy();
		expect(entity.getValue("categories")).not.toContain(catId);
	});

	it("should loadData for *_multi fields", function() {
		var catName = "My Test Value";
		var catId = 2;

		var data = {
			id: 1,
			obj_type: "customer",
			"categories": [catId],
			"categories_fval": {"2":catName}
		};

		entity.loadData(data);
		expect(entity.getValue("categories")).toEqual([catId]);
		expect(entity.getValueName("categories")).toEqual([{key: catId, value:catName}]);
		expect(entity.getValueName("categories", catId)).toEqual(catName);
	});

	it("should loadData for string fields", function() {
		var data = {
			id: 1,
			obj_type: "customer",
			"name": "test"
		};

		entity.loadData(data);
		expect(entity.getValue("name")).toEqual(data.name);
	});

	it("should getData for string fields", function() {
		entity.setValue("name", "test");
		var data = entity.getData();
		expect(data.name).toEqual("test");
	});

	it("should getData for *_multi fields", function() {
		var catName = "My Test Value";
		var catId = 2;
		entity.addMultiValue("categories", catId, catName);

		var data = entity.getData();
		expect(data.categories).toEqual([catId]);
		var expRet = {};
		expRet[catId] = catName;
		expect(data.categories_fval).toEqual(expRet);
	});
});

/**
 * Test setting of default values
 */
describe("Set default values for new entities", function() {
	var entity = null;

	// Setup test entity
	beforeEach(function() {
		var definition = new Definition({
			obj_type: "test",
			title: "Test Object",
			id: "", // Id is blank to specify that we are creating a new entity
			fields: [
				{
					"id" : 1,
					"name" : "owner_id",
					"title" : "Owner",
					"type" : "object",
					"subtype" : "user",
					"default_val" : {
						on: "create",
						value: -3
					},
				},
				{
					"id" : 2,
					"name" : "creator_id",
					"title" : "Creator",
					"type" : "object",
					"subtype" : "user",
					"default_val" : {
						on: "null",
						value: -3
					},
				},
				{
					"id" : 3,
					"name" : "project_id",
					"title" : "Project",
					"type" : "object",
					"subtype" : "project",
					"default_val" : null,
				}
			]
		});
		entity = new Entity(definition);
	});

	it("should be able to set default values using the 'create' event name", function() {

		// Set default values for the entity
		entity.setDefaultValues("create");

		// owner_id should have the default value
		expect(entity.getValue("owner_id")).toEqual(-3);

		// since the default.on for creator_id is null, then it cannot set the default value
		expect(entity.getValue("creator_id")).toBe(null);

		// since we did not specify a default value, this should be null
		expect(entity.getValue("project_id")).toBe(null);
	});

	it("should be able to set default values using the 'null' event name", function() {

		// Set default values for the entity
		entity.setDefaultValues("null");

		// since the default.on for owner_id is 'create', then it cannot set the default value
		expect(entity.getValue("owner_id")).toBe(null);

		// creator_id should have the default value
		expect(entity.getValue("creator_id")).toEqual(-3);

		// since we did not specify a default value, this should be null
		expect(entity.getValue("project_id")).toBe(null);
	});

	it("should be able to set default values from defaultData source", function() {

		var creator = "Project Creator";
		var creatorId = 1;

		var defaultData = {
			creator_id: creatorId,
			creator_id_fval: creator,
		};

		// Set default values for the entity from source
		entity.setDefaultValues("create", defaultData);

		// project_id should be updated using the default data
		expect(entity.getValue("creator_id")).toEqual(creatorId);
		expect(entity.getValueName("creator_id")).toEqual(creator);
		expect(entity.getValueName("creator_id", creatorId)).toEqual(creator);

		// owner_id should have the default value
		expect(entity.getValue("owner_id")).toEqual(-3);
	});

	it("should NOT be able to set default values", function() {

		entity.setValue("owner_id", 1);

		// Try to set default values for the entity using the 'update' event name
		entity.setDefaultValues("update");

		// since we set the value for owner_id, it should have 1 instead of the default value
		expect(entity.getValue("owner_id")).toEqual(1);
	});
});

/**
 * Test setting of default values
 */
describe("Test the Members Entity", function() {
	var entity = null;
	var member = null;

	// Setup test entity
	beforeEach(function() {
		var definition = new Definition({
			obj_type: "test",
			title: "Test Object",
			id: "", // Id is blank to specify that we are creating a new entity
			fields: [
				{
					"id" : 1,
					"name" : "owner_id",
					"title" : "Owner",
					"type" : "object",
					"subtype" : "user",
					"default_val" : {
						on: "create",
						value: -3
					},
				},
				{
					"id" : 2,
					"name" : "creator_id",
					"title" : "Creator",
					"type" : "object",
					"subtype" : "user",
					"default_val" : {
						on: "null",
						value: -3
					},
				},
				{
					"id" : 3,
					"name" : "project_id",
					"title" : "Project",
					"type" : "object",
					"subtype" : "project",
					"default_val" : null,
				}
			]
		});
		entity = new Entity(definition);

		var memberDef = new Definition({
			obj_type: "member",
			id: null,
			fields: [
				{
					"id" : 1,
					"name" : "id",
					"title" : "id",
					"type" : "text",
				},
				{
					"id" : 2,
					"name" : "name",
					"title" : "name",
					"type" : "text",
				}
			]
		});
		member = new Entity(memberDef);
		member.setValue("name", "[user:1:test user]");

		entity.setMemberEntity("attendees");
		entity.getMemberEntity("attendees").add(member);
	});

	it("should add a member and not able to add duplicate member", function() {
		expect(entity.getMemberEntity("attendees")).not.toBeNull();
		expect(entity.getMemberEntity("attendees").getAll().length).toEqual(1);

		// Lets try adding again the same member, it should not add again since we do not allow duplicates
		entity.getMemberEntity("attendees").add(member);
		expect(entity.getMemberEntity("attendees").getAll().length).toEqual(1);
	});

	it("should get all members", function() {
		var members = entity.getMemberEntity("attendees").getAll();
		expect(members.length).toEqual(1);
	});

	it("should get new members", function() {
		var newMembers = entity.getMemberEntity("attendees").getNewMembers();
		expect(newMembers.length).toEqual(1);
		expect(newMembers[0].name).toEqual(member.getValue("name"));
	});

	it("should get all members", function() {
		entity.getMemberEntity("attendees").remove(member.id, member.getValue("name"));
		expect(entity.getMemberEntity("attendees").getAll().length).toEqual(0);
	});
});

/**
 * Test setting of default values
 */
describe("Test the encoding/decoding of object reference", function() {
	var member = null;

	// Setup test entity
	beforeEach(function() {
		var memberDef = new Definition({
			obj_type: "member",
			id: null,
			fields: [
				{
					"id" : 1,
					"name" : "id",
					"title" : "id",
					"type" : "text",
				},
				{
					"id" : 2,
					"name" : "name",
					"title" : "name",
					"type" : "text",
				}
			]
		});
		member = new Entity(memberDef);
	});

	it("should decode the object reference", function() {
		var ref = member.encodeObjRef("user", 1, "user test");

		expect(ref).toEqual("[user:1:user test]");
	});

	it("should encode the object reference", function() {
		var ref = member.decodeObjRef("[user:1:user test]");
		expect(ref.objType).toEqual('user');
		expect(ref.id).toEqual('1');
		expect(ref.name).toEqual('user test');

		var ref = member.decodeObjRef("user:1");
		expect(ref.objType).toEqual('user');
		expect(ref.id).toEqual('1');
	});
});
