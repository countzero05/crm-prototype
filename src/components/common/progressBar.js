import React, {Component} from "react";
import ProgressBar from "react-toolbox/lib/progress_bar";
import * as ActionTypes from "./../../constants/actionTypes";
import ProgressStore from "./../../stores/progressStore";

const activeProgress = (<ProgressBar mode="indeterminate"/>);
const inactiveProgress = (<ProgressBar mode="determinate" disabled/>);

export default class AppProgressBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      active: false
    };
  }

  componentWillMount() {
    ProgressStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ProgressStore.removeChangeListener(this._onChange);
  }

  _onChange = (event_type, active) => {
    if (event_type === ActionTypes.START_REQUEST || event_type === ActionTypes.STOP_REQUEST) {
      this.setState({active});
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.active != nextState.active;
  }

  render() {
    return this.state.active ? activeProgress : inactiveProgress;
  }
}