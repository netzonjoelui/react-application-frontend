import Group from 'netric/models/entity/definition/Group';
import Groupings from 'netric/models/entity/Groupings';

/**
 * Test loading definitions asynchronously and make sure it gets cached for future requests
 */
describe("Get and Set Entity Values", function() {
    let groupings = null;
    let groupData = {
        groups: [
            {
                "id" : 1,
                "name" : "group test",
                "color" : "red",
                "sort_order" : "0",
                "children" : [],
                "is_heiarch" : true,
                "is_system" : false,
                "parent_id" : null,
            },
            {
                "id" : 2,
                "name" : "group test has parent",
                "color" : "green",
                "sort_order" : "0",
                "children" : [],
                "is_heiarch" : true,
                "is_system" : false,
                "parent_id" : 1,
            },
            {
                "id" : 3,
                "name" : "group test has same parent",
                "color" : "blue",
                "sort_order" : "0",
                "children" : [],
                "is_heiarch" : true,
                "is_system" : false,
                "parent_id" : 1,
            },
            {
                "id" : 4,
                "name" : "another group test",
                "color" : "blue",
                "sort_order" : "0",
                "children" : [],
                "is_heiarch" : true,
                "is_system" : false,
                "parent_id" : null,
            }
        ]
    };

    // Setup test groupings
    beforeEach(function() {
        groupings = new Groupings("note", "groups");

        groupData.filter = {"user_id" : -9};
        groupings.fromArray(groupData);

    });

    it("it should be able to set group data ", function() {

        let groups = groupings.getGroups();

        expect(groups[0].constructor.name).toEqual('Group');

        expect(groups[0].id).toEqual(groupData.groups[0].id);
        expect(groups[1].id).toEqual(groupData.groups[1].id);
        expect(groups[2].id).toEqual(groupData.groups[2].id);
        expect(groups[3].id).toEqual(groupData.groups[3].id);

        expect(groups.length).toEqual(4);
        expect(groupings.filter).toEqual(groupData.filter);
    });

    it("it should be able to add new group", function() {
        let newGroup = new Group({
            "id" : 5,
            "name" : "new group",
            "color" : "white",
            "sort_order" : "0",
            "children" : [],
            "is_heiarch" : true,
            "is_system" : false,
            "parent_id" : null,
        });

        groupings.addGroup(newGroup);

        let groups = groupings.getGroups();

        expect(groups[4].constructor.name).toEqual('Group');
        expect(groups[4].id).toEqual(newGroup.id);
        expect(groups.length).toEqual(5);
    });

    it("it should be able to update a group", function() {
        let updateGroup = new Group({
            "id" : groupData.groups[0].id,
            "name" : "updated group",
            "color" : "white",
            "sort_order" : "0",
            "children" : [],
            "is_heiarch" : true,
            "is_system" : false,
            "parent_id" : null,
        });

        groupings.updateGroup(updateGroup);

        let groups = groupings.getGroups();

        expect(groups[0].constructor.name).toEqual('Group');
        expect(groups[0].name).toEqual(updateGroup.name);
        expect(groups[0].color).toEqual(updateGroup.color);
        expect(groups.length).toEqual(4);
    });

    it("it should be able to remove a group", function() {
        let removeGroup = new Group({
            "id" : groupData.groups[3].id,
            "name" : "updated group",
            "color" : "white",
            "sort_order" : "0",
            "children" : [],
            "is_heiarch" : true,
            "is_system" : false,
            "parent_id" : null,
        });

        groupings.removeGroup(removeGroup);

        let groups = groupings.getGroups();
        expect(groups.length).toEqual(3);
    });

    it("it should be able to get the group heirarchy", function() {

        let groups = groupings.getGroupsHierarch();


        expect(groups[0].children.length).toEqual(2);
        expect(groups[0].children[0].id).toEqual(groupData.groups[1].id);
        expect(groups[0].children[1].id).toEqual(groupData.groups[2].id);
    });
});
