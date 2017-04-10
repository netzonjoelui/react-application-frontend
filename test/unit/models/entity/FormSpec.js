import Form from 'netric/models/entity/Form';

/**
 * Test the creating of form instance and the parsing of xml form string
 */
describe("Create form instance and parse the xml form string", function() {

    it("should be able to parse the xml form string", function() {

        var xmlFormString = "<row><column><field name='title' hidelabel='t' class='headline'></field></column><column></column></row>";
        var form = new Form();

        // Parse the xml string and create the form element node using the parsed xml data
        var elementNode = form.fromXml(xmlFormString);

        // Verify that the element node was created
        expect(elementNode.constructor.name).toEqual('FormNode');
        expect(elementNode.getName()).toEqual('row');
        expect(elementNode.generateElementClassName()).toEqual('Row');
    });


});