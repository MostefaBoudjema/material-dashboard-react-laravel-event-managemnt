import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert, Snackbar } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import paymentsTableData from "layouts/payment/data/paymentsTableData";
import PaymentService from "services/payment-service";
import PaymentForm from "./components/PaymentForm";

function Payment() {
  const token = localStorage.getItem('token');
  const [payments, setPayments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    currency: "usd",
    payment_method: "",
    status: ""
  });

  const fetchPayments = async () => {
    try {
      setErrorMessage("");
      const data = await PaymentService.getPayments(token);
      setPayments(data);
    } catch (error) {
      setErrorMessage("Failed to fetch payments.");
      console.error('Error fetching payments:', error);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [token]);

  const handleOpenDialog = async (payment = null) => {
    try {
      if (payment) {
        const data = await PaymentService.showPayment(token, payment.id);
        setCurrentPayment(payment);
        setFormData(data);
      } else {
        setCurrentPayment(null);
        setFormData({ amount: "", currency: "usd", payment_method: "", status: "" });
      }
      setErrorMessage("");
      setOpenDialog(true);
    } catch (error) {
      setErrorMessage("Failed to load payment details.");
      console.error(error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleFormSubmit = async () => {
    try {
      if (currentPayment) {
        await PaymentService.updatePayment(token, currentPayment.id, formData);
      } else {
        await PaymentService.createPayment(token, formData);
      }
      const updatedPayments = await PaymentService.getPayments(token);
      setPayments(updatedPayments);
      handleCloseDialog();
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
      console.error(error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleDelete = async (payment) => {
    try {
      await PaymentService.deletePayment(token, payment.id);
      setPayments(payments.filter(p => p.id !== payment.id));
      setSuccessMessage("Payment deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to delete payment.");
      console.error(error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const { columns, rows } = paymentsTableData(payments, handleOpenDialog, handleDelete);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* Payment Form Section */}
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDBox mb={3}>
                  <MDTypography variant="h5">Payment Form</MDTypography>
                </MDBox>
                <PaymentForm onPaymentSuccess={fetchPayments} />
              </MDBox>
            </Card>
          </Grid>

          {/* Payment Table Section */}
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
                <MDTypography variant="h6" color="white">Payment Table</MDTypography>
              </MDBox>

              <MDBox pt={3}>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
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

                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{currentPayment ? "Edit Payment" : "Create Payment"}</DialogTitle>
        <DialogContent>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {Object.keys(formData)
            .filter((key) => !["id", "created_at", "updated_at"].includes(key))
            .map((key) => (
              key === "status" ? (
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
                  <option value="succeeded">Succeeded</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </TextField>
              ) : key === "currency" ? (
                <TextField
                  key={key}
                  select
                  fullWidth
                  label="Currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  margin="normal"
                  SelectProps={{ native: true }}
                >
                  <option value="usd">USD</option>
                  <option value="eur">EUR</option>
                  <option value="gbp">GBP</option>
                </TextField>
              ) : (
                <TextField
                  key={key}
                  fullWidth
                  label={key.replace("_", " ")}
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  margin="normal"
                  type={key === "amount" ? "number" : "text"}
                />
              )
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Payment;
