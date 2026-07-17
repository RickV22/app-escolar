import { Grid, Typography, Box, Chip, Avatar, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FolderIcon from "@mui/icons-material/Folder";
import GroupsIcon from "@mui/icons-material/Groups";
import { useUser } from "../../context/UserContext";
import { useChat } from "../../context/ChatContext";
import { getCoursesForUser, teachers, parents } from "../../data/mockData";

// Paleta de colores por curso (misma que chat)
const COURSE_COLORS = ["#1976d2", "#388e3c", "#f57c00", "#7b1fa2", "#c62828"];

const quickLinks = [
  {
    to: "/chat",
    icon: ChatIcon,
    label: "Mensajería",
    color: "#1976d2",
    teacherDesc: "Comunícate con padres y alumnos.",
    parentDesc: "Habla con los maestros de tus hijos.",
  },
  {
    to: "/calendar",
    icon: CalendarTodayIcon,
    label: "Calendario",
    color: "#388e3c",
    teacherDesc: "Organiza clases y reuniones.",
    parentDesc: "Consulta eventos escolares y reuniones.",
  },
  {
    to: "/documents",
    icon: FolderIcon,
    label: "Documentos",
    color: "#f57c00",
    teacherDesc: "Sube tareas y circulares.",
    parentDesc: "Accede a tareas y circulares.",
  },
];

function getUserName(id) {
  return (
    teachers.find((t) => t.id === id)?.name ||
    parents.find((p) => p.id === id)?.name ||
    "Alguien"
  );
}

function Dashboard() {
  const { role, currentUserId, currentUser } = useUser();
  const { getUnreadCount, getLastMessage } = useChat();

  const myCourses = getCoursesForUser(role, currentUserId);
  const totalUnread = myCourses.reduce(
    (sum, c) => sum + getUnreadCount(currentUserId, c.id),
    0,
  );

  return (
    <Box>
      {/* Encabezado de bienvenida */}
      <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ lineHeight: 1.2, fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
        >
          Hola, {currentUser?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {role === "teacher"
            ? "Bienvenido a tu panel de gestión escolar."
            : "Mantente al tanto del progreso escolar de tus hijos."}
        </Typography>
      </Box>

      {/* Tarjetas de estadísticas */}
      <Grid
        container
        spacing={{ xs: 1.5, sm: 2.5 }}
        sx={{ mb: { xs: 3, sm: 4 } }}
      >
        {[
          {
            label: "Mis cursos",
            value: myCourses.length,
            icon: GroupsIcon,
            color: "#1976d2",
            bg: "#e3f2fd",
            to: "/chat",
          },
          {
            label: "Sin leer",
            value: totalUnread,
            icon: ChatIcon,
            color: totalUnread > 0 ? "#e53935" : "#43a047",
            bg: totalUnread > 0 ? "#fde8e8" : "#e8f5e9",
            to: "/chat",
          },
          {
            label: "Eventos este mes",
            value: 4,
            icon: CalendarTodayIcon,
            color: "#f57c00",
            bg: "#fff3e0",
            to: "/calendar",
          },
          {
            label: "Documentos",
            value: myCourses.length * 2,
            icon: FolderIcon,
            color: "#7b1fa2",
            bg: "#f3e5f5",
            to: "/documents",
          },
        ].map(({ label, value, icon: Icon, color, bg, to }) => (
          <Grid item xs={6} md={3} key={label}>
            <Paper
              component={Link}
              to={to}
              elevation={0}
              sx={{
                p: { xs: 1.75, sm: 2.5 },
                borderRadius: 3,
                border: "1px solid #e8ecf0",
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.25, sm: 2 },
                textDecoration: "none",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: color,
                  boxShadow: `0 4px 14px ${color}22`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box
                sx={{
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  borderRadius: 2,
                  backgroundColor: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon sx={{ color, fontSize: { xs: 20, sm: 24 } }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{
                    lineHeight: 1,
                    color,
                    fontSize: { xs: "1.4rem", sm: "1.75rem" },
                  }}
                >
                  {value}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {label}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Accesos rápidos */}
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ mb: 1.5, fontSize: { xs: "0.9rem", sm: "1rem" } }}
      >
        Accesos rápidos
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {quickLinks.map(
          ({ to, label, icon: Icon, color, teacherDesc, parentDesc }) => (
            <Grid item xs={12} sm={6} md={4} key={to}>
              <Paper
                component={Link}
                to={to}
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 3,
                  border: "1px solid #e8ecf0",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: color,
                    boxShadow: `0 4px 14px ${color}20`,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    backgroundColor: `${color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ color, fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    color="text.primary"
                  >
                    {label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {role === "teacher" ? teacherDesc : parentDesc}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ),
        )}
      </Grid>

      {/* Mis grupos / cursos */}
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{
          mt: { xs: 3, sm: 4 },
          mb: 1.5,
          fontSize: { xs: "0.95rem", sm: "1rem" },
        }}
      >
        {role === "teacher" ? "Mis grupos de clase" : "Cursos de mis hijos"}
      </Typography>

      {myCourses.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          {role === "teacher"
            ? "No tienes cursos asignados aún."
            : "No tienes hijos matriculados en ningún curso."}
        </Typography>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {myCourses.map((course) => {
            const unread = getUnreadCount(currentUserId, course.id);
            const lastMsg = getLastMessage(course.id);
            return (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Paper
                  component={Link}
                  to="/chat"
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 3,
                    border: `1px solid #e8ecf0`,
                    borderTop: `3px solid ${COURSE_COLORS[myCourses.indexOf(course) % COURSE_COLORS.length]}`,
                    textDecoration: "none",
                    display: "block",
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {/* Cabecera del curso */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1.5,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.25 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor:
                            COURSE_COLORS[
                              myCourses.indexOf(course) % COURSE_COLORS.length
                            ],
                          width: { xs: 34, sm: 40 },
                          height: { xs: 34, sm: 40 },
                          fontWeight: 700,
                          fontSize: { xs: 15, sm: 18 },
                        }}
                      >
                        {course.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          fontWeight={700}
                          sx={{
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            lineHeight: 1.2,
                          }}
                        >
                          {course.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {course.students.length} alumno
                          {course.students.length !== 1 ? "s" : ""}
                        </Typography>
                      </Box>
                    </Box>
                    {unread > 0 && (
                      <Chip
                        size="small"
                        color="error"
                        label={unread}
                        sx={{ fontWeight: 700, height: 22, fontSize: "0.7rem" }}
                      />
                    )}
                  </Box>

                  {/* Último mensaje */}
                  {lastMsg ? (
                    <Box
                      sx={{
                        backgroundColor: "#f8fafc",
                        borderRadius: 2,
                        px: 1.5,
                        py: 1,
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        {getUserName(lastMsg.senderId)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{ fontStyle: "italic", fontSize: "0.78rem" }}
                      >
                        {lastMsg.text}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.disabled"
                      sx={{ fontStyle: "italic", fontSize: "0.78rem" }}
                    >
                      Sin mensajes todavía
                    </Typography>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}

export default Dashboard;
