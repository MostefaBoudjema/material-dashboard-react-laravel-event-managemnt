import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert, Snackbar } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import rolesTableData from "layouts/roles/data/rolesTableData";
import RoleService from "services/role-service";
import { useNavigate } from "react-router-dom";


function Roles() {
  const token=localStorage.getItem('token');
  const [roles, setRoles]=useState([]);
  const [openDialog, setOpenDialog]=useState(false);
  const [currentRole, setCurrentRole]=useState(null);
  const [errorMessage, setErrorMessage]=useState("");
  const [successMessage, setSuccessMessage]=useState("");
  const [formData, setFormData]=useState({
    name: ""
  });
  const navigate=useNavigate();

  useEffect(() => {
    const fetchRoles=async () => {
      try {
        const data=await RoleService.getRoles(token);
        setRoles(data);
      } catch (error) {
        setErrorMessage("Failed to fetch roles.");
        console.error(error.message);
        setTimeout(() => setErrorMessage(""), 5000);
      }
    };
    fetchRoles();
  }, [token]);

  const handleOpenDialog=async (role=null) => {
    try {
      if (role) {
        const data=await RoleService.showRole(token, role.id);
        setCurrentRole(role);
        setFormData(data);
      } else {
        setCurrentRole(null);
        setFormData({ name: "" });
      }
      setErrorMessage("");
      setOpenDialog(true);
    } catch (error) {
      setErrorMessage("Failed to load role details.");
      console.error(error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleCloseDialog=() => setOpenDialog(false);

  const handleFormSubmit=async () => {
    try {
      if (currentRole) {
        await RoleService.updateRole(token, currentRole.id, formData);
        setSuccessMessage("Role updated successfully!");
      } else {
        await RoleService.createRole(token, formData);
        setSuccessMessage("Role created successfully!");
      }
      setTimeout(() => setSuccessMessage(""), 3000);
      const updatedRoles=await RoleService.getRoles(token);
      setRoles(updatedRoles);
      handleCloseDialog();
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
      console.error(error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleDelete=async (e) => {
    try {
      await RoleService.deleteRole(token, e.id);
      setRoles(roles.filter(role => role.id!==e.id));
      setSuccessMessage("Role deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to delete role.");
      console.error(error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };
  const { columns, rows }=rolesTableData(roles, handleOpenDialog, handleDelete);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
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
                <Grid container justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">Roles Table</MDTypography>
                  <Button variant="contained" color="white" onClick={() => handleOpenDialog(null)}>
                    New Role
                  </Button>
                </Grid>
              </MDBox>

              <MDBox pt={3}>
                {errorMessage&&<Alert severity="error">{errorMessage}</Alert>}
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
        <DialogTitle>{currentRole? "Edit Role":"Create Role"}</DialogTitle>
        <DialogContent>
          {errorMessage&&<Alert severity="error">{errorMessage}</Alert>}
          {Object.keys(formData)
            .filter((key) => !["id", "email_verified_at", "created_at", "updated_at"].includes(key))
            .map((key) => (
              <TextField
                key={key}
                fullWidth
                label={key.replace("_", " ")}
                value={formData[key]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                margin="normal"
              />
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

export default Roles;
