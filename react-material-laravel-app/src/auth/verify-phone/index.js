import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function VerifyPhone() {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/verify-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to dashboard or home page after successful verification
        navigate("/dashboard");
      } else {
        setError(data.message || "Verification failed");
      }
    } catch (err) {
      setError("An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/resend-verification", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCountdown(60); // Start 60-second countdown
      } else {
        setError(data.message || "Failed to resend code");
      }
    } catch (err) {
      setError("An error occurred while resending the code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Verify Your Phone Number
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter the verification code sent to your phone
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleVerify}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Verification Code"
                variant="standard"
                fullWidth
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                inputProps={{
                  maxLength: 6,
                  pattern: "[0-9]*",
                }}
                error={!!error}
              />
              {error && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  {error}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={loading || verificationCode.length !== 6}
              >
                {loading ? "Verifying..." : "Verify Phone Number"}
              </MDButton>
            </MDBox>
            <MDBox mt={2} mb={1} textAlign="center">
              <MDButton
                variant="text"
                color="info"
                onClick={handleResendCode}
                disabled={loading || countdown > 0}
              >
                {countdown > 0
                  ? `Resend code in ${countdown}s`
                  : "Resend verification code"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default VerifyPhone; 