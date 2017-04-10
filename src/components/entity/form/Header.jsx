/**
 * A row
 */

import theme from './entity-form.scss';
import React from 'react';

/**
 * Header element
 */
var Header = React.createClass({

  render: function () {

    let elementNode = this.props.elementNode;
    let text = elementNode.getText();
    let className = elementNode.getAttribute("class");
    let field = elementNode.getAttribute("field");

    if (field) {
      text = this.props.entity.getValue(field);
    }

    return (
      <h5 className={className}>
        {text}
      </h5>
    );
  }
});

export default Header;