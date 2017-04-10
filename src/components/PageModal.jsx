import React from 'react';
import theme from './page-modal.scss';
import {deviceSizes} from '../models/device';

// Chamel Controls
import Dialog from 'chamel/lib/Dialog/Dialog';
import FlatButton from 'chamel/lib/Button/FlatButton';
import AppBar from 'chamel/lib/AppBar';
import IconButton from 'chamel/lib/Button/IconButton';

// Chamel Icons
import CloseIcon from 'chamel/lib/icons/font/CloseIcon';
import SaveIcon from 'chamel/lib/icons/font/SaveIcon';


/**
 * Full page modal that looks like a dialog on medium+ devices and like a full page on <medium
 */
class PageModal extends React.Component {
  /**
   * Properties this component accepts
   */
  static propTypes = {
    deviceSize: React.PropTypes.number,
    title: React.PropTypes.string,
    children: React.PropTypes.node,
    onCancel: React.PropTypes.func,
    onContinue: React.PropTypes.func,
    cancelLabel: React.PropTypes.string,
    continueLabel: React.PropTypes.string,
    hideAppbarFlag: React.PropTypes.bool,
    match: React.PropTypes.object
  };

  static defaultProps = {
    cancelLabel: "Close",
    continueLabel: "Continue",
    hideAppbarFlag: false
  };

  static contextTypes = {
    match: React.PropTypes.object,
  };

  static childContextTypes = {
    match: React.PropTypes.object,
  };

  getChildContext() {
    // If a match was passed to the page then use that, otherwise use parent match
    return {
      match: this.props.match || this.context.match,
    };
  }

  /**
   * Class constructor
   *
   * @param {Object} props Properties to send to the render function
   */
  constructor(props) {
    // Call parent constructor
    super(props);

    this.state = {
      open: true
    }
  }

  componentWillUpdate(nextProps, nextState) {
    // Hide the dialog if the just closed the page
    if (!nextState.open && this.state.open && this.refs.pageModalDialog) {
      this.refs.pageModalDialog.dismiss();
    }
  }

  render() {
    // Medium to large devices
    if (this.props.deviceSize >= deviceSizes.medium) {
      const dialogActions = [
        <FlatButton
          key={1}
          label={this.props.cancelLabel}
          secondary
          onClick={this.closeModal }
        />
      ];

      if (this.props.onContinue) {
        dialogActions.push(
          <FlatButton
            key={2}
            label={this.props.continueLabel}
            primary
            onClick={this.continueModal}>
            {"Submit"}
          </FlatButton>
        );
      }

      let dialogWindowBodyClassName = null;
      if (this.props.hideAppbarFlag) {
        dialogWindowBodyClassName = theme.removeWindowBodyMargin;
      }

      return (
        <Dialog
          ref="pageModalDialog"
          title={this.props.title}
          actions={dialogActions}
          onDismiss={this.closeModal}
          openImmediately={this.state.open}
          dialogWindowBodyClassName={dialogWindowBodyClassName}
        >
          {this.props.children}
        </Dialog>
      );
    } else {
      const style = {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        display: (this.state.open) ? "block" : "none",
        top: 0,
        left: 0,
        zIndex: 200
      };

      const leftIcon = (
        <IconButton onTap={this.closeModal}>
          <CloseIcon />
        </IconButton>
      );

      const rightIcon = (this.props.onContinue) ? (
        <IconButton onTap={this.continueModal}>
          <SaveIcon />
        </IconButton>
      ) : null;

      const displayAppBar = (!this.props.hideAppbarFlag) ? (
        <AppBar
          title={this.props.title}
          iconElementLeft={leftIcon}
          iconElementRight={rightIcon}
          fixed={true}/>
      ) : null;

      // Smaller devices get a full page with an AppBar and all
      return (
        <div style={style}>
          {displayAppBar}
          {this.props.children}
        </div>
      );
    }
  }

  /**
   * Dismiss this modal page
   */
  closeModal = () => {
    this.setState({open: false});

    // If set, then let caller know we have closed
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  /**
   * Continue was clicked
   */
  continueModal = () => {
    this.setState({open: false});

    if (this.props.onContinue) {
      this.props.onContinue();
    }
  };

}

export default PageModal;
