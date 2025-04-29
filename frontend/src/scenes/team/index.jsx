"use client"

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
} from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { tokens } from "../../styles/theme"
import { mockDataTeam } from "../../Data/mockData"
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined"
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined"
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined"
import Header from "../../components/Header"
import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import AddIcon from "@mui/icons-material/Add"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import { useState } from "react"

const Team = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [searchText, setSearchText] = useState("")
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true)
    handleMenuClose()
  }

  const handleDeleteConfirm = () => {
    // Delete logic would go here
    console.log("Deleting user:", selectedUser)
    setOpenDeleteDialog(false)
  }

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false)
  }

  const filteredData = mockDataTeam.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()),
  )

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      headerAlign: "left",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <Avatar
            src={`/assets/user.png`}
            sx={{
              width: 32,
              height: 32,
              mr: 1,
              border: `2px solid ${
                row.access === "admin"
                  ? colors.greenAccent[500]
                  : row.access === "manager"
                    ? colors.blueAccent[500]
                    : colors.redAccent[500]
              }`,
            }}
          />
          <Typography color={colors.grey[100]} fontWeight="500">
            {row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
      renderCell: ({ row }) => <Typography color={colors.grey[300]}>{row.phone}</Typography>,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderCell: ({ row }) => <Typography color={colors.grey[300]}>{row.email}</Typography>,
    },
    {
      field: "access",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Chip
            icon={
              access === "admin" ? (
                <AdminPanelSettingsOutlinedIcon fontSize="small" />
              ) : access === "manager" ? (
                <SecurityOutlinedIcon fontSize="small" />
              ) : (
                <LockOpenOutlinedIcon fontSize="small" />
              )
            }
            label={access}
            size="small"
            sx={{
              backgroundColor:
                access === "admin"
                  ? colors.greenAccent[900]
                  : access === "manager"
                    ? colors.blueAccent[900]
                    : colors.redAccent[900],
              color:
                access === "admin"
                  ? colors.greenAccent[500]
                  : access === "manager"
                    ? colors.blueAccent[500]
                    : colors.redAccent[500],
              borderRadius: "4px",
              fontWeight: "bold",
              "& .MuiChip-icon": {
                color:
                  access === "admin"
                    ? colors.greenAccent[500]
                    : access === "manager"
                      ? colors.blueAccent[500]
                      : colors.redAccent[500],
              },
            }}
          />
        )
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: ({ row }) => (
        <Box>
          <IconButton onClick={(e) => handleMenuClick(e, row)} sx={{ color: colors.grey[300] }}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="TEAM" subtitle="Managing the Team Members" />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: colors.redAccent[500],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: colors.redAccent[400],
            },
          }}
        >
          Add New Member
        </Button>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        mb={2}
        bgcolor={colors.primary[400]}
        borderRadius="8px"
        boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
      >
        <TextField
          variant="outlined"
          placeholder="Search by name or email..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{
            width: "300px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": {
                borderColor: colors.grey[800],
              },
              "&:hover fieldset": {
                borderColor: colors.grey[700],
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.redAccent[500],
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colors.grey[400] }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          sx={{
            borderColor: colors.grey[700],
            color: colors.grey[100],
            "&:hover": {
              borderColor: colors.grey[600],
              backgroundColor: "transparent",
            },
          }}
        >
          Filter
        </Button>
      </Box>

      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${colors.grey[800]}`,
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.primary[500],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.primary[500],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={filteredData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          disableSelectionOnClick
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Box>

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
        <MenuItem onClick={handleMenuClose}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: colors.redAccent[500] }}>
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

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
            Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{
              color: colors.grey[300],
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
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
    </Box>
  )
}

export default Team
