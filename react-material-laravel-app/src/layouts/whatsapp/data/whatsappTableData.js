import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

export default function whatsappTableData(whatsapp, handleOpenDialog, handleDelete) {
  const Job = ({ title }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "from", accessor: "from", align: "left" },
      { Header: "to", accessor: "to", width: "15%", align: "center" },
      { Header: "Message", accessor: "body", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "error message", accessor: "error", align: "center" },
      { Header: "created_at", accessor: "created_at", align: "center" },
    ],
    rows: whatsapp.map((message) => ({
      from: <Job title={message.from} />,
      to: <Job title={message.to} />,
      body: <Job title={message.body} />,
      status: (
        <MDBox ml={-1}>
          <MDBadge 
            badgeContent={message.status} 
            color={message.status === 'sent' ? 'success' : 'error'} 
            variant="gradient" 
            size="sm" 
          />
        </MDBox>
      ),
      
      error: <Job title={message.error_message ? JSON.parse(message.error_message).message : ''} />,
      created_at: <MDTypography variant="caption" color="text" fontWeight="medium">
        {new Date(message.created_at).toLocaleString()}
      </MDTypography>,
      
    })),
  };
} 