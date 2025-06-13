import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import { Box, Divider } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function paymentsTableData(payments, handleOpenDialog, handleDelete) {
  const Job = ({ title }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "amount", accessor: "amount", width: "15%", align: "left" },
      { Header: "currency", accessor: "currency", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "payment_method", accessor: "payment_method", align: "center" },
      { Header: "created_at", accessor: "created_at", align: "center" },
    ],
    rows: payments.map((payment) => ({
      amount: <Job title={`${payment.amount / 100} ${payment.currency.toUpperCase()}`} />,
      currency: <Job title={payment.currency.toUpperCase()} />,
      status: (
        <MDBox ml={-1}>
          <MDBadge 
            badgeContent={payment.status} 
            color={payment.status === 'succeeded' ? 'success' : payment.status === 'pending' ? 'warning' : 'error'} 
            variant="gradient" 
            size="sm" 
          />
        </MDBox>
      ),
      payment_method: <Job title={payment.payment_method_details?.type || 'N/A'} />,
      created_at: <MDTypography variant="caption" color="text" fontWeight="medium">
        {new Date(payment.created * 1000).toLocaleString()}
      </MDTypography>,
    })),
  };
} 