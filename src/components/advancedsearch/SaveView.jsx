/**
 * Provides user inputs required for browser view details
 * Displays the inputs for View Name, Description and if this view will be the default view.
 *
 */
import React from 'react';
import BrowserView from '../../models/entity/BrowserView';

// Chamel Controls
import AppBar from 'chamel/lib/AppBar';
import GridContainer from 'chamel/lib/Grid/Container';
import GridColumn from 'chamel/lib/Grid/Column';
import GridRow from 'chamel/lib/Grid/Row';
import IconButton from 'chamel/lib/Button/IconButton';
import Checkbox from 'chamel/lib/Toggle/Checkbox';
import FlatButton from 'chamel/lib/Button/FlatButton';
import TextField from 'chamel/lib/Input/TextField';

// Chamel Icons
import ArrowBackIcon from 'chamel/lib/icons/font/ArrowBackIcon';
import CheckIcon from 'chamel/lib/icons/font/CheckIcon';

/**
 * Displays input fields for saving the browser view
 */
const SaveView = (props) => {

  const elementLeft = (
    <IconButton
      key="back"
      onClick={props.onClose}>
      <ArrowBackIcon />
    </IconButton>
  );

  if (!props.browserViewData) {
    return (
      <AppBar
        fixed={true}
        title={"No Browser View Selected"}
        zDepth={0}
        iconElementLeft={elementLeft}>
      </AppBar>
    )
  }

  const elementRight = (
    <IconButton
      key="apply"
      onClick={props.onSaveView}>
      <CheckIcon />
    </IconButton>
  );

  const browserView = new BrowserView();
  browserView.fromData(props.browserViewData);

  return (
    <div>
      <AppBar
        fixed={true}
        title={"Save Browser View - " + browserView.name}
        zDepth={0}
        iconElementLeft={elementLeft}
        iconElementRight={elementRight}
      />
      <GridContainer fluid>
        <GridRow>
          <GridColumn small={12} medium={8} large={6}>
            <TextField
              errorText={(browserView.name.length === 0) ? "View Name is Required." : null}
              floatingLabelText='View Name'
              value={browserView.name}
              onBlur={(e) => {
                props.onChange({name: e.target.value});
              }}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn small={12}>
            <TextField
              floatingLabelText={"Description"}
              value={browserView.description}
              onBlur={(e) => {
                props.onChange({description: e.target.value});
              }}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn small={6} medium={4}>
            <Checkbox
              label="Default"
              checked={browserView.default}
              onChange={(e, checked) => {
                props.onChange({default: checked})
              }}/>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </div>
  );
}

/**
 * The props that will be used in the save view
 */
SaveView.propTypes = {
  /**
   * The browser view data that we are going to save
   *
   * @type {object}
   */
  browserViewData: React.PropTypes.object.isRequired,

  /**
   * Event triggered when the user decides to save the browser view
   *
   * @type {func}
   */
  onSaveView: React.PropTypes.func,

  /**
   * Event triggered when the user cancels the saving of browser view
   *
   * @type {func}
   */
  onClose: React.PropTypes.func,

  /**
   * Event triggered when the user changes the details of the browser view
   *
   * @type {func}
   */
  onChange: React.PropTypes.func
}

export default SaveView;
