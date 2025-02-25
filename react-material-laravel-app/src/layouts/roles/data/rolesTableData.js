import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import { Box, Divider } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
export default function rolesTableData(roles, handleOpenDialog, handleDelete, handleJoin, handleCancel) {
  const Job=({ title }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "name", accessor: "name", width: "45%", align: "left" },
      { Header: "action", accessor: "action", align: "right" },
    ],
    rows: roles.map((role) => ({
      name: <Job title={role.name} />,
      action: (
        <MDBox
          display="flex"
          alignItems="center"
          justifyContent="end"
          minWidth="120px" // Ensures consistent width
        >
          <>
            <Box
              sx={{
                backgroundColor: 'orange',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                cursor: 'pointer',
              }}
              onClick={() => handleOpenDialog(role)}
            >
              <EditIcon sx={{ fontSize: 18 }} />
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <Box
              sx={{
                backgroundColor: 'red',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                cursor: 'pointer',
              }}
              onClick={() => handleDelete(role)}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </Box>
          </>

        </MDBox>
      ),

    })),

  };
}
