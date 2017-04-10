import React from 'react';
import theme from '../components/entity/form/entity-form.scss';
import { connect } from 'react-redux';
import Field from '../models/entity/definition/Field';
import Definition from '../models/entity/Definition';
import FieldInput from '../components/entity/FieldInput';

/**
 * Allows a user to edit values for each non read-only field in an entity
 */
class EntityFieldValuesContainer extends React.Component {
  /**
   * Set expected property types
   */
  static propTypes = {

    /**
     * The object type that we will be using to display the entity fields
     *
     * @var {string}
     */
    objType: React.PropTypes.string.isRequired,

    /**
     * The entity data we will be using to display the field values if available
     *
     * @var {object}
     */
    entityData: React.PropTypes.object,

    /**
     * Callback function that is called when changing a field value
     *
     * @var {func}
     */
    onChange: React.PropTypes.func
  };

  /**
   * Class constructor
   *
   * @param {Object} props Properties to send to the render function
   */
  constructor(props) {
    // Call parent constructor
    super(props);
  };

  /**
   * Render the Entity Fields
   *
   * @returns {Object}
   */
  render() {
    const entityDefinition = new Definition(this.props.entityDefinitionData);
    let entityFieldsDisplay = [];

    entityDefinition.fields.forEach((field, index) => {

      // Do not display the fields that are read only or are not objectMulti
      if (!field.readonly && (field.type && field.type != Field.types.objectMulti)) {

        const value = this.props.entityData[field.name] || null;
        const valueLabel = this.props.entityData[field.name + '_fval'] || null;
        let fieldTitle = null;

        switch (field.type) {
          case Field.types.fkeyMulti:
          case Field.types.fkey:
          case Field.types.object:
          case Field.types.bool:
            fieldTitle = (
              <div className={theme.entityFormFieldLabel}>
                {field.title}
              </div>
            );
            break;
        }

        entityFieldsDisplay.push(
          <div key={'divContainer' + index}>
            <div className={theme.entityFormFieldValue}>
              {fieldTitle}
              <FieldInput
                key={index}
                objType={this.props.objType}
                fieldName={field.name}
                fieldTitle={field.title}
                value={value}
                valueLabel={valueLabel}
                onChange={this.props.onChange}
                entityDefinition={entityDefinition}
              />
            </div>
          </div>
        );
      }
    });

    return (
      <div>
        {entityFieldsDisplay}
      </div>
    )
  };
}

/**
 * Map properties in the application store state to module properties
 *
 * @param {Object} state The current application state
 * @param {Object} ownProps Properties that were passed to this component
 * @returns {Object}
 */
const mapStateToProps = (state, ownProps) => {
  const moduleState = state.entity;
  const entityDefinitionData = moduleState.definitions[ownProps.objType];

  return {
    entityDefinitionData: entityDefinitionData,
    deviceSize: state.device.size,
  }
};

/**
 * Map container callbacks to dispatches into the redux state
 *
 * @param {Function} dispatch Callback to dispatch an action to the store
 * @returns {{onFetchEntityAllDefinitions: (function())}}
 */
const mapDispatchToProps = (dispatch) => {
  return {}
};

// Connect this container to listen to redux
export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityFieldValuesContainer);
