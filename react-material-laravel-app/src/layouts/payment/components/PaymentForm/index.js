import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MDInput from "components/MDInput";

const PaymentForm = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const amountOptions = [1, 2, 5, 10, 20, 50, 100];

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet.');
      setProcessing(false);
      return;
    }

    if (!amount || amount <= 0) {
      setError('Please select a valid amount');
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to make a payment');
        navigate('/auth/login');
        return;
      }

      // Call your Laravel backend to create a Payment Intent
      const response = await axios.post('/payments/intent', 
        {
          amount: Math.round(parseFloat(amount) ), // Convert to cents
          currency: 'usd',
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data || !response.data.clientSecret) {
        throw new Error('Invalid response from server');
      }

      const { clientSecret } = response.data;

      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setSnackbar({
          open: true,
          message: stripeError.message,
          severity: 'error'
        });
      } else if (paymentIntent.status === 'succeeded') {
        setSnackbar({
          open: true,
          message: 'Payment successful!',
          severity: 'success'
        });
        // Clear the form
        cardElement.clear();
        setAmount('');
        // Call the callback to refresh the payment list
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      if (err.response?.status === 401) {
        setError('Please login to make a payment');
        navigate('/auth/login');
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred while processing your payment';
        setError(errorMessage);
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      }
    }

    setProcessing(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <MDBox mb={3}>
          <MDBox mb={1}>
            <label style={{ fontSize: '14px', color: '#344767' }}>Select Amount (USD)</label>
          </MDBox>
          <MDBox display="flex" gap={1} flexWrap="wrap">
            {amountOptions.map((option) => (
              <MDButton
                key={option}
                variant={amount === option ? "contained" : "outlined"}
                color={amount === option ? "info" : "secondary"}
                onClick={() => setAmount(option)}
                sx={{
                  minWidth: '60px',
                  borderRadius: '20px',
                  textTransform: 'none',
                  boxShadow: amount === option ? '0 0 0 2px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                ${option}
              </MDButton>
            ))}
          </MDBox>
        </MDBox>
        <MDBox mb={3}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </MDBox>
        {error && (
          <MDBox mb={3}>
            <div style={{ color: 'red' }}>{error}</div>
          </MDBox>
        )}
        <MDButton
          type="submit"
          variant="gradient"
          color="info"
          fullWidth
          disabled={!stripe || processing}
        >
          {processing ? 'Processing...' : 'Pay'}
        </MDButton>
      </form>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={2000} 
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
    </>
  );
};

export default PaymentForm; 