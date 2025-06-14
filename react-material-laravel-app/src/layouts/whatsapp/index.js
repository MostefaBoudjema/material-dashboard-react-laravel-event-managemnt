import { useState, useEffect } from "react";
import { Grid, Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import whatsappTableData from "./data/whatsappTableData";
import WhatsAppIntegration from "layouts/whatsapp/components/whatsapp-integration";
import whatsappService from "services/whatsapp-service";

function WhatsApp() {
  const [messages, setMessages]=useState([]);
  const [loading, setLoading]=useState(true);
  const [error, setError]=useState(null);
  const [selectedMessage, setSelectedMessage]=useState(null);
  const [openDialog, setOpenDialog]=useState(false);

  const fetchMessages=async () => {
    try {
      setLoading(true);
      const token=localStorage.getItem("token");

      if (!token) {
        setError("Please login to view messages");
        return;
      }

      const response=await whatsappService.getWhatsapps(token);
      if (response.success) {
        setMessages(response.data);
        setError(null);
      } else {
        setError(response.message||"Failed to fetch messages");
      }
    } catch (err) {
      setError(err.message||"Failed to fetch messages");
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleOpenDialog=(message) => {
    setSelectedMessage(message);
    setOpenDialog(true);
  };

  const handleCloseDialog=() => {
    setSelectedMessage(null);
    setOpenDialog(false);
  };

  const handleDelete=async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const token=localStorage.getItem("token");
        const response=await whatsappService.deleteWhatsapp(token, id);

        if (response.success) {
          fetchMessages();
        } else {
          setError(response.message||"Failed to delete message");
        }
      } catch (err) {
        setError(err.message||"Failed to delete message");
        console.error("Error deleting message:", err);
      }
    }
  };

  const { columns, rows }=whatsappTableData(messages, handleOpenDialog, handleDelete);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* WhatsApp Form Section */}
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2}
                mt={-8}
                py={3}
                px={2}>
                <WhatsAppIntegration onMessageSent={fetchMessages} />
              </MDBox>
            </Card>
          </Grid>

          {/* WhatsApp Table Section */}
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDBox
                  mx={2}
                  mt={-6}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    WhatsApp Integration
                  </MDTypography>
                </MDBox>
                {error&&(
                  <MDBox mb={3}>
                    <MDTypography color="error">{error}</MDTypography>
                  </MDBox>
                )}
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default WhatsApp;
