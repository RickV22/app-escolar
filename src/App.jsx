import { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import BottomNav from "./components/bottomnav/BottomNav";
import Login from "./components/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Chat from "./components/chat/Chat";
import Calendar from "./pages/calendar/Calendar";
import Documents from "./pages/documents/Documents";

const DRAWER_WIDTH = 240;

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Navbar
        onMenuClick={() => setMobileOpen((p) => !p)}
        onLogout={() => setIsLoggedIn(false)}
      />

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isMobile={isMobile}
        drawerWidth={DRAWER_WIDTH}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: { xs: "80px", md: 0 },
          pt: { xs: "70px", md: "84px" },
          px: { xs: 2, sm: 3, md: 4 },
          ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <Box sx={{ maxWidth: 1280, mx: "auto" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/documents" element={<Documents />} />
          </Routes>
        </Box>
      </Box>

      {isMobile && <BottomNav />}
    </Box>
  );
}

export default App;
