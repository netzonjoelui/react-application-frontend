import React from 'react';
var EntityFormShowFilter = require("../../mixins/EntityFormShowFilter.jsx");

/**
 * Tab UIML element
 */
var FormTab = React.createClass({

  mixins: [EntityFormShowFilter],

  render: function () {

    var elementNode = this.props.elementNode;
    var label = elementNode.getAttribute('name');
    var showif = elementNode.getAttribute('showif');

    var displayTab = (
      <div>
        {this.props.children}
      </div>
    );

    if (showif) {

      // If ::evaluateShowIf() returns false, it means that the showif did not match the filter specified
      if (!this.evaluateShowIf(showif)) {
        displayTab = null;
      }
    }

    return (
      displayTab
    );
    /*
     if (this.props.renderChildren) {
     return (
     <div>
     {this.props.children}
     </div>
     );
     } else {
     return (
     <Tab {...this.props} label={label}>
     {this.props.children}
     </Tab>
     );
     }
     */

  }
});

export default FormTab;