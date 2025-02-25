import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import { Box, Divider } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
export default function eventsTableData(events, handleOpenDialog, handleDelete, handleJoin, handleCancel) {
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
      { Header: "participating", accessor: "is_participating", align: "center" },
      { Header: "date", accessor: "date", align: "left" },
      { Header: "duration", accessor: "duration", align: "center" },
      { Header: "location", accessor: "location", align: "center" },
      { Header: "participants", accessor: "participants_count", align: "center" },
      { Header: "capacity", accessor: "capacity", align: "center" },
      { Header: "waitlist", accessor: "waitlist_capacity", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: events.map((event) => ({
      name: <Job title={event.name} />,
      date: <MDTypography variant="caption" color="text" fontWeight="medium">{event.date_time}</MDTypography>,
      duration: <Job title={event.duration} />,
      location: <Job title={event.location} />,
      participants_count: <Job title={event.participants_count} />,
      capacity: <Job title={event.capacity} />,
      waitlist_capacity: <Job title={event.waitlist_capacity} />,
      status: (
        <MDBox ml={-1}>
          <MDBadge badgeContent={event.status==='published'? 'live':'draft'} color={event.status==='published'? 'success':'secondary'} variant="gradient" size="sm" />
        </MDBox>
      ),
      action: (
        <MDBox
          display="flex"
          alignItems="center"
          justifyContent="end"
          minWidth="120px" // Ensures consistent width
        >
          {!event.is_past&&event.is_participating&&(
            <>
              <Box
                sx={{
                  backgroundColor: 'lightcoral',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => handleCancel(event.id)}
              >
                <MDTypography variant="caption" fontWeight="medium">
                  Cancel
                </MDTypography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            </>
          )}
          {!event.is_past&&!event.is_participating&&(
            <>
              <Box
                sx={{
                  backgroundColor: 'lightgreen',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => handleJoin(event.id)}
              >
                <MDTypography variant="caption" fontWeight="medium">
                  Join
                </MDTypography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            </>
          )}


          {event.is_admin&&( // Only show if user is admin
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
                onClick={() => handleOpenDialog(event)}
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
                onClick={() => handleDelete(event)}
              >
                <DeleteIcon sx={{ fontSize: 18 }} />
              </Box>
            </>
          )}
        </MDBox>
      ),



      is_participating: event.is_participating? (
        <MDBadge badgeContent="Yes" color="success" variant="gradient" size="sm" />
      ):(
        <MDBadge badgeContent="No" color="error" variant="gradient" size="sm" />
      ),
      styles: {
        backgroundColor: event.is_participating? 'rgba(76, 175, 80, 0.2)':'inherit',
      },
    })),

  };
}
