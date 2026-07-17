import {
  Box, Typography, Paper, Chip, Grid,
  useMediaQuery, useTheme, Divider,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { useUser } from "../../context/UserContext";
import { getCoursesForUser } from "../../data/mockData";

const eventsByMonth = [
  { id: 1, date: "5 de junio",  title: "Reunión de padres",    icon: GroupsIcon,      color: "#1976d2", courseId: "c1" },
  { id: 2, date: "12 de junio", title: "Entrega de tareas",    icon: AssignmentIcon,  color: "#fbc02d", courseId: "c2" },
  { id: 3, date: "20 de junio", title: "Evento cultural",       icon: CelebrationIcon, color: "#43a047", courseId: "c3" },
  { id: 4, date: "25 de junio", title: "Examen de fracciones", icon: AssignmentIcon,  color: "#e53935", courseId: "c2" },
];

// Agrupa los eventos por fecha para mobile
function groupByDate(events) {
  return events.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});
}

// Tarjeta individual de evento (compartida entre mobile y desktop)
function EventCard({ event, courseName, isMobile }) {
  const { date, title, icon: Icon, color, courseId } = event;
  return (
    <Paper
      elevation={isMobile ? 1 : 2}
      sx={{
        p: isMobile ? 1.5 : 2,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        gap: isMobile ? 1.5 : 2,
        borderLeft: `4px solid ${color}`,
        transition: "0.2s",
        height: "100%",
        "&:hover": { boxShadow: 4, transform: isMobile ? "none" : "translateX(4px)" },
        "&:active": isMobile ? { backgroundColor: "#f5f7fa" } : {},
      }}
    >
      <Box
        sx={{
          width: isMobile ? 38 : 44,
          height: isMobile ? 38 : 44,
          minWidth: isMobile ? 38 : 44,
          borderRadius: "50%",
          backgroundColor: `${color}1A`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon sx={{ color, fontSize: isMobile ? 18 : 22 }} />
      </Box>
      <Box sx={{ overflow: "hidden", flexGrow: 1 }}>
        <Typography
          fontWeight={600}
          noWrap
          sx={{ fontSize: isMobile ? "0.9rem" : "1rem" }}
        >
          {title}
        </Typography>
        {!isMobile && (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
            {date}
          </Typography>
        )}
        <Chip
          label={courseName(courseId)}
          size="small"
          variant="outlined"
          sx={{ mt: 0.5, fontSize: "0.68rem", height: 18 }}
        />
      </Box>
    </Paper>
  );
}

export default function Calendar() {
  const { role, currentUserId } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const myCourses = getCoursesForUser(role, currentUserId);
  const myCourseIds = myCourses.map((c) => c.id);
  const myEvents = eventsByMonth.filter((e) => myCourseIds.includes(e.courseId));
  const courseName = (courseId) => myCourses.find((c) => c.id === courseId)?.name || "";

  const grouped = groupByDate(myEvents);

  // ── HEADER compartido ──
  const Header = (
    <Box
      sx={{
        mb: isMobile ? 2.5 : 4,
        p: isMobile ? 2.5 : 4,
        borderRadius: 3,
        background: "linear-gradient(135deg, #1976d2 0%, #1565c0 60%, #fbc02d 150%)",
        color: "#fff",
        boxShadow: 4,
        display: "flex",
        alignItems: "center",
        gap: isMobile ? 1.5 : 2,
      }}
    >
      <CalendarTodayIcon sx={{ fontSize: isMobile ? 28 : 36 }} />
      <Box>
        <Typography
          variant={isMobile ? "h6" : "h4"}
          fontWeight={700}
        >
          Calendario Escolar
        </Typography>
        <Typography
          variant="body2"
          sx={{ opacity: 0.9, mt: 0.3 }}
        >
          {role === "teacher"
            ? "Eventos y actividades de tus cursos."
            : "Eventos escolares de tus hijos."}
        </Typography>
      </Box>
    </Box>
  );

  if (myEvents.length === 0) {
    return (
      <Box>
        {Header}
        <Typography color="text.secondary" variant="body2">
          No hay eventos programados para tus cursos este mes.
        </Typography>
      </Box>
    );
  }

  // ── MOBILE: agrupado por fecha, lista vertical ──
  if (isMobile) {
    return (
      <Box>
        {Header}

        {/* Resumen */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>Junio 2026</Typography>
          <Chip label={`${myEvents.length} eventos`} size="small" color="primary" variant="outlined" />
        </Box>

        {/* Eventos agrupados por fecha */}
        {Object.entries(grouped).map(([date, events]) => (
          <Box key={date} sx={{ mb: 2.5 }}>
            {/* Separador de fecha */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box
                sx={{
                  backgroundColor: "primary.main",
                  color: "#fff",
                  borderRadius: 1.5,
                  px: 1.2,
                  py: 0.3,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                {date}
              </Box>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>

            {/* Tarjetas del día */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {events.map((event) => (
                <EventCard key={event.id} event={event} courseName={courseName} isMobile />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  // ── DESKTOP: grid de tres columnas ──
  return (
    <Box>
      {Header}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>Junio 2026</Typography>
        <Chip label={`${myEvents.length} eventos`} size="small" color="primary" variant="outlined" />
      </Box>

      <Grid container spacing={2}>
        {myEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <EventCard event={event} courseName={courseName} isMobile={false} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}