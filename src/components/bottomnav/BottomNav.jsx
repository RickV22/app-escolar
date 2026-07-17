import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FolderIcon from "@mui/icons-material/Folder";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useChat } from "../../context/ChatContext";
import { getCoursesForUser } from "../../data/mockData";

const navItems = [
  { label: "Inicio", icon: DashboardIcon, to: "/" },
  { label: "Chat", icon: ChatIcon, to: "/chat" },
  { label: "Calendario", icon: CalendarTodayIcon, to: "/calendar" },
  { label: "Docs", icon: FolderIcon, to: "/documents" },
];

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, currentUserId } = useUser();
  const { getUnreadCount } = useChat();

  const myCourses = getCoursesForUser(role, currentUserId);
  const totalUnread = myCourses.reduce(
    (sum, c) => sum + getUnreadCount(currentUserId, c.id),
    0,
  );

  const currentValue =
    navItems.find((item) =>
      item.to === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(item.to),
    )?.to || "/";

  return (
    <Paper
      component="nav"
      aria-label="Navegación principal"
      elevation={8}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        display: { xs: "block", md: "none" },
        borderTop: "2px solid #fbc02d",
      }}
    >
      <BottomNavigation
        value={currentValue}
        onChange={(_, newValue) => navigate(newValue)}
        sx={{ backgroundColor: "#fff", height: 64 }}
      >
        {navItems.map(({ label, icon: Icon, to }) => {
          const isCurrent = currentValue === to;
          const chatLabel =
            to === "/chat" && totalUnread > 0
              ? `${label}, ${totalUnread} mensajes sin leer`
              : label;
          return (
            <BottomNavigationAction
              key={to}
              label={label}
              value={to}
              aria-label={chatLabel}
              aria-current={isCurrent ? "page" : undefined}
              icon={
                to === "/chat" ? (
                  <Badge
                    badgeContent={totalUnread}
                    color="error"
                    invisible={totalUnread === 0}
                    componentsProps={{ badge: { "aria-hidden": "true" } }}
                  >
                    <Icon aria-hidden="true" />
                  </Badge>
                ) : (
                  <Icon aria-hidden="true" />
                )
              }
              sx={{
                color: "text.secondary",
                "&.Mui-selected": { color: "primary.main" },
                minWidth: 0,
                fontSize: "0.7rem",
              }}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
