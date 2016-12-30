import React, {PropTypes, Component} from "react";
import * as MeActions from "./../../actions/meActions";
import MeStore from "./../../stores/meStore";
import * as ActionTypes from "./../../constants/actionTypes";
import Dialog from "react-toolbox/lib/dialog";
import Input from "react-toolbox/lib/input";

class LoginPage extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: ""
    };
  }

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value});
  };

  componentWillUnmount() {
    MeStore.removeChangeListener(this._onChange);
  }

  componentWillMount() {
    MeStore.addChangeListener(this._onChange);
  }

  _onChange = (event_type, data) => {
    if (event_type === ActionTypes.LOGIN_USER) {
      if (data.error) {
        console.log(data);
        this.setState(Object.assign({}, this.state, data));
      }
    }
  };

  goMain = () => {
    this.props.location.pathname = "/";
    this.context.router.push(this.props.location);
  };

  login = (e) => {
    e.preventDefault();

    MeActions.login({
      email: this.state.email,
      password: this.state.password
    });
  };

  render() {
    return (
      <Dialog
        actions={[{label: "Login", onClick: this.login}]}
        active={true}
        title="Login"
        type="small"
      >
        <Input
          type="email"
          name="email"
          label="Email"
          icon="email"
          value={this.state.email}
          onChange={this.handleChange.bind(this, "email")}/>
        <Input
          type="password"
          name="password"
          label="Password"
          icon="lock"
          value={this.state.password}
          onChange={this.handleChange.bind(this, "password")}
          error={this.state.error}
        />
      </Dialog>

    );
  }
}

export default LoginPage;