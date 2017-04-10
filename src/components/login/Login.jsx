import React from 'react';
import theme from './theme.scss';

// Chamel Controls
import TextField from 'chamel/lib/Input/TextField';
import RaisedButton from 'chamel/lib/Button/RaisedButton';
import Snackbar from 'chamel/lib/Snackbar/Snackbar';
import RadioButton from 'chamel/lib/Picker/RadioButton';
import RadioPicker from 'chamel/lib/Picker/RadioPicker';

/**
 * Large application component
 */
var Login = React.createClass({

  propTypes: {
    onLogin: React.PropTypes.func,
    errorText: React.PropTypes.string,
    processing: React.PropTypes.bool,
    accounts: React.PropTypes.array,
    onInputChange: React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      processing: false,
      errorText: ''
    }
  },

  getInitialState: function() {
    return {
      username: null,
      password: null,
      loginDisabled: true,
    };
  },

  componentDidUpdate: function() {
    // Show error snackbar
    if (this.props.errorText == '') {
      this.refs.snackbar.dismiss();
    } else {
      this.refs.snackbar.show();
    }
  },

  render: function() {
    var processingIcon = null;
    if (this.props.processing) {
      processingIcon = <span> <i className="fa fa-spinner fa-pulse" /></span>
    }

    // Check if we should print accounts to select
    var accountOptions = null;
    if (this.props.accounts.length > 1) {
      var radioButtons = [];
      for (var i in this.props.accounts) {
        var accountTitle = (this.props.accounts[i].title) ?
          this.props.accounts[i].title : this.props.accounts[i].account;

        radioButtons.push(
          <RadioButton
            value={this.props.accounts[i].instanceUri}
            label={accountTitle}
            defaultChecked={true}
          />
        );
      }

      accountOptions = (
        <div>
          <div className="font-style-body-1">
            Select an account to log into:
          </div>
          <RadioPicker name="selectAccout" onChange={this._handleAccountSelected}>
            {radioButtons}
          </RadioPicker>
        </div>
      );
    }

    // Add the login logo
    const imagePath = "./img/logo_login.png";

    return (
      <div className={theme.loginPage}>
        <div className={theme.loginLogoCon}>
          <img className={theme.loginLogo} src={imagePath} />
        </div>
        <div className={theme.loginFormCon}>
          <TextField
            floatingLabelText="Email"
            onChange={this._handleUsernameChange}
          />
          <TextField
            type="password"
            floatingLabelText="Password"
            onChange={this._handlePasswordChange}
          />
          {accountOptions}
          <div className={theme.loginFormActions}>
            <RaisedButton disabled={this.state.loginDisabled} onClick={this._handleLoginClick} primary={true}>
              Login
              {processingIcon}
            </RaisedButton>
          </div>
        </div>
        <Snackbar ref="snackbar" message={this.props.errorText} />
      </div>
    );
  },

  _handleUsernameChange: function(e) {
    // Clear any errors
    this.state.username = e.target.value;
    this._updateLoginState();

    // If the user name is changed, then lets clear the error text from the parent
    if(this.props.onInputChange) {
      this.props.onInputChange();
    }
  },

  _handleAccountSelected: function(selectedValue) {
    if (this.props.onSetAccount) {
      this.props.onSetAccount(selectedValue);
    }
  },

  _handlePasswordChange: function(e) {
    // Clear any errors
    this.state.password = e.target.value;
    this._updateLoginState();

    // If the user name is changed, then lets clear the error text from the parent
    if(this.props.onInputChange) {
      this.props.onInputChange();
    }
  },

  _updateLoginState: function() {
    // Update enabled state of the login button
    if (this.state.username && this.state.password) {
      this.setState({loginDisabled: false});
    } else {
      this.setState({loginDisabled: true});
    }
  },

  _handleLoginClick: function(e) {

    if (!this.state.username) {
      // TODO set error state of username
      return;
    }

    if (!this.state.password) {
      // TODO set error state of password
      return;
    }

    if (this.props.onLogin) {
      this.props.onLogin(this.state.username, this.state.password);
    }
  }

});

export default Login;
