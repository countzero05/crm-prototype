import React, {Component, PropTypes} from "react";
import * as MeActions from "./../../actions/meActions";
import MeStore from "./../../stores/meStore";
import * as ActionTypes from "./../../constants/actionTypes";
import {Form} from "react-toolbox";
import container from "./../common/container";

class ProfilePage extends Component {
  static propTypes = {
    setActions: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    MeActions.getMe();

    this.state = {
      name: "",
      email: "",
      password: "",
    };
  }

  componentWillMount() {
    MeStore.addChangeListener(this._onChange);

    this.props.setActions({
      save: {
        onClick: this.saveUser,
        // label: "Save",
        icon: "save",
        title: "Save"
      }
    });
  }

  //Clean up when this component is unmounted
  componentWillUnmount() {
    MeStore.removeChangeListener(this._onChange);
  }

  _onChange = (event_type, data) => {
    if (event_type === ActionTypes.GET_ME || event_type === ActionTypes.UPDATE_ME) {
      this.setState(data);
    }
  };

  fieldChange = (name, value) => {
    this.setState({...this.state, [name]: value});
  };

  saveUser = () => MeActions.updateMe(this.state);

  render() {
    return (
      <section>
        <Form
          model={
            {
              name: {
                kind: "input",
                name: "name",
                value: this.state.name,
                type: "text",
                label: "Name"
              },
              email: {
                kind: "input",
                name: "email",
                value: this.state.email,
                type: "email",
                label: "Email"
              },
              password: {
                kind: "input",
                name: "password",
                value: this.state.password,
                type: "password",
                label: "Password"
              }
            }
          }
          onChange={this.fieldChange}
          onSubmit={this.saveUser}
        />
      </section>
    );
  }
}

export default container(ProfilePage)({title: "Profile"});