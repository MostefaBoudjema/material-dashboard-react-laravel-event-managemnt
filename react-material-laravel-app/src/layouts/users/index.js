import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert, Snackbar } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import usersTableData from "layouts/users/data/usersTableData";
import UserService from "services/user-service";
import { useNavigate } from "react-router-dom";


function Users() {
  const token=localStorage.getItem('token');
  const [users, setUsers]=useState([]);
  const [openDialog, setOpenDialog]=useState(false);
  const [currentUser, setCurrentUser]=useState(null);
  const [errorMessage, setErrorMessage]=useState("");
  const [successMessage, setSuccessMessage]=useState("");
  const [formData, setFormData]=useState({
    name: ""
  });
  const navigate=useNavigate();

  useEffect(() => {
    const fetchUsers=async () => {
      try {
        const data=await UserService.getUsers(token);
        setUsers(data);
      } catch (error) {
        setErrorMessage("Failed to fetch users.");
        console.error(error.message);
        setTimeout(() => setErrorMessage(""), 5000);
      }
    };
    fetchUsers();
  }, [token]);

  const handleOpenDialog=async (user=null) => {
    try {
      if (user) {
        const data=await UserService.showUser(token, user.id);
        setCurrentUser(user);
        setFormData(data);
      } else {
        setCurrentUser(null);
        setFormData({ name: "", email: "" });
      }
      setErrorMessage("");
      setOpenDialog(true);
    } catch (error) {
      setErrorMessage("Failed to load user details.");
      console.error(error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleCloseDialog=() => setOpenDialog(false);

  const handleFormSubmit=async () => {
    try {
      if (currentUser) {
        await UserService.updateUser(token, currentUser.id, formData);
        setSuccessMessage("User updated successfully!");
      } else {
        await UserService.createUser(token, formData);
        setSuccessMessage("User created successfully!");
      }
      setTimeout(() => setSuccessMessage(""), 3000);
      const updatedUsers=await UserService.getUsers(token);
      setUsers(updatedUsers);
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
      await UserService.deleteUser(token, e.id);
      setUsers(users.filter(user => user.id!==e.id));
      setSuccessMessage("User deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to delete user.");
      console.error(error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };
  const { columns, rows }=usersTableData(users, handleOpenDialog, handleDelete);

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
                  <MDTypography variant="h6" color="white">Users Table</MDTypography>
                  <Button variant="contained" color="white" onClick={() => handleOpenDialog(null)}>
                    New User
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
        <DialogTitle>{currentUser? "Edit User":"Create User"}</DialogTitle>
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

export default Users;
