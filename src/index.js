import React from "react";
import ReactDom from "react-dom";
import {Router, Route, browserHistory, IndexRoute} from "react-router";
import NoMatch from "./components/notFoundPage";
import UserListPage from "./components/user";
import UserPage from "./components/user/item";
import StaffListPage from "./components/staff";
import StaffPage from "./components/staff/item";
import ProfilePage from "./components/profile";
import App from "./components/app";
import LogoutPage from "./components/auth/logoutPage";
import "react-toolbox/lib/commons.scss";
import "./static/stylesheets/style.scss";

ReactDom.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={StaffListPage}/>
      <Route path="logout" component={LogoutPage}/>
      <Route path="users" component={UserListPage}/>
      <Route path="users/create" component={UserPage}/>
      <Route path="users/:id" component={UserPage}/>
      <Route path="staff" component={StaffListPage}/>
      <Route path="staff/create" component={StaffPage}/>
      <Route path="staff/:id" component={StaffPage}/>
      <Route path="profile" component={ProfilePage}/>
    </Route>
    <Route path="*" component={NoMatch}/>
  </Router>
), document.getElementById("app"));
