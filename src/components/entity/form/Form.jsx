/**
 * Root form component
 */
import React from 'react';
import theme from './entity-form.scss';

/**
 * Base level element for enetity forms
 */
var Form = React.createClass({

  /**
   * Expected props
   */
  propTypes: {

    /**
     * Current element node level
     *
     * @type {entity/form/FormNode}
     */
    elementNode: React.PropTypes.object.isRequired,

    /**
     * Entity being edited
     *
     * @type {entity/Entity}
     */
    entity: React.PropTypes.object,

    /**
     * Flag indicating if we are in edit mode or view mode
     *
     * @type {bool}
     */
    editMode: React.PropTypes.bool
  },

  render: function () {
    return (
      <div className={theme.entityForm}>{this.props.children}</div>
    );
  }
});

export default Form;