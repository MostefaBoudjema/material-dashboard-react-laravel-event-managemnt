// @mui material components

// Material Dashboard 2 React components
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert, Snackbar } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";


function Waitlist() {
  // const { sales, tasks }=reportsLineChartData;

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
                  <MDTypography variant="h6" color="white">waitlist</MDTypography>
                  <Button variant="contained" color="white" onClick={() => handleOpenDialog(null)}>
                    Join Waitlist
                  </Button>
                </Grid>
              </MDBox>

            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox py={3}>
        <MDBox mt={4.5}>
          
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Waitlist;
