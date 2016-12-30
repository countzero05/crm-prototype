import React, {Component, PropTypes} from "react";
import * as UserActions from "./../../actions/userActions";
import UserStore from "./../../stores/userStore";
import * as ActionTypes from "./../../constants/actionTypes";
import Table from "react-toolbox/lib/table";
import container from "./../common/container";

const model = {
  name: String,
  email: String,
  active: Boolean,
  role: String
};

class UserListPage extends Component {
  static propTypes = {
    children: PropTypes.object,
    setActions: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      users: null,
      selected: []
    };
  }

  componentWillMount() {
    UserStore.addChangeListener(this._onChange);
    UserActions.initialize();
    this.setActions([]);
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange);
  }

  _onChange = (event_type, data) => {
    if (event_type === ActionTypes.INITIALIZE_USERS) {
      this.setState({users: data});
    } else if (event_type === ActionTypes.DELETE_USER || event_type === ActionTypes.CREATE_USER || event_type === ActionTypes.UPDATE_USER) {
      UserActions.initialize();
    }
  };

  removeUser = id => {
    this.setState({selected: []});
    UserActions.removeUser(id);
  };

  handleSelect = (selected) => {
    if (JSON.stringify(selected) === JSON.stringify(this.state.selected)) {
      selected = [];
    }

    this.setState({...this.state, selected});
    this.setActions(selected);
  };

  setActions = (selected) => {
    if (selected.length) {
      this.props.setActions({
        create: {
          // label: "Create",
          title: "Create",
          icon: "person_add",
          href: `/users/create`
        },
        edit: {
          // label: "Edit",
          title: "Edit",
          icon: "edit",
          href: `/users/${this.state.users[selected[0]]._id}`
        },
        remove: {
          // label: "Remove",
          title: "Remove",
          icon: "delete",
          onClick: () => this.removeUser.bind(this, this.state.users[selected[0]]._id)
        }
      })
    } else {
      this.props.setActions({
        create: {
          // label: "Create",
          title: "Create",
          icon: "person_add",
          href: `/users/create`
        }
      })
    }
  };

  render() {
    if (!this.state.users) {
      return null;
    }

    return (
      <Table
        model={model}
        source={this.state.users}
        onSelect={this.handleSelect}
        selected={this.state.selected}
        multiSelectable={false}
      />
    );
  }
}

export default container(UserListPage)({title: "Users"});