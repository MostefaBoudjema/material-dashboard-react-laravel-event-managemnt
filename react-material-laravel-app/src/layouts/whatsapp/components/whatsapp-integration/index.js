import React, { useState } from "react";
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const WhatsAppIntegration = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSendMessage = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/whatsapp/send", {
        phoneNumber,
        message,
      }, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });

      if (response.data.success) {
        // Clear form after successful send
        setPhoneNumber("");
        setMessage("");
        setSnackbar({
          open: true,
          message: "Message sent successfully!",
          severity: "success"
        });
      } else {
        throw new Error(response.data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to send message. Please try again.",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBox pt={6} pb={3}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
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
                WhatsApp Integration
              </MDTypography>
            </MDBox>
            <CardContent>
              <Box sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  label="Phone Number (with country code)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  multiline
                  rows={4}
                  margin="normal"
                  required
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={loading || !phoneNumber || !message}
                  sx={{ mt: 2 }}
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MDBox>
  );
};

export default WhatsAppIntegration;
