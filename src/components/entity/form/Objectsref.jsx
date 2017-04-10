import React from 'react';
import EntityFormObjMultiContainer from '../../../containers/EntityFormObjMultiContainer';
import EntityContainer from '../../../containers/EntityContainer';
import Where from '../../../models/entity/Where';

/**
 * Objectsref/entityList element
 */
class Objectsref extends React.Component {

  /**
   * Define propTypes that this component
   */
  static propTypes = {
    /**
     * Current element node level
     *
     * @type {entity/form/FormNode}
     */
    elementNode: React.PropTypes.object.isRequired,

    /**
     * Entity being worked on
     *
     * @type {entity/Entity}
     */
    entity: React.PropTypes.object.isRequired,

    /**
     * Size of the current device
     *
     * @type {int}
     */
    deviceSize: React.PropTypes.number
  };

  /**
   * The entity form is given a property called currentRoutePath
   */
  static contextTypes = {
    currentRoutePath: React.PropTypes.string
  };


  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    let refObjType = this.props.elementNode.getAttribute('obj_type');
    let refField = this.props.elementNode.getAttribute('ref_field');

    this.state = {
      refObjType: refObjType,
      refField: refField,
      loadedEntityId: null
    };
  };

  /**
   * Render the component
   */
  render() {

    let note = null;
    if (!this.props.entity.id) {
      note = "Please save changes to view more details.";
    }

    // Add filter to reference the current entity
    let filters = [];
    if (this.state.refField) {

      // Create a filter reference
      let whereCond = new Where(this.state.refField);
      whereCond.equalTo(this.props.entity.id);

      filters.push(whereCond);
    }

    /*
     * this.props.entity needs to be referenced in the entities we are loading.
     * Determine which field to use for this filter.
     */
    const refFieldName = this.state.refField || 'obj_reference';
    let refFieldValue = this.props.entity.id;

    // If the fieldname is of type object then it must include object type
    if (refFieldName === 'obj_reference') {
      refFieldValue = this.props.entity.encodeObjRef(
        this.props.entity.def.objType,
        this.props.entity.id,
        this.props.entity.getName()
      );
    }

    // If we have a selectedEntityId, then we will setup entity container to display the entity
    if (this.state.selectedEntityId) {

      // Set default field values for this entity
      const initEntityData = {
        [refFieldName]: refFieldValue,
        [refFieldName + "_fval"]: this.props.entity.getName()
      };

      return (
        <EntityContainer
          usePageModalFlag={true}
          forceEditModeFlag={true}
          id={this.state.selectedEntityId}
          objType={this.state.refObjType}
          initEntityData={initEntityData}
          onClose={() => {
            this.setState({
              selectedEntityId: null
            });
          }}
        />
      )
    } else if (this.props.entity.id) {
      return (
        <EntityFormObjMultiContainer
          objType={this.state.refObjType}
          referencedField={refFieldName}
          referencedEntityId={refFieldValue}
          referencedEntityName={this.props.entity.getName()}
          onSelectEntity={(objType, entityId, entityTitle) => {
            this.setState({selectedEntityId: entityId});
          }}
        />
      );
    } else {
      return (<span />);
    }
  };
}

export default Objectsref;