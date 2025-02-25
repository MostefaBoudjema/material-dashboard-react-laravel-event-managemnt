
// Material Dashboard 2 React layouts
import Empty from "layouts/empty";

import Events from "layouts/events";


import Login from "auth/login";
import Register from "auth/register";
import ForgotPassword from "auth/forgot-password";
import ResetPassword from "auth/reset-password";

// @mui icons
import Icon from "@mui/material/Icon";
import Waitlist from "layouts/waitlist";
import EventCalendar from "layouts/events-calendar";
import Users from "layouts/users";
import Roles from "layouts/roles";

const routes=[
  {
    type: "collapse2",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Empty />,
  },

  {
    type: "collapse",
    name: "Events Table",
    key: "events",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/events",
    component: <Events />,
  },
  {
    type: "collapse",
    name: "Events Calendar",
    key: "events-calendar",
    icon: <Icon fontSize="small">calendar_month</Icon>,
    route: "/events-calendar",
    component: <EventCalendar />,
  },
  // {
  //   type: "divider",
  // },


  // {
  //   type: "collapse",
  //   name: "Users",
  //   key: "users",
  //   icon: <Icon fontSize="small">manage_accounts</Icon>,
  //   route: "/users",
  //   component: <Users />,
  // },

  // {
  //   type: "collapse",
  //   name: "Roles",
  //   key: "roles",
  //   icon: <Icon fontSize="small">people</Icon>,
  //   route: "/roles",
  //   component: <Roles />,
  // },

  {
    type: "auth",
    name: "Login",
    key: "login",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/auth/login",
    component: <Login />,
  },
  {
    type: "auth",
    name: "Register",
    key: "register",
    icon: <Icon fontSize="small">reigster</Icon>,
    route: "/auth/register",
    component: <Register />,
  },
  {
    type: "auth",
    name: "Forgot Password",
    key: "forgot-password",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/auth/forgot-password",
    component: <ForgotPassword />,
  },
  {
    type: "auth",
    name: "Reset Password",
    key: "reset-password",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/auth/reset-password",
    component: <ResetPassword />,
  },
  {
    type: "collapse2",
    name: "waitlist",
    key: "waitlist",
    icon: <Icon fontSize="small">waitlist</Icon>,
    route: "/waitlist/:eventId",
    component: <Waitlist />,
  },

];

export default routes;


/** 
  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/
