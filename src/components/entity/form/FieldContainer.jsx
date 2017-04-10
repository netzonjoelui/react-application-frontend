import React from 'react';
import theme from './entity-form.scss';

/**
 * A row containing a field in an entity form
 */
const FieldContainer = (props) => {
  return (
    <div className={theme.entityFormField}>
      {props.children}
    </div>
  );
};

/**
 * Expected props
 */
FieldContainer.propTypes = {
  /**
   * Current element node level
   *
   * @type {entity/form/FormNode}
   */
  children: React.PropTypes.node
};

export default FieldContainer;