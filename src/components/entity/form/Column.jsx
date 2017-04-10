/**
 * Flex box column
 */

import React from 'react';
import theme from './entity-form.scss';
import EntityFormShowFilter from '../../mixins/EntityFormShowFilter.jsx';

/**
 * Tab element
 */
var Column = React.createClass({

  mixins: [EntityFormShowFilter],

  render: function () {

    let elementNode = this.props.elementNode;
    let type = elementNode.getAttribute('type');
    let className = "entityFormColumn";

    if (type) {
      className += type.charAt(0).toUpperCase() + type.slice(1);
    }

    let displayCol = (
      <div className={theme[className]}>
        {this.props.children}
      </div>
    );

    let showif = this.props.elementNode.getAttribute('showif');

    if (showif) {

      // If ::evaluateShowIf() returns false, it means that the showif did not match the filter specified
      if (!this.evaluateShowIf(showif)) {
        displayCol = null;
      }
    }

    return (
      <div className={theme[className]}>
        {displayCol}
      </div>
    );
  }

});

export default Column;