import WhatsAppIntegration from "layouts/whatsapp/components/whatsapp-integration";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Data
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

function WhatsApp() {
  const { sales, tasks } = reportsLineChartData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={2} pb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={12}>
            <MDBox mt={2}>
              <WhatsAppIntegration />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default WhatsApp;
