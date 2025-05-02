import { Typography, Box, useTheme, Button, Breadcrumbs } from "@mui/material";
import { tokens } from "../styles/theme";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Header = ({ title, subtitle, action, actionText, actionIcon, onAction }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(path => path);
    
    return [
      { name: 'Home', path: '/Dashboard' },
      ...paths.map((path, index) => {
        const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);
        const to = `/${paths.slice(0, index + 1).join('/')}`;
        return { name: formattedPath, path: to };
      })
    ];
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        {breadcrumbs.map((crumb, index) => (
          <Link 
            key={index}
            to={crumb.path}
            style={{ 
              textDecoration: 'none',
              color: index === breadcrumbs.length - 1 ? colors.primary[500] : colors.grey[500],
              fontWeight: index === breadcrumbs.length - 1 ? 'bold' : 'normal',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {index === 0 && <HomeOutlinedIcon sx={{ mr: 0.5, fontSize: 18 }} />}
            {crumb.name}
          </Link>
        ))}
      </Breadcrumbs>

      {/* Header content */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        mb={2}
      >
        <Box>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h2"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ mb: "5px" }}
            >
              {title}
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography 
              variant="h5" 
              color={theme.palette.mode === "dark" ? colors.primary[400] : colors.primary[500]}
            >
              {subtitle}
            </Typography>
          </motion.div>
        </Box>
        
        {action && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Button
              variant="contained"
              startIcon={actionIcon}
              onClick={onAction}
              sx={{
                backgroundColor: colors.primary[500],
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "8px",
                padding: "8px 16px",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 10px rgba(237, 28, 36, 0.3)",
                "&:hover": {
                  backgroundColor: colors.primary[600],
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 15px rgba(237, 28, 36, 0.4)",
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0 2px 5px rgba(237, 28, 36, 0.3)",
                },
              }}
            >
              {actionText}
            </Button>
          </motion.div>
        )}
      </Box>
      
      {/* Divider */}
      <Box 
        sx={{ 
          height: "4px", 
          width: "60px", 
          backgroundColor: colors.primary[500],
          borderRadius: "2px",
          mb: 3,
        }} 
      />
    </Box>
  );
};

export default Header;