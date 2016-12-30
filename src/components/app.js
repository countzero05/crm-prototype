import React, {Component} from "react";
import * as MeActions from "./../actions/meActions";
import MeStore from "./../stores/meStore";
import AppStore from "./../stores/appStore";
import * as ActionTypes from "./../constants/actionTypes";
import Login from "./auth/loginPage";
import {Layout} from "react-toolbox";
import Snackbar from "./common/Snackbar";

// import ReactPerfTool from "react-perf-tool";
// import Perf from "react-addons-perf";
//
// window.React = React;
// window.Perf = Perf;
// window.ReactPerfTool = ReactPerfTool;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      actions: []
    }
  }

  componentWillMount() {
    MeStore.addChangeListener(this._onChange);
    AppStore.addChangeListener(this._onChange);
    MeActions.getMe();
  }

  componentWillUnmount() {
    MeStore.removeChangeListener(this._onChange);
    AppStore.removeChangeListener(this._onChange);
  }

  _onChange = (eventType, data) => {
    switch (eventType) {
      case ActionTypes.GET_ME:
      case ActionTypes.LOGIN_USER:
      case ActionTypes.LOGOUT_USER:
        this.setState({user: data});
        break;
      case ActionTypes.SET_APP_ACTIONS:
        this.setState({actions: data});
        break;
    }
  };

  render() {
    const {user} = this.state;

    return user ? user._id ? (
          <Layout>
            {this.props.children}
            <Snackbar/>
          </Layout>
        ) : (<Login location={this.props.location}/>) : null;
  }
}

App.propTypes = {
  children: React.PropTypes.object,
  location: React.PropTypes.object.isRequired
};

export default App;