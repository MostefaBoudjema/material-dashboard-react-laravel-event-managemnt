import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { CircularProgress, Button, Snackbar,Alert } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import EventService from "services/event-service";
import waitlistService from "services/waitlist-service";

function Waitlist() {
  const { eventId }=useParams();
  const [event, setEvent]=useState(null);
  const [loading, setLoading]=useState(true);
  const [errorMessage, setErrorMessage]=useState("");
  const [successMessage, setSuccessMessage]=useState("");
  const token=localStorage.getItem('token');

  useEffect(() => {
    // Simulating fetching event by ID
    const fetchEvent=async () => {
      try {
        const data=await EventService.showEvent(token, eventId);
        setEvent(data);
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEvent();
  }, [eventId]);

  const handleJoinWaitlist=async () => {
    try {
      await waitlistService.joinWaitlist(token, eventId);
      setSuccessMessage("Successfully joined the waitlist.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      setErrorMessage(error.message||"Failed to join the waitlist.");
      setTimeout(() => setErrorMessage(""), 5000);
    }
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
                <MDTypography variant="h6" color="white">
                  Event Details
                </MDTypography>
              </MDBox>
              {errorMessage&&<Alert severity="error">{errorMessage}</Alert>}
              {successMessage&&<Alert severity="success">{successMessage}</Alert>}
                {/* <Snackbar
                  open={!!successMessage}
                  autoHideDuration={3000}
                  onClose={() => setSuccessMessage("")}
                  anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                >
                  <Alert onClose={() => setSuccessMessage("")} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                  </Alert>
                </Snackbar> */}
              <MDBox p={3}>
                {loading? (
                  <CircularProgress />
                ):event? (
                  <MDBox display="flex" flexDirection="column" gap={1} p={2}>
                    <MDTypography variant="h4" fontWeight="bold" gutterBottom>
                      {event.name}
                    </MDTypography>

                    <MDTypography variant="body1" color="text.secondary">
                      {event.description}
                    </MDTypography>

                    <MDTypography variant="body1">
                      <strong>Location:</strong> {event.location}
                    </MDTypography>

                    <MDTypography variant="body1">
                      <strong>Duration:</strong> {event.duration}
                    </MDTypography>

                    <MDTypography variant="body2" color="text.secondary">
                      <strong>Date:</strong> {new Date(event.date_time).toLocaleDateString()}
                    </MDTypography>

                    <MDTypography variant="body2" color="text.secondary">
                      <strong>Time:</strong> {new Date(event.date_time).toLocaleTimeString()}
                    </MDTypography>

                    <MDBox mt={2}>
                      <Button variant="contained" color="success"  onClick={handleJoinWaitlist}>
                        Join Waitlist
                      </Button>
                    </MDBox>
                  </MDBox>

                ):(
                  <MDTypography color="error">Event not found!</MDTypography>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Waitlist;
