// routes.js
import Empty from "layouts/empty";
import Events from "layouts/events";
import Login from "auth/login";
import Register from "auth/register";
import ForgotPassword from "auth/forgot-password";
import ResetPassword from "auth/reset-password";
import Icon from "@mui/material/Icon";
import Waitlist from "layouts/waitlist";
import EventCalendar from "layouts/events-calendar";
import Users from "layouts/users";
import Roles from "layouts/roles";
import Payment from "layouts/payment";
import WhatsApp from "layouts/whatsapp";

// Function to generate routes based on isAdmin
const getRoutes = (isAdmin) => [
  {
    type: "collapse2",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Empty />,
  },
  {
    type: "title",
    title: "Event Management",
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
  {
    type: "title",
    title: "Payments",
  },
  {
    type: "collapse",
    name: "Stripe Payment",
    key: "stripe-payment",
    icon: <Icon fontSize="small">payment</Icon>,
    route: "/stripe-payment",
    component: <Payment />,
  },
  {
    type: "title",
    title: "Twilio WhatsApp",
  },
  {
    type: "collapse",
    name: "WhatsApp Integration",
    key: "whatsapp-integration",
    icon: <Icon fontSize="small">phone</Icon>,
    route: "/whatsapp-integration",
    component: <WhatsApp />,
  },
  // {
  //   type: "dividerAdmin",
  // },
  // {
  //   type: "titleAdmin",
  //   title: "User Management",
  //   isAdmin: isAdmin, // Pass isAdmin dynamically
  // },
  // {
  //   type: "admin",
  //   name: "Users",
  //   key: "users",
  //   icon: <Icon fontSize="small">manage_accounts</Icon>,
  //   route: "/users",
  //   isAdmin: isAdmin, // Pass isAdmin dynamically
  //   component: <Users />,
  // },
  // {
  //   type: "admin",
  //   name: "Roles",
  //   key: "roles",
  //   icon: <Icon fontSize="small">people</Icon>,
  //   route: "/roles",
  //   isAdmin: isAdmin, // Pass isAdmin dynamically
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

export default getRoutes;