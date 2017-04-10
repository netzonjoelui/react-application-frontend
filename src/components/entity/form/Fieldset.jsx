/**
 * Fieldset UIML element
 */
import theme from './entity-form.scss';
import React from 'react';

/**
 * Fieldset element
 */
const Fieldset = (props) => {  
  const name = props.name || props.elementNode.getAttribute('name');
  let legend = null;
  if (name) {
    legend = <legend>{name}</legend>;
  }

  return (
    <fieldset className={theme.entityFormFieldset}>
      {legend}
      {props.children}
    </fieldset>
  );
}

/**
 * The props that will be used in the fieldset
 */
Fieldset.propTypes = {
  /**
   * Current element node level
   *
   * @type {entity/form/FormNode}
   */
  elementNode: React.PropTypes.object,

  /**
   * The name of the fieldset that will be displayed as legend
   *
   * @type {string}
   */
  name: React.PropTypes.string,
}

export default Fieldset;
