/**
 * Object reference value and browse/select dialog
 *
 * @author Sky Stebnicki
 */
import React from 'react';
import EntityBrowserContainer from '../../containers/EntityBrowserContainer';
import PageModal from '../PageModal';

// Chamel Controls
import FlatButton from 'chamel/lib/Button/FlatButton';
import IconButton from 'chamel/lib/Button/IconButton';

// Chamel Icons
import CancelIcon from 'chamel/lib/icons/font/CancelIcon';

/**
 * Component that allows a user to select an object/entity
 */
class ObjectSelect extends React.Component {
  static propTypes = {
    /**
     * The object type we are working with
     *
     * @type {object}
     */
    objType: React.PropTypes.string.isRequired,

    /**
     * The grouping field that we are working on
     *
     * @type {object}
     */
    field: React.PropTypes.object.isRequired,

    /**
     * The subtype fo the field we are working on
     *
     * @type {string}
     */
    subtype: React.PropTypes.string,

    /**
     * The current value of the field
     *
     * @type {string}
     */
    value: React.PropTypes.string,

    /**
     * The current label of the field - entity title
     *
     * @type {string}
     */
    label: React.PropTypes.string,

    /**
     * Flag that will indicate that an object MUST be selected
     *
     * @type {bool}
     */
    required: React.PropTypes.bool,

    /**
     * Size of the current device
     *
     * @type {int}
     */
    deviceSize: React.PropTypes.number,

    /**
     * The subtype of the field. This is usually set if props.field.subtype is empty.
     *
     * @type {function}
     */
    onChange: React.PropTypes.func,
  };

  static defaultProps = {
    label: 'None',
    value: null,
    required: false,
    field: null,
    subType: null
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value,
      label: this.props.label,
      browseNow: false
    }
  };

  /**
   * Render the component
   */
  render() {
    const field = this.props.field
    if (this.state.browseNow && field) {
      if (field.type === field.types.object && field.subtype) {
        return (
          <PageModal
            deviceSize={this.props.deviceSize}
            title={"Select " + field.title}
            continueLabel={"Select"}
            onCancel={this._handleBrowseClick}
            onContinue={null}>
            <EntityBrowserContainer
              mode={"inline"}
              objType={field.subtype}
              hideToolbar={true}
              onSelectEntity={(objType, oid, title) => { this._handleChange(oid, title); }}
            />
          </PageModal>
        );
      }
    }

    const label = this.state.label || "None";

    // Add clear button
    let clearValue = null;
    if (this.state.value && !this.props.required) {
      clearValue = (
        <IconButton onClick={this._clearValue} tooltip="Clear Value">
          <CancelIcon />
        </IconButton>
      );
    }

    return (
      <span>
        <FlatButton onClick={this._handleBrowseClick}>{label}</FlatButton>
        {clearValue}
      </span>
    );
  };

  /**
   * The user has clicked browse to select an entity
   */
  _handleBrowseClick = () => {
    this.setState({browseNow: !this.state.browseNow});
  };

  /**
   * Trigger a value change
   *
   * @param {int} oid The unique id of the entity selected
   * @param {string} title The human readable title of the entity selected
   * @private
   */
  _handleChange = (oid, title) => {
    this.setState({value: oid, label: title, browseNow: false});

    if (this.props.onChange) {
      this.props.onChange(oid, title);
    }
  };

  /**
   * Trigger a value change
   *
   * @param {int} oid The unique id of the entity selected
   * @param {string} title The human readable title of the entity selected
   * @private
   */
  _clearValue = (oid, title) => {
    this.setState({value: null, label: ""});
    this._handleChange(null, null);
  };
}

export default ObjectSelect;
