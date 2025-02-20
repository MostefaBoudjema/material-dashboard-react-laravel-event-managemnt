import { useState, useEffect, useContext } from "react";
import EventService from "services/event-service";
// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

import AuthService from "services/auth-service";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import MDButton from "components/MDButton";
import { AuthContext } from "context";
import { Badge } from "@mui/material";

function DashboardNavbar({ absolute, light, isMini }) {
  const authContext=useContext(AuthContext);
  const [navbarType, setNavbarType]=useState();
  const [controller, dispatch]=useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode }=controller;
  const [openMenu, setOpenMenu]=useState(false);
  const route=useLocation().pathname.split("/").slice(1);
  let navigate=useNavigate();


  // Inside the DashboardNavbar component
  const [joinedEvents, setJoinedEvents]=useState([]);
  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar&&window.scrollY===0)||!fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  useEffect(() => {
    const fetchJoinedEvents=async () => {
      try {
        const token=localStorage.getItem("token");
        const events=await EventService.getJoinedEvents(token);
        setJoinedEvents(events);
      } catch (error) {
        console.error("Failed to fetch joined events", error);
      }
    };

    fetchJoinedEvents();
  }, []);

  const handleMiniSidenav=() => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen=() => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu=(event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu=() => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu=() => (
    <Menu anchorEl={openMenu} open={Boolean(openMenu)} onClose={handleCloseMenu} sx={{ mt: 2 }}>
      {joinedEvents.length>0? (
        joinedEvents.map((joinedEvent) => {
          const eventDate=new Date(joinedEvent.event.date_time);
          const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


          return (
            <NotificationItem
              key={joinedEvent.event.id}
              icon={<Icon>event</Icon>}
              title={`${joinedEvent.event.name} at ${formattedTime}`}
              description=""
            />

          );
        })
      ):(
        <NotificationItem title="No events joined" />
      )}
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle=({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue=light||darkMode? white.main:dark.main;

      if (transparentNavbar&&!light) {
        colorValue=darkMode? rgba(text.main, 0.6):text.main;
      }

      return colorValue;
    },
  });

  const handleLogOut=async () => {
    const response=await AuthService.logout();
    authContext.logout();
  };

  return (
    <AppBar
      position={absolute? "absolute":navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length-1]} route={route} light={light} />
        </MDBox>
        {isMini? null:(
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            {/* <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox> */}
            <MDBox display="flex" alignItems="center" color={light? "white":"inherit"}>
              <Link to="/authentication/sign-in/basic">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <Icon sx={iconsStyle}>account_circle</Icon>
                </IconButton>
              </Link>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav? "menu_open":"menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>

              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                mx="4"
                onClick={handleOpenMenu}
              >
                <Badge badgeContent={joinedEvents.length} color="error" sx={{ mr: 2 }}>
                  <Icon sx={iconsStyle}>notifications</Icon>
                </Badge>

              </IconButton>

              {renderMenu()}
              <MDBox>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  type="button"
                  onClick={handleLogOut}
                >
                  Log Out
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps={
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes={
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
