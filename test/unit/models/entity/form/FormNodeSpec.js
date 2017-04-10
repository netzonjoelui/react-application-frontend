import Form from 'netric/models/entity/Form';
import FormNode from 'netric/models/entity/form/FormNode';

/**
 * Test the creating of form instance and the parsing of xml form string
 */
describe("Parse the xml form string and get its children node", function () {
  var form = null,
      parentElementNode = null;

  // Setup test entity
  beforeEach(function () {
      var xmlFormString = "<row><field name='title' hidelabel='t' class='headline'></field><header>This is a header</header></row>";

      form = new Form();

      // Parse the xmlFormString and Create the element node
      parentElementNode = form.fromXml(xmlFormString);
  });

  it("should be able to create the parent row node including its child nodes", function () {
      expect(parentElementNode.getName()).toEqual('row');
      expect(parentElementNode.getChildNodes().length).toEqual(2);
  });

  it("should be able to create the child nodes", function () {

      // Get the field element node
      expect(parentElementNode.getChildNode(0).getName()).toEqual('field');
      expect(parentElementNode.getChildNode(0).generateElementClassName()).toEqual('Field');
      expect(parentElementNode.getChildNode(0).getAttribute('name')).toEqual('title');

      // Get the header element node
      expect(parentElementNode.getChildNode(1).getName()).toEqual('header');
      expect(parentElementNode.getChildNode(1).generateElementClassName()).toEqual('Header');
      expect(parentElementNode.getChildNode(1).getText()).toEqual('This is a header');
  });

  it("should be able to add new child node using an xml string and set its attributes", function () {

      var newXmlString = "<field name='newElementField'>This is a new field</field>";

      // Parse the new xml string and Create the new element node
      var fieldElementNode = form.fromXml(newXmlString);

      fieldElementNode.setAttribute("class", "newFieldElementClass")

      // Before adding, let's test if the parentElementNode has 2 child nodes
      expect(parentElementNode.getChildNodes().length).toEqual(2);

      // Add the new field element node
      parentElementNode.addChildNode(fieldElementNode);

      // Verify that the new field was added into the parentElementNode
      expect(parentElementNode.getChildNodes().length).toEqual(3);

      // Get the newly added field element child node
      expect(parentElementNode.getChildNode(2).getName()).toEqual('field');
      expect(parentElementNode.getChildNode(2).getText()).toEqual('This is a new field');
      expect(parentElementNode.getChildNode(2).getAttribute('name')).toEqual('newElementField');
      expect(parentElementNode.getChildNode(2).getAttribute('class')).toEqual('newFieldElementClass');

      // Now let's remove the added child node
      parentElementNode.removeChildNode(2);

      // parentElementNode children should be back to 2 child nodes
      expect(parentElementNode.getChildNodes().length).toEqual(2);
      expect(parentElementNode.getChildNode(2)).not.toBeDefined();
  });

  it("should be able to add new child node that has its own child nodes", function () {

      var newXmlString = "<column><text>New Header</text><field name='newElementField'></field></column>";

      // Parse the new xml string and Create the new column element node
      var columnElementNode = form.fromXml(newXmlString);

      // Before adding, let's test if the parentElementNode has 2 child nodes
      expect(parentElementNode.getChildNodes().length).toEqual(2);

      // Add the new column element node
      parentElementNode.addChildNode(columnElementNode);

      // Verify that the new column was added into the parentElementNode
      expect(parentElementNode.getChildNodes().length).toEqual(3);

      // Get the newly added column element child node
      expect(parentElementNode.getChildNode(2).getName()).toEqual('column');

      // Verify that the new row element has its child nodes
      expect(parentElementNode.getChildNode(2).getChildNodes().length).toEqual(2);

      // Get the text child of the column element node
      expect(parentElementNode.getChildNode(2).getChildNode(0).getName()).toEqual('text');
      expect(parentElementNode.getChildNode(2).getChildNode(0).getText()).toEqual('New Header');

      // Get the field child of the column element node
      expect(parentElementNode.getChildNode(2).getChildNode(1).getName()).toEqual('field');
      expect(parentElementNode.getChildNode(2).getChildNode(1).getAttribute("name")).toEqual('newElementField');

      // Now let's remove the added child node
      parentElementNode.removeChildNode(2);

      // parentElementNode children should be back to 2 child nodes
      expect(parentElementNode.getChildNodes().length).toEqual(2);
      expect(parentElementNode.getChildNode(2)).not.toBeDefined();
  });

  it("should be able to add new child node by creating a new FormNode model instance", function () {

      var elementNode = new FormNode('field');

      // Set the name attribute for this element node
      elementNode.setAttribute('name', 'newElementField');

      // Before adding, let's test if the parentElementNode has 2 child nodes
      expect(parentElementNode.getChildNodes().length).toEqual(2);

      // Add the new column element node
      parentElementNode.addChildNode(elementNode);

      // Verify that the new column was added into the parentElementNode
      expect(parentElementNode.getChildNodes().length).toEqual(3);

      // Get the newly added field element child node
      expect(parentElementNode.getChildNode(2).getName()).toEqual('field');
      expect(parentElementNode.getChildNode(2).getAttribute('name')).toEqual('newElementField');

      // Now let's remove the added child node
      parentElementNode.removeChildNode(2);

      // parentElementNode children should be back to 2 child nodes
      expect(parentElementNode.getChildNodes().length).toEqual(2);
      expect(parentElementNode.getChildNode(2)).not.toBeDefined();
  });

});