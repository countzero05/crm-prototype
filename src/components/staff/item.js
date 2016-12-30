import React, {PropTypes, Component} from "react";
import {Form} from "react-toolbox";
import * as StaffActions from "./../../actions/staffActions";
import StaffStore from "./../../stores/staffStore";
import * as UserActions from "./../../actions/userActions";
import UserStore from "./../../stores/userStore";
import * as ActionTypes from "./../../constants/actionTypes";
import container from "./../common/container";

class StaffPage extends Component {

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
      StaffActions.initializeStaff(props.params.id);
    }

    this.state = {
      person: {
        name: "",
        email: "",
        comment: "",
        active: false,
      },
      users: []
    };

  }

  componentWillMount() {
    StaffStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);

    if (!UserStore.getUsers().length) {
      UserActions.initialize();
    }

    this.setActions();
  }

  setActions = () => {
    let actions = {
      save: {
        icon: "save",
        // label: "Save",
        title: "Save",
        onClick: this.saveStaff
      },
      cancel: {
        icon: "backspace",
        // label: "Cancel",
        title: "Cancel",
        href: "/staff"
        // onClick: this.goMain
      }
    };

    if (this.state.person._id) {
      actions.remove = {
        icon: "delete",
        // label: "Save",
        title: "Delete",
        onClick: this.removeStaff
      }
    }

    this.props.setActions(actions);
  };

  componentWillUnmount() {
    StaffStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
  }

  _onChange = (event_type, data) => {
    if (event_type === ActionTypes.UPDATE_STAFF || event_type === ActionTypes.CREATE_STAFF || event_type === ActionTypes.INITIALIZE_STAFF) {
      this.setState({person: data});
      this.setActions();
    } else if (event_type === ActionTypes.INITIALIZE_USERS) {
      this.setState({users: data})
    }
  };

  fieldChange = (name, value) => this.setState({person: {...this.state.person, [name]: value}});

  saveStaff = () => (this.state._id ? StaffActions.updateStaff(this.state.person) : StaffActions.createStaff(this.state.person)).then((staff) => staff.error === undefined ? this.goMain() : staff);
  removeStaff = () => StaffActions.removeStaff(this.state.person._id).then((staff) => staff.error === undefined ? this.goMain() : staff);

  goMain = () => this.context.router.push(`/staff`);

  render() {
    const {person} = this.state;

    const users = UserStore.getUsers();

    return (
      <section>
        <Form
          model={
            {
              name: {
                kind: "input",
                name: "name",
                value: person.name,
                type: "text",
                label: "Name",
                required: true
              },
              email: {
                kind: "input",
                name: "email",
                value: person.email,
                type: "email",
                label: "Email"
              },
              active: {
                kind: "switch",
                name: "active",
                checked: person.active,
                label: "Active"
              },
              partner: {
                kind: "dropdown",
                name: "partner",
                label: "Partner",
                source: [{label: "", value: ""}].concat(users.map(user => ({label: user.name, value: user._id}))),
                value: person.partner,
                allowBlank: true
              },
              dateStart: {
                kind: "datepicker",
                name: "dateStart",
                value: person.dateStart,
                label: "Date start",
                autoOk: true
              },
              dateEnd: {
                kind: "datepicker",
                name: "dateEnd",
                value: person.dateEnd,
                label: "Date end",
                autoOk: true
              },
              comment: {
                kind: "input",
                name: "email",
                value: person.comment,
                type: "text",
                multiline: true,
                rows: 5,
                label: "Comment"
              },
            }
          }
          onChange={this.fieldChange}
          onSubmit={this.saveStaff}
        />
      </section>
    );
  }

}

export default container(StaffPage)({title: "Person"});