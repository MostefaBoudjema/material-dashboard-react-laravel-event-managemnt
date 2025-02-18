import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import eventsTableData from "layouts/events/data/eventsTableData";
import EventService from "services/event-service";

function Events() {
  const token=localStorage.getItem('token');
  const [events, setEvents]=useState([]);
  const [openDialog, setOpenDialog]=useState(false);
  const [currentEvent, setCurrentEvent]=useState(null);
  const [formData, setFormData]=useState({
    name: "", date_time: "", duration: "", location: "", capacity: "", waitlist_capacity: "", status: ""
  });

  useEffect(() => {
    const fetchEvents=async () => {
      const data=await EventService.getEvents(token);
      setEvents(data);
    };
    fetchEvents();
  }, [token]);

  const handleOpenDialog=async (event=null) => {
    console.log(event);
    if (event) {
      const data=await EventService.showEvent(token, event.id);
      setCurrentEvent(event);
      setFormData(data);
    } else {
      setCurrentEvent(null);
      setFormData({ name: "", date_time: "", duration: "", location: "", capacity: "", waitlist_capacity: "", status: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog=() => setOpenDialog(false);

  const handleFormSubmit=async () => {
    if (currentEvent) {
      await EventService.updateEvent(token, currentEvent.id, formData);
    } else {
      await EventService.createEvent(token, formData);
    }
    const updatedEvents=await EventService.getEvents(token);
    setEvents(updatedEvents);
    handleCloseDialog();
  };

  const handleDelete=async (e) => {
    // console.log(e.id);
    await EventService.deleteEvent(token, e.id);
    setEvents(events.filter(event => event.id!==e.id));
  };

  const { columns, rows }=eventsTableData(events, handleOpenDialog, handleDelete);

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
                <Grid container justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">Events Table</MDTypography>
                  <Button variant="contained" color="white" onClick={() => handleOpenDialog(null)}>
                    New Event
                  </Button>
                </Grid>
              </MDBox>

              <MDBox pt={3}>
                <DataTable table={{ columns, rows }} isSorted={false} entriesPerPage={false} showTotalEntries={true} noEndBorder />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* DialogForm */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{currentEvent? "Edit Event":"Create Event"}</DialogTitle>
        <DialogContent>
          {Object.keys(formData)
            .filter((key) => !["id", "created_at", "updated_at"].includes(key))
            .map((key) =>
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
            )}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>


    </DashboardLayout>
  );
}

export default Events;
