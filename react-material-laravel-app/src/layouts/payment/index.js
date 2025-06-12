
// @mui material components
import Grid from "@mui/material/Grid";
import { Card } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import PaymentForm from "layouts/payment/components/PaymentForm";

function Payment() {
  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
      <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Payment Information
                  </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                  <PaymentForm />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
       
        
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Payment;
