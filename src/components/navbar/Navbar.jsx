import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Button,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "../../context/UserContext";
import { teachers, parents } from "../../data/mockData";

const roleConfig = {
  parent: { label: "Padre", icon: PersonIcon, list: parents },
  teacher: { label: "Maestro", icon: SupervisorAccountIcon, list: teachers },
};

function Navbar({ onMenuClick, onLogout }) {
  const { role, setRole, currentUserId, switchUser, currentUser } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelectRole = (newRole) => setRole(newRole);
  const handleSelectUser = (id) => {
    switchUser(id);
    handleClose();
  };

  const CurrentRoleIcon = roleConfig[role].icon;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: "linear-gradient(90deg, #1976d2 0%, #1565c0 100%)",
        borderBottom: "3px solid #fbc02d",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: { xs: "60px", md: "68px" },
          px: { xs: 1.5, sm: 2 },
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isMobile && (
            <IconButton
              onClick={onMenuClick}
              sx={{ color: "#fff" }}
              aria-label="Abrir menú de navegación"
              aria-expanded={undefined}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Avatar
            sx={{ bgcolor: "rgba(255,255,255,0.15)", width: 36, height: 36 }}
          >
            <SchoolIcon sx={{ color: "#fbc02d", fontSize: 20 }} />
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                lineHeight: 1.1,
                fontSize: { xs: "0.95rem", sm: "1.25rem" },
              }}
            >
              App Escolar
            </Typography>
            {!isMobile && (
              <Typography
                variant="caption"
                sx={{ opacity: 0.85, letterSpacing: 0.5 }}
              >
                Comunicación y gestión escolar
              </Typography>
            )}
          </Box>
        </Box>

        {/* Selector de usuario */}
        <Button
          onClick={handleOpen}
          endIcon={!isMobile ? <KeyboardArrowDownIcon /> : null}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={`Usuario: ${currentUser?.name ?? ""}, Rol: ${roleConfig[role].label}. Cambiar usuario`}
          sx={{
            color: "#fff",
            textTransform: "none",
            backgroundColor: "rgba(255,255,255,0.12)",
            borderRadius: 5,
            px: { xs: 1.2, sm: 2 },
            py: 0.6,
            minWidth: 0,
            "&:hover": { backgroundColor: "rgba(255,255,255,0.22)" },
          }}
        >
          {/* En mobile: solo avatar con inicial */}
          {isMobile ? (
            <Avatar
              sx={{
                width: 28,
                height: 28,
                fontSize: 13,
                bgcolor: "#fbc02d",
                color: "#1565c0",
              }}
            >
              {currentUser?.name?.charAt(0)}
            </Avatar>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CurrentRoleIcon sx={{ fontSize: 20 }} />
              <Box sx={{ textAlign: "left" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, lineHeight: 1.1 }}
                >
                  {currentUser?.name}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.85 }}>
                  {roleConfig[role].label}
                </Typography>
              </Box>
            </Box>
          )}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{ sx: { mt: 1, borderRadius: 2, minWidth: 220 } }}
        >
          {/* Nombre del usuario en mobile */}
          {isMobile && (
            <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #eee" }}>
              <Typography fontWeight={700}>{currentUser?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {roleConfig[role].label}
              </Typography>
            </Box>
          )}

          {Object.entries(roleConfig).map(([key, { label, icon: Icon }]) => (
            <MenuItem
              key={key}
              selected={key === role}
              onClick={() => handleSelectRole(key)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#e3f2fd",
                  fontWeight: 600,
                },
              }}
            >
              <ListItemIcon>
                <Icon
                  color={key === role ? "primary" : "inherit"}
                  fontSize="small"
                />
              </ListItemIcon>
              Soy {label}
            </MenuItem>
          ))}

          <Divider sx={{ my: 0.5 }} />

          <Typography variant="caption" sx={{ px: 2, color: "text.secondary" }}>
            Iniciar sesión como
          </Typography>

          {roleConfig[role].list.map((user) => (
            <MenuItem
              key={user.id}
              selected={user.id === currentUserId}
              onClick={() => handleSelectUser(user.id)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#e3f2fd",
                  fontWeight: 600,
                },
              }}
            >
              <ListItemIcon>
                <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                  {user.name.charAt(0)}
                </Avatar>
              </ListItemIcon>
              {user.name}
            </MenuItem>
          ))}

          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            onClick={() => {
              handleClose();
              onLogout?.();
            }}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
