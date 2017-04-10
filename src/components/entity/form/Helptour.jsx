/**
 * A row
 */

import theme from './entity-form.scss';
import React from 'react';

/**
 * Hideable tour infobox
 */
var Helptour = React.createClass({

  render: function () {

    var elementNode = this.props.elementNode;
    var tourId = elementNode.getAttribute("id");
    // Type can be 'inline', 'dialog', or 'popup'
    var type = elementNode.getAttribute("type");
    let nodeText = elementNode.getText();

    // We only display tour information in edit mode
    if (this.props.editMode) {
      return (
        <div className='info' data-tour={tourId} data-tour-type={type}>{nodeText}</div>
      );
    } else {
      return (<div />);
    }

  }
});

export default Helptour;
