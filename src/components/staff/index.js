import React, {Component, PropTypes} from "react";
import * as StaffActions from "./../../actions/staffActions";
import StaffStore from "./../../stores/staffStore";
import * as ActionTypes from "./../../constants/actionTypes";
// import Table from "react-toolbox/lib/table";
import container from "./../common/container";
import * as UserActions from "./../../actions/userActions";
import UserStore from "./../../stores/userStore";
import MeStore from "./../../stores/meStore";
import Dropdown from "react-toolbox/lib/dropdown";
import {List, ListSubHeader} from "react-toolbox/lib/list";
import ListItem from "./../common/react-toolbox-override/ListItem";
import format from "date-format";
import style from "./../../static/stylesheets/style.scss";

class StaffListPage extends Component {
  static propTypes = {
    children: PropTypes.object,
    setActions: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      staffs: null,
      selected: [],
      users: [],
      _users: {},
    };
  }

  componentWillMount() {
    StaffStore.addChangeListener(this._onChange);
    StaffActions.initialize(this.props.location.query || {});

    if (MeStore.getUser().role.toLowerCase() === "admin") {
      UserStore.addChangeListener(this._onChange);

      if (!UserStore.getUsers().length) {
        UserActions.initialize();
      }
    }

    this.setActions([]);
  }

  componentWillUnmount() {
    StaffStore.removeChangeListener(this._onChange);
    if (MeStore.getUser()._id && MeStore.getUser().role.toLowerCase() === "admin") {
      UserStore.removeChangeListener(this._onChange);
    }
  }

  componentWillReceiveProps(props) {
    if (props.location.query !== this.props.location.query) {
      StaffActions.initialize(props.location.query || {});
    }
  }

  _onChange = (event_type, data) => {
    if (event_type === ActionTypes.INITIALIZE_STAFFS) {
      this.setState({staffs: data});
    } else if (event_type === ActionTypes.DELETE_STAFF || event_type === ActionTypes.CREATE_STAFF || event_type === ActionTypes.UPDATE_STAFF) {
      StaffActions.initialize();
    } else if (event_type === ActionTypes.INITIALIZE_USERS) {
      this.setState({
        users: data,
      })
    }
  };

  removeStaff = id => {
    this.setState({selected: []});
    StaffActions.removeStaff(id);
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
          href: this.context.router.createHref({...location, pathname: `/staff/create`})
        },
        edit: {
          // label: "Edit",
          title: "Edit",
          icon: "edit",
          href: this.context.router.createHref({...location, pathname: `/staff/${this.state.staffs[selected[0]]._id}`})
        },
        remove: {
          // label: "Remove",
          title: "Remove",
          icon: "delete",
          onClick: this.removeStaff.bind(this, this.state.staffs[selected[0]]._id)
        }
      })
    } else {
      this.props.setActions({
        create: {
          // label: "Create",
          title: "Create",
          icon: "person_add",
          href: this.context.router.createHref({...location, pathname: `/staff/create`})
        }
      })
    }
  };

  handlePartnerChange = (value) => {
    this.context.router.push({...this.props.location, query: {partner: value}})
  };

  render() {
    if (!this.state.staffs) {
      return null;
    }

    let dropdown;

    if (MeStore.getUser().role.toLowerCase() === "admin") {
      const users = UserStore.getUsers();

      if (!users.length) {
        return null;
      }

      dropdown =
        (
          <Dropdown
            auto
            label="Filter by partner"
            onChange={this.handlePartnerChange}
            source={[{label: "All partners", value: ""}, {
              label: "Only unsigned",
              value: "-1"
            }].concat(users.map(user => ({label: user.name, value: user._id})))}
            value={this.props.location.query.partner || ""}
          />
        );
    }

    const grouped = this.state.staffs.reduce((self, current) => {
      if (self[current.partner] === undefined) {
        self[current.partner] = [current]
      } else {
        self[current.partner].push(current)
      }
      return self;
    }, {});

    const _users = UserStore._getUsers();

    return (
      <section>
        {dropdown}

        <List selectable ripple>
          {Object.keys(grouped).map((key) => (
            <section key={key} className={style["row"]} style={{borderBottom: "1px solid #bbb"}}>
              <ListSubHeader
                className={`${style["col-xs-12"]} ${style["col-sm-12"]} ${style["col-md-12"]} ${style["col-lg-12"]}`}
                caption={_users[key] === undefined ? "Unsigned" : _users[key].name}/>
              {grouped[key].map(person => (
                <ListItem
                  leftIcon="account_box"
                  className={`${style["col-xs-12"]} ${style["col-sm-6"]} ${style["col-md-6"]} ${style["col-lg-6"]} ${style["bordered"]}`}
                  key={person._id}
                  selectable={true}
                  ripple={true}
                  caption={person.name}
                  legend={`${person.dateStart ? format("yyyy-MM-dd", person.dateStart) : ""} ${person.dateStart || person.dateEnd ? "-" : ""} ${person.dateEnd ? format("yyyy-MM-dd", person.dateEnd) : ""}`}
                  rightIcon={person.active ? "star" : undefined}
                  to={this.context.router.createHref({...location, pathname: `/staff/${person._id}`})}
                />
              ))}
            </section>
          ))}

        </List>
      </section>
    );
  }
}

export default container(StaffListPage)({title: "Staff"});