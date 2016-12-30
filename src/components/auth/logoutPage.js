import {PropTypes, Component} from "react";
import * as MeActions from "./../../actions/meActions";

class LogoutPage extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentWillMount() {
    MeActions.logout();
  }

  componentDidMount() {
    this.goMain();
  }

  goMain = () => {
    this.props.location.pathname = "/";
    this.context.router.push(this.props.location);
  };

  render() {
    return null;
  }
}

LogoutPage.propTypes = {
  location: PropTypes.object.isRequired
};

export default LogoutPage;