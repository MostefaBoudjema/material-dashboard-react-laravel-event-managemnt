/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import App from "App";
import { AuthContextProvider } from "context";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_mXfJqtZTInlsrn7rwJpoowaY00314kXwId');

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <MaterialUIControllerProvider>
          <Elements stripe={stripePromise}>
            <App />
          </Elements>
        </MaterialUIControllerProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
