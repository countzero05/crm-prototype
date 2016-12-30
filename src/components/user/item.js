import React, {PropTypes, Component} from "react";
import {Form} from "react-toolbox";
import * as UserActions from "./../../actions/userActions";
import UserStore from "./../../stores/userStore";
import * as ActionTypes from "./../../constants/actionTypes";
import container from "./../common/container";

class UserPage extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    setActions: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);

    if (props.params.id) {
      UserActions.initializeUser(props.params.id);
    }

    this.state = {
      name: "",
      email: "",
      active: false,
      password: "",
      role: "",
    };

  }

  componentWillMount() {
    UserStore.addChangeListener(this._onChange);

    this.props.setActions({
      save: {
        icon: "save",
        // label: "Save",
        title: "Save",
        onClick: this.saveUser
      },
      cancel: {
        icon: "backspace",
        // label: "Cancel",
        title: "Cancel",
        href: "/users"
        // onClick: this.goMain
      }
    });
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange);
  }

  _onChange = (event_type, data) => {
    if (event_type === ActionTypes.UPDATE_USER || event_type === ActionTypes.CREATE_USER || event_type === ActionTypes.INITIALIZE_USER) {
      this.setState(data);
    }
  };

  fieldChange = (name, value) => this.setState({...this.state, [name]: value});

  saveUser = () => (this.state._id ? UserActions.updateUser(this.state) : UserActions.createUser(this.state)).then((user) => user.error === undefined ? this.goMain() : user);

  goMain = () => this.context.router.push(`/users`);

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
              },
              role: {
                kind: "dropdown",
                name: "role",
                label: "Role",
                source: [
                  {
                    value: "Manager",
                    label: "Manager"
                  },
                  {
                    value: "Admin",
                    label: "Admin"
                  }
                ],
                value: this.state.role,
              },
              active: {
                kind: "switch",
                name: "active",
                checked: this.state.active,
                label: "Active"
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

export default container(UserPage)({title: "User"});