import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2", dark: "#1565c0", light: "#42a5f5" },
    secondary: { main: "#fbc02d" },
    background: { default: "#f5f7fa", paper: "#ffffff" },
    text: { primary: "#1a1a2e", secondary: "#6b7280" },
    error: { main: "#e53935" },
    success: { main: "#43a047" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
    h3: { fontWeight: 800 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600, textTransform: "none" },
        containedPrimary: {
          boxShadow: "0 2px 8px rgba(25,118,210,0.25)",
          "&:hover": { boxShadow: "0 4px 14px rgba(25,118,210,0.35)" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #e8ecf0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiListItemButton: {
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 500 } },
    },
  },
});

export default theme;
