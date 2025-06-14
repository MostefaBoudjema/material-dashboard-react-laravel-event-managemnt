import { useState } from "react";
import {
  Grid,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

const WhatsAppForm = ({ onMessageSent }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ phoneNumber: "", message: "" });
    setError("");
    setSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to send messages");
        return;
      }

      const response = await fetch("/api/v2/whatsapp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setSuccess(true);
      setFormData({ phoneNumber: "", message: "" });
      if (onMessageSent) {
        onMessageSent();
      }
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <MDButton variant="gradient" color="info" onClick={handleOpen}>
        New Message
      </MDButton>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Send WhatsApp Message</DialogTitle>
        <DialogContent>
          <MDBox component="form" role="form" onSubmit={handleSubmit} mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="+1234567890"
                  helperText="Enter phone number with country code (e.g., +1234567890)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                />
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
              {success && (
                <Grid item xs={12}>
                  <Alert severity="success">Message sent successfully!</Alert>
                </Grid>
              )}
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={processing || !formData.phoneNumber || !formData.message}
            variant="contained"
            color="primary"
          >
            {processing ? "Sending..." : "Send Message"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WhatsAppForm; 