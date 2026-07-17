import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Box,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FolderIcon from "@mui/icons-material/Folder";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useChat } from "../../context/ChatContext";
import { getCoursesForUser } from "../../data/mockData";

const navItems = [
  { label: "Dashboard", icon: DashboardIcon, to: "/" },
  { label: "Chat", icon: ChatIcon, to: "/chat" },
  { label: "Calendario", icon: CalendarTodayIcon, to: "/calendar" },
  { label: "Documentos", icon: FolderIcon, to: "/documents" },
];

function SidebarContent({ onClose }) {
  const { role, currentUserId, currentUser } = useUser();
  const { getUnreadCount } = useChat();

  const myCourses = getCoursesForUser(role, currentUserId);
  const totalUnread = myCourses.reduce(
    (sum, c) => sum + getUnreadCount(currentUserId, c.id),
    0,
  );

  const itemsWithBadge = navItems.map((item) => ({
    ...item,
    badge: item.to === "/chat" ? totalUnread : 0,
  }));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Perfil del usuario logueado */}
      <Box
        sx={{
          px: 2,
          py: 2.5,
          background: "linear-gradient(135deg, #1976d2, #1565c0)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Avatar
          sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 40, height: 40 }}
        >
          <SchoolIcon sx={{ color: "#fbc02d" }} />
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight={700} noWrap>
            {currentUser?.name}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            {role === "teacher" ? "Maestro" : "Padre de familia"}
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navegación */}
      <List sx={{ px: 1, py: 1.5, flexGrow: 1 }}>
        {itemsWithBadge.map(({ label, icon: Icon, to, badge }) => (
          <ListItemButton
            key={to}
            component={NavLink}
            to={to}
            end={to === "/"}
            onClick={onClose}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              borderLeft: "4px solid transparent",
              transition: "all 0.2s ease",
              "&.active": {
                backgroundColor: "#e3f2fd",
                borderLeft: "4px solid #1976d2",
                "& .MuiListItemIcon-root": { color: "#1976d2" },
                "& .MuiListItemText-primary": {
                  color: "#1976d2",
                  fontWeight: 600,
                },
              },
              "&:hover": { backgroundColor: "#f0f4f8" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Badge badgeContent={badge} color="error" invisible={badge === 0}>
                <Icon color="primary" />
              </Badge>
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>

      {/* Footer del sidebar */}
      <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
        <Typography variant="caption" color="text.secondary">
          App Escolar v1.0
        </Typography>
      </Box>
    </Box>
  );
}

function Sidebar({ mobileOpen, onClose, isMobile, drawerWidth }) {
  const drawerStyles = {
    width: drawerWidth,
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: {
      width: drawerWidth,
      boxSizing: "border-box",
      backgroundColor: "#ffffff",
      borderRight: "1px solid #e0e0e0",
      // En desktop dejamos espacio al Navbar con pt, en mobile no porque el header del sidebar lo reemplaza
      pt: isMobile ? 0 : "68px",
    },
  };

  // Mobile: Drawer temporal que se cierra al navegar o al hacer clic afuera
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        SlotProps={{ paper: { "aria-label": "Menú de navegación" } }}
        sx={drawerStyles}
      >
        <SidebarContent onClose={onClose} />
      </Drawer>
    );
  }

  // Desktop: Drawer permanente
  return (
    <Drawer
      variant="permanent"
      sx={drawerStyles}
      SlotProps={{ paper: { "aria-label": "Menú de navegación" } }}
    >
      <SidebarContent onClose={() => {}} />
    </Drawer>
  );
}

export default Sidebar;
