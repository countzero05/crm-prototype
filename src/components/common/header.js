import React, {PropTypes} from "react";
import MeStore from "./../../stores/meStore";
import {NavDrawer} from "react-toolbox";
import {List/*, ListItem*/} from "react-toolbox/lib/list";
import ListItem from "./react-toolbox-override/ListItem";

const Header = ({active, toggle}) => {
  let user = MeStore.getUser();

  return user.role.toLowerCase() === "admin" ? (
      <NavDrawer
        active={active}
        pinned={false}
        width="normal"
        onOverlayClick={ toggle }
      >
        <div style={{flex: 1, overflowY: "auto"}}>
          <List selectable ripple>
            <ListItem
              caption="Users"
              legend="List of existing users"
              leftIcon="supervisor_account"
              to="/users"
              onClick={toggle}
            />
            <ListItem
              caption="Profile"
              legend="Edit account settings"
              leftIcon="account_box"
              to="/profile"
              onClick={toggle}
            />
            <ListItem
              caption="Staff"
              legend="List of existing persons"
              leftIcon="people"
              to="/staff"
              onClick={toggle}
            />
            <ListItem
              caption="Log out"
              legend="Log out from system"
              leftIcon="exit_to_app"
              to="/logout"
              onClick={toggle}
            />
          </List>
        </div>
      </NavDrawer>
    ) : (
      <NavDrawer
        active={active}
        pinned={false}
        width="normal"
        onOverlayClick={ toggle }
      >
        <List selectable ripple>
          <ListItem
            caption="Profile"
            legend="Edit account settings"
            leftIcon="account_box"
            to="/profile"
            onClick={toggle}
          />
          <ListItem
            caption="Staff"
            legend="List of existing persons"
            leftIcon="people"
            to="/staff"
            onClick={toggle}
          />
          <ListItem
            caption="Log out"
            legend="Log out from system"
            leftIcon="exit_to_app"
            to="/logout"
            onClick={toggle}
          />
        </List>
      </NavDrawer>
    );
};

Header.propTypes = {
  active: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default Header;