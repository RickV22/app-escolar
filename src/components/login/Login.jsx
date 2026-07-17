import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Divider,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";

const DEMO_USERS = [
  {
    label: "Carlos Pérez",
    sublabel: "Padre de familia",
    email: "carlos@escuela.edu",
    role: "parent",
    initials: "CP",
    color: "#1976d2",
  },
  {
    label: "Laura Gómez",
    sublabel: "Padre de familia",
    email: "laura@escuela.edu",
    role: "parent",
    initials: "LG",
    color: "#1976d2",
  },
  {
    label: "Prof. García",
    sublabel: "Maestro",
    email: "garcia@escuela.edu",
    role: "teacher",
    initials: "PG",
    color: "#388e3c",
  },
  {
    label: "Prof. Martínez",
    sublabel: "Maestro",
    email: "martinez@escuela.edu",
    role: "teacher",
    initials: "PM",
    color: "#388e3c",
  },
];

const FEATURES = [
  "Comunicación directa maestros ↔ padres",
  "Calendario de eventos y reuniones",
  "Gestión de documentos escolares",
  "Mensajería grupal por curso",
];

export default function Login({ onLogin }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(null);

  const handleDemoSelect = (user) => {
    setSelectedDemo(user);
    setEmail(user.email);
    setPassword("demo1234");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) onLogin();
  };

  const formPanel = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        p: { xs: 3, sm: 8, md: 8 },
        backgroundColor: "#fff",
        overflowY: "auto",
        flexBasis: { md: "45%" },
        flexShrink: 0,
        minHeight: { xs: "100vh", md: "auto" },
        paddingTop: { md: 20 },
        padding: {  md: 4 },
        paddingLeft: { md: 2 },
        paddingRight: { md: 2},
      }}
    >
      {/* Logo móvil */}
      {isMobile && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              background: "linear-gradient(135deg, #1565c0, #1976d2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SchoolIcon sx={{ color: "#fbc02d", fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              App Escolar
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Solo muestra de diseño
            </Typography>
          </Box>
        </Box>
      )}

      <Typography
        variant="h4"
        fontWeight={800}
        sx={{
          mb: 0.75,
          lineHeight: 1.2,
          fontSize: { xs: "1.75rem", md: "2rem" },
        }}
      >
        Bienvenido de nuevo
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5 }}>
        Ingresa tus credenciales para acceder a la plataforma.
      </Typography>

      {/* Acceso rápido demo */}
      <Typography
        variant="caption"
        fontWeight={700}
        color="text.secondary"
        sx={{
          letterSpacing: 0.8,
          textTransform: "uppercase",
          display: "block",
          mb: 1.25,
        }}
      >
        Acceso rápido · demo
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 3 }}>
        {DEMO_USERS.map((u) => {
          const isSelected = selectedDemo?.email === u.email;
          return (
            <Box
              key={u.email}
              onClick={() => handleDemoSelect(u)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleDemoSelect(u)}
              aria-pressed={isSelected}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.25,
                py: 0.65,
                borderRadius: 10,
                border: "1.5px solid",
                borderColor: isSelected ? u.color : "#e0e0e0",
                backgroundColor: isSelected ? `${u.color}12` : "#fafafa",
                cursor: "pointer",
                transition: "all 0.15s",
                "&:hover": {
                  borderColor: u.color,
                  backgroundColor: `${u.color}08`,
                },
                "&:focus-visible": {
                  outline: `2px solid ${u.color}`,
                  outlineOffset: 2,
                },
              }}
            >
              <Avatar
                sx={{
                  width: 22,
                  height: 22,
                  fontSize: 10,
                  fontWeight: 700,
                  bgcolor: u.color,
                }}
              >
                {u.initials}
              </Avatar>
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={isSelected ? 700 : 500}
                  sx={{
                    color: isSelected ? u.color : "text.primary",
                    lineHeight: 1,
                    display: "block",
                  }}
                >
                  {u.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.disabled",
                    fontSize: "0.65rem",
                    lineHeight: 1,
                  }}
                >
                  {u.sublabel}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ mb: 3 }}>
        <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
          o ingresa manualmente
        </Typography>
      </Divider>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        <TextField
          fullWidth
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: "text.disabled", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
        <TextField
          fullWidth
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: "text.disabled", fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((p) => !p)}
                  edge="end"
                  size="small"
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showPassword ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1 }}>
          <Typography
            variant="caption"
            sx={{
              color: "primary.main",
              cursor: "pointer",
              fontWeight: 600,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            ¿Olvidaste tu contraseña?
          </Typography>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={!email.trim()}
          sx={{
            borderRadius: 2,
            py: 1.5,
            fontWeight: 700,
            fontSize: "1rem",
            background: "linear-gradient(135deg, #1565c0, #1976d2)",
            boxShadow: "0 4px 16px rgba(25,118,210,0.35)",
            "&:hover": {
              background: "linear-gradient(135deg, #1565c0, #1565c0)",
              boxShadow: "0 6px 20px rgba(25,118,210,0.45)",
            },
            "&.Mui-disabled": { background: "#e0e0e0", boxShadow: "none" },
          }}
        >
          Iniciar sesión
        </Button>
      </Box>

      <Box sx={{ mt: "auto", pt: 4 }}>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ display: "block", textAlign: "center" }}
        >
          App Escolar · Solo muestra de diseño · v1.0
        </Typography>
      </Box>
    </Box>
  );

  if (isMobile) return formPanel;

  return (
    <Box
      sx={{ minHeight: "100vh", display: "flex", backgroundColor: "#f0f4f8" }}
    >
      {/* Panel izquierdo - branding */}
      <Box
        sx={{
          flexBasis: "55%",
          flexShrink: 0,
          background:
            "linear-gradient(145deg, #1565c0 0%, #1976d2 55%, #1e88e5 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: { md: 6, lg: 8 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Círculos decorativos */}
        <Box
          sx={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 340,
            height: 340,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -130,
            left: -70,
            width: 420,
            height: 420,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.04)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "38%",
            right: "12%",
            width: 150,
            height: 150,
            borderRadius: "50%",
            backgroundColor: "rgba(251,192,45,0.12)",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 6 }}>
            <Box
              sx={{
                width: 58,
                height: 58,
                borderRadius: 3,
                backgroundColor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SchoolIcon sx={{ color: "#fbc02d", fontSize: 30 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
                color="#fff"
                sx={{ lineHeight: 1.1 }}
              >
                App Escolar
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.65)" }}
              >
                Plataforma de gestión escolar
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="h3"
            fontWeight={800}
            color="#fff"
            sx={{
              lineHeight: 1.15,
              mb: 2,
              maxWidth: 480,
              fontSize: { md: "2.25rem", lg: "2.75rem" },
            }}
          >
            Conecta la comunidad escolar
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255,255,255,0.8)",
              mb: 5,
              maxWidth: 420,
              lineHeight: 1.75,
            }}
          >
            Una plataforma moderna para mantener a padres y maestros
            comunicados, organizados y conectados.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {FEATURES.map((f, i) => (
              <Box
                key={i}
                sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
              >
                <CheckCircleOutlineIcon
                  sx={{ color: "#fbc02d", fontSize: 20, flexShrink: 0 }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}
                >
                  {f}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 6, display: "flex", gap: 1 }}>
            <Chip
              label="Demo"
              size="small"
              sx={{
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "#fff",
                fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            />
            <Chip
              label="v1.0"
              size="small"
              sx={{
                backgroundColor: "rgba(251,192,45,0.2)",
                color: "#fbc02d",
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Panel derecho - formulario */}
      {formPanel}
    </Box>
  );
}
