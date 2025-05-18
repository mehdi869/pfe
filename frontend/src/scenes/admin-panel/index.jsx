import {
  Box,
  Typography,
  useTheme,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../styles/theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person"; // Import a default user icon
import { useState, useEffect, useContext } from "react";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../API/api";
import { AuthContext } from "../../context/AuthContext"; // adjust path as needed

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authContext = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editForm, setEditForm] = useState({ username: "", email: "", user_type: "agent" });
  const [addForm, setAddForm] = useState({ username: "", email: "", password: "", user_type: "agent" });
  const [loading, setLoading] = useState(false);

  // Fetch users
  const loadUsers = async (search = "") => {
    setLoading(true);
    try {
      const data = await fetchUsers(authContext, search);
      setUsers(data);
    } catch (e) {
      // handle error (show toast/snackbar)
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line
  }, []);

  // Search effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadUsers(searchText);
    }, 400);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line
  }, [searchText]);

  // Menu actions
  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Delete
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    await deleteUser(authContext, selectedUser.id);
    setOpenDeleteDialog(false);
    setSelectedUser(null);
    loadUsers(searchText);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  // Edit
  const handleEditClick = () => {
    setEditForm({
      username: selectedUser.username,
      email: selectedUser.email,
      user_type: selectedUser.user_type,
    });
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    await updateUser(authContext, selectedUser.id, editForm);
    setOpenEditDialog(false);
    setSelectedUser(null);
    loadUsers(searchText);
  };

  // Add
  const handleAddClick = () => {
    setAddForm({ username: "", email: "", password: "", user_type: "agent" });
    setOpenAddDialog(true);
  };

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async () => {
    await createUser(authContext, addForm);
    setOpenAddDialog(false);
    loadUsers(searchText);
  };

  // Table columns
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5, headerAlign: "left" },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              mr: 1,
              border: `2px solid ${
                row.user_type === "admin"
                  ? colors.blueAccent[400] // Admin color
                  : colors.redAccent[300]   // Agent color
              }`,
              backgroundColor: // Optional: if you want a background color for the icon Avatar
                row.user_type === "admin"
                  ? colors.blueAccent[900]
                  : colors.redAccent[800],
              color: colors.grey[100] // Icon color
            }}
          >
            <PersonIcon fontSize="small" />
          </Avatar>
          <Typography color={colors.grey[100]} fontWeight="500">
            {row.username}
          </Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderCell: ({ row }) => (
        <Typography color={colors.grey[300]}>{row.email}</Typography>
      ),
    },
    {
      field: "user_type",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row }) => (
        <Chip
          icon={
            row.user_type === "admin" ? (
              <AdminPanelSettingsOutlinedIcon fontSize="small" />
            ) : (
              <LockOpenOutlinedIcon fontSize="small" />
            )
          }
          label={row.user_type.charAt(0).toUpperCase() + row.user_type.slice(1)} // Capitalize
          size="small"
          sx={{
            backgroundColor:
              row.user_type === "admin"
                ? colors.blueAccent[900]  // Admin background
                : colors.redAccent[800],   // Agent background
            color:
              row.user_type === "admin"
                ? colors.blueAccent[400]  // Admin text/icon
                : colors.redAccent[300],   // Agent text/icon
            borderRadius: "4px",
            fontWeight: "bold",
            "& .MuiChip-icon": {
              color:
                row.user_type === "admin"
                  ? colors.blueAccent[400]
                  : colors.redAccent[300],
            },
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      filterable: false, // <-- Add this line
      renderCell: ({ row }) => (
        <Box>
          <IconButton
            onClick={(e) => handleMenuClick(e, row)}
            sx={{ color: colors.grey[300] }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box // Root container for the Admin page
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%', // Take full height available from parent (Outlet)
        p: '20px',
        boxSizing: 'border-box', // Padding included in height calculation
        overflow: 'hidden', // Prevent this Box from scrolling
      }}
    >
      {/* Header and Add Button Row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexShrink={0}>
        <Header title="TEAM" subtitle="Managing the Team Members" />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{
            backgroundColor: colors.primary[500], // Use primary red from theme
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: colors.primary[600], // Darker shade from theme
            },
          }}
        >
          Add New Member
        </Button>
      </Box>

      {/* Search Bar Row */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        mb={2}
        bgcolor={colors.primary[400]} // Consistent with DataGrid background
        borderRadius="8px"
        boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
        flexShrink={0}
      >
        <TextField
          variant="outlined"
          placeholder="Search by username or email..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ width: "300px" /* Other styles inherited from theme */ }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colors.grey[400] }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* DataGrid Container - Takes remaining space and handles its own scroll */}
      <Box
        sx={{
          flexGrow: 1, // Allow this box to grow and fill available vertical space
          minHeight: 0, // Important for flex children to shrink correctly and allow internal scrolling
          '& .MuiDataGrid-root': {
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            backgroundColor: colors.primary[400], // Ensure this matches overall theme
            height: '100%', // Make DataGrid fill this container
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${colors.grey[800]}`,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.primary[500], // Darker header
            borderBottom: 'none',
            color: colors.grey[100],
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          disableSelectionOnClick
          loading={loading}
          getRowId={(row) => row.id}
          hideFooter={true} // Keeps pagination hidden
          // No explicit height on DataGrid, it will fill its parent Box
        />
      </Box>

      {/* Actions Menu, Delete Dialog, Edit Dialog, Add Dialog remain the same */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            borderRadius: "8px",
            minWidth: "150px",
          },
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: colors.redAccent[500] }}>
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            backgroundColor: colors.primary[400],
          },
        }}
      >
        <DialogTitle sx={{ color: colors.grey[100] }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1" color={colors.grey[300]}>
            Are you sure you want to delete {selectedUser?.username}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleDeleteCancel} sx={{ color: colors.grey[300] }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              backgroundColor: colors.redAccent[500],
              color: colors.grey[100],
              "&:hover": {
                backgroundColor: colors.redAccent[400],
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            backgroundColor: colors.primary[400],
          },
        }}
      >
        <DialogTitle sx={{ color: colors.grey[100] }}>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Username"
            name="username"
            value={editForm.username}
            onChange={handleEditChange}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={editForm.email}
            onChange={handleEditChange}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>User Type</InputLabel>
            <Select
              name="user_type"
              value={editForm.user_type}
              label="User Type"
              onChange={handleEditChange}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="agent">Agent</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} sx={{ color: colors.grey[300] }}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            sx={{
              backgroundColor: colors.greenAccent[500],
              color: colors.grey[100],
              "&:hover": {
                backgroundColor: colors.greenAccent[400],
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            backgroundColor: colors.primary[400],
          },
        }}
      >
        <DialogTitle sx={{ color: colors.grey[100] }}>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Username"
            name="username"
            value={addForm.username}
            onChange={handleAddChange}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={addForm.email}
            onChange={handleAddChange}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            value={addForm.password}
            onChange={handleAddChange}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>User Type</InputLabel>
            <Select
              name="user_type"
              value={addForm.user_type}
              label="User Type"
              onChange={handleAddChange}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="agent">Agent</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} sx={{ color: colors.grey[300] }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddSubmit}
            variant="contained"
            sx={{
              backgroundColor: colors.greenAccent[500],
              color: colors.grey[100],
              "&:hover": {
                backgroundColor: colors.greenAccent[400],
              },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Admin;
