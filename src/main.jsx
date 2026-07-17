import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ChatProvider>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </ChatProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);