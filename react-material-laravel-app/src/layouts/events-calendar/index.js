import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert, Snackbar } from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import EventService from "services/event-service";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from "react-router-dom";

const localizer=momentLocalizer(moment);

function EventCalendar() {
  const token=localStorage.getItem('token');
  const [events, setEvents]=useState([]);
  const [openDialog, setOpenDialog]=useState(false);
  const [currentEvent, setCurrentEvent]=useState(null);
  const [errorMessage, setErrorMessage]=useState("");
  const [successMessage, setSuccessMessage]=useState("");
  const [formData, setFormData]=useState({
    name: "", date_time: "", duration: "", location: "", capacity: "", waitlist_capacity: "", status: ""
  });
  const navigate=useNavigate();

  useEffect(() => {
    const fetchEvents=async () => {
      try {
        const data=await EventService.getEvents(token);
        setEvents(data);
      } catch (error) {
        setErrorMessage(error.message||"Failed to fetch events.");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    };
    fetchEvents();
  }, [token]);


  const handleJoinEvent=async () => {
    try {
      await EventService.joinEvent(token, currentEvent.id);
      setSuccessMessage("Successfully joined the event.");
      const updatedEvents = await EventService.getEvents(token); // Fetch updated events
      setEvents(updatedEvents);
      handleCloseDialog();
    } catch (error) {
      setErrorMessage(error.message||"Failed to join the event.");
      setTimeout(() => {
        setErrorMessage("");
        if (error.status=='409') {
          navigate(`/waitlist/${currentEvent.id}`);
        }
      }, 5000);
    }
  };


  const handleDeleteEvent=async () => {
    try {
      await EventService.deleteEvent(token, currentEvent.id);
      const updatedEvents=await EventService.getEvents(token);
      setEvents(updatedEvents);
      setSuccessMessage("Event deleted successfully.");
      handleCloseDialog();
    } catch (error) {
      setErrorMessage(error.message||"Failed to delete the event.");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };


  const handleOpenDialog=async (event=null) => {
    console.log('handleOpenDialog');
    try {
      if (event) {
        const data=await EventService.showEvent(token, event.id);
        setCurrentEvent(event);
        setFormData(data);
      } else {
        setCurrentEvent(null);
        setFormData({ name: "", date_time: "", duration: "", location: "", capacity: "", waitlist_capacity: "", status: "" });
      }
      setErrorMessage("");
      setOpenDialog(true);
    } catch (error) {
      setErrorMessage(error.message||"Failed to load event details.");
      console.error(error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleCloseDialog=async () => {
    setOpenDialog(false);
    setFormData({ name: "", date_time: "", duration: "", location: "", capacity: "", waitlist_capacity: "", status: "" });
  }

  const handleFormSubmit=async () => {
    try {
      if (currentEvent) {
        await EventService.updateEvent(token, currentEvent.id, formData);
        setSuccessMessage("Event updated successfully.");
      } else {

        await EventService.createEvent(token, formData);
        setSuccessMessage("Event created successfully.");
      }
      const updatedEvents=await EventService.getEvents(token);
      setEvents(updatedEvents);
      handleCloseDialog();
    } catch (error) {
      setErrorMessage(error.message||"Failed to save event.");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleSelectSlot=({ start, end }) => {
    setFormData({ ...formData, date_time: moment(start).format('YYYY-MM-DDTHH:mm') });
    setCurrentEvent(null);
    setOpenDialog(true);
  };

  const handleEventClick=(event) => {
    handleOpenDialog(event);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={5}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">Events Calendar</MDTypography>
              </MDBox>
              <MDBox p={3}>
                {errorMessage&&<Alert severity="error">{errorMessage}</Alert>}
                <Snackbar
                  open={!!successMessage}
                  autoHideDuration={3000}
                  onClose={() => setSuccessMessage("")}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                  <Alert onClose={() => setSuccessMessage("")} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                  </Alert>
                </Snackbar>
                <Calendar
                  localizer={localizer}
                  events={events.map(event => ({
                    id: event.id,
                    title: event.name,
                    start: new Date(event.date_time),
                    end: new Date(new Date(event.date_time).getTime()+event.duration*60000),
                    is_participating: event.is_participating, 
                  }))}
                  eventPropGetter={(event) => ({
                    style: {
                      backgroundColor: event.is_participating ? "#4caf50" : "#3174ad",
                      color: "white",
                    },
                  })}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600 }}
                  selectable
                  onSelectEvent={handleEventClick}
                  onSelectSlot={handleSelectSlot}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{currentEvent? "Edit Event":"Create Event"}</DialogTitle>
        <DialogContent>
          {errorMessage&&<Alert severity="error">{errorMessage}</Alert>}
          {Object.keys(formData)
            .filter((key) => !["id", "created_at", "updated_at"].includes(key))
            .map((key) => (
              key==="status"? (
                <TextField
                  key={key}
                  select
                  fullWidth
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  margin="normal"
                  SelectProps={{ native: true }}
                >
                  <option value="">_</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </TextField>
              ):key==="date_time"? (
                <TextField
                  key={key}
                  fullWidth
                  label="Date Time"
                  type="datetime-local"
                  value={formData.date_time}
                  onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              ):(
                <TextField
                  key={key}
                  fullWidth
                  label={key.replace("_", " ")}
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  margin="normal"
                />
              )
            ))}
        </DialogContent>
        <DialogActions>

          <Button variant="contained" color="success" onClick={handleFormSubmit}>
            Save
          </Button>
          {currentEvent&&(
            <Button variant="contained" color="error" onClick={handleDeleteEvent}>
              Delete
            </Button>
          )}
          {currentEvent&&(
            <Button variant="contained" color="success" onClick={handleJoinEvent}>
              Join
            </Button>
          )}
          <Button variant="contained" color="error" onClick={handleCloseDialog}>
            Cancel
          </Button>
        </DialogActions>


      </Dialog>
    </DashboardLayout>
  );
}

export default EventCalendar;
