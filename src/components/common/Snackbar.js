import React, {Component} from "react";
import {Snackbar} from "react-toolbox";
import SnackStore from "./../../stores/snackStore";
import * as ActionTypes from "./../../constants/actionTypes";

class _Snackbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actions: [],
      interval: null
    }
  }

  componentWillMount() {
    SnackStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    SnackStore.removeChangeListener(this.onChange);
  }

  onChange = (eventType, data) => {
    let {actions, interval} = this.state;
    switch (eventType) {
      case ActionTypes.SNACK_OK:
        actions.push({
          label: data,
          color: "#080"
        });
        break;
      case ActionTypes.SNACK_WARNING:
        actions.push({
          label: data,
          color: "#f70"
        });
        break;
      case ActionTypes.SNACK_ERROR:
        actions.push({
          label: data,
          color: "#b00"
        });
        break;
    }

    if (actions && interval == null) {
      this.setState({actions, interval: setInterval(this.handleInterval, 3000)});
    } else {
      this.setState({actions});
    }
  };

  handleInterval = () => {
    let {actions, interval} = this.state;

    actions.shift();

    if (actions.length == 0 && interval) {
      clearInterval(interval);
      interval = null;
      this.setState({actions, interval});
    } else {
      this.setState({actions});
    }
  };

  render() {
    return (
      <Snackbar
        active={this.state.actions.length > 0}
        timeout={3000}
        type="warning"
      >
        {this.state.actions.map((action, index) => (
          <div key={index} style={{color: action.color}}>{action.label}</div>
        ))}
      </Snackbar>
    );
  }
}

export default _Snackbar;