import React, {PropTypes, Component} from "react";
import {Form} from "react-toolbox";
import * as StaffActions from "./../../actions/staffActions";
import StaffStore from "./../../stores/staffStore";
import * as UserActions from "./../../actions/userActions";
import UserStore from "./../../stores/userStore";
import * as ActionTypes from "./../../constants/actionTypes";
import container from "./../common/container";
import MeStore from "./../../stores/meStore";
import Input from "react-toolbox/lib/input";
import Link from "react-toolbox/lib/link";

class StaffPage extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    setActions: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      person: {
        name: "",
        email: "",
        comment: "",
        active: false,
        partner: props.location.query.partner ? props.location.query.partner : null
      },
      users: []
    };

  }

  componentWillMount() {
    StaffStore.addChangeListener(this._onChange);
    if (this.props.params.id) {
      StaffActions.initializeStaff(this.props.params.id);
    }

    if (MeStore.getUser().role.toLowerCase() === "admin") {
      UserStore.addChangeListener(this._onChange);

      if (!UserStore.getUsers().length) {
        UserActions.initialize();
      }
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
        href: this.context.router.createHref({...location, pathname: `/staff`})
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
    if (MeStore.getUser()._id && MeStore.getUser().role.toLowerCase() === "admin") {
      UserStore.removeChangeListener(this._onChange);
    }
  }

  _onChange = (event_type, data) => {
    if (event_type === ActionTypes.UPDATE_STAFF || event_type === ActionTypes.CREATE_STAFF || event_type === ActionTypes.INITIALIZE_STAFF) {
      this.setState({person: {...this.state.person, ...data}});
      this.setActions();
    } else if (event_type === ActionTypes.INITIALIZE_USERS) {
      this.setState({users: data})
    }
  };

  fieldChange = (name, value) => this.setState({person: {...this.state.person, [name]: value}});

  saveStaff = () => (this.state._id ? StaffActions.updateStaff(this.state.person) : StaffActions.createStaff(this.state.person)).then((staff) => staff.error === undefined ? this.goMain() : staff);
  removeStaff = () => StaffActions.removeStaff(this.state.person._id).then((staff) => staff.error === undefined ? this.goMain() : staff);

  goMain = () => this.context.router.push(this.context.router.createHref({...location, pathname: `/staff`}));

  handleFile = (file, e) => {
    if (e.target.files.length === 1) {
      if (e.target.files[0].size > 1024 * 1024) {
        let {person} = this.state;
        if (!person.error || person.error.constructor.name === "String") {
          person.error = {};
        }
        person.error.file = "File size should be less then 1MB";
      } else {
        StaffActions.uploadStaff(this.state.person, e.target.files[0]);
      }
    }
  };

  render() {
    const {person} = this.state;

    const model =
      {
        name: {
          kind: "input",
          name: "name",
          value: person.name,
          type: "text",
          label: "Name",
          required: true,
          error: this.state.person.error && this.state.person.error.name
        },
        email: {
          kind: "input",
          name: "email",
          value: person.email,
          type: "email",
          label: "Email",
          error: this.state.person.error && this.state.person.error.email
        },
        active: {
          kind: "switch",
          name: "active",
          checked: person.active,
          label: "Active"
        },
        dateStart: {
          kind: "datepicker",
          name: "dateStart",
          value: person.dateStart,
          label: "Date start",
          autoOk: true,
          error: this.state.person.error && this.state.person.error.dateStart
        },
        dateEnd: {
          kind: "datepicker",
          name: "dateEnd",
          value: person.dateEnd,
          label: "Date end",
          autoOk: true,
          error: this.state.person.error && this.state.person.error.dateEnd
        },
        comment: {
          kind: "input",
          name: "email",
          value: person.comment,
          type: "text",
          multiline: true,
          rows: 5,
          label: "Comment",
          error: this.state.person.error && this.state.person.error.comment
        },
      };

    if (MeStore.getUser().role.toLowerCase() === "admin") {
      const users = UserStore.getUsers();

      model.partner = {
        kind: "dropdown",
        name: "partner",
        label: "Partner",
        source: [{label: "", value: ""}].concat(users.map(user => ({label: user.name, value: user._id}))),
        value: person.partner,
        allowBlank: true,
        error: this.state.person.error && this.state.person.error.partner
      };
    }

    return (
      <section>
        <Form
          model={model}
          onChange={this.fieldChange}
          onSubmit={this.saveStaff}
        />

        <Input
          type="file"
          icon="attach_file"
          onChange={this.handleFile}
          error={this.state.person.error && this.state.person.error.file}
        />

        {this.state.person.file ? (
            <Link
              icon="file_download"
              href={`/api/staff/download/${this.state.person._id}`}
              label={this.state.person.file.replace(/^[a-z\d]+_/, "")}
              target="_blank"
            />
          ) : null}
      </section>
    );
  }
}

export default container(StaffPage)({title: "Person"});