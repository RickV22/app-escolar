import { useState, useMemo, useEffect, useRef } from "react";
import {
  Box,
  List,
  ListItemButton,
  Avatar,
  Badge,
  Typography,
  TextField,
  IconButton,
  Paper,
  Tooltip,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ForumIcon from "@mui/icons-material/Forum";
import GroupsIcon from "@mui/icons-material/Groups";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useUser } from "../../context/UserContext";
import { useChat } from "../../context/ChatContext";
import {
  courses,
  teachers,
  parents,
  onlineUserIds,
  getCoursesForUser,
} from "../../data/mockData";

// Paleta de colores por curso
const COURSE_COLORS = ["#1976d2", "#388e3c", "#f57c00", "#7b1fa2", "#c62828"];

function getCourseColor(courseId) {
  const index = courses.findIndex((c) => c.id === courseId);
  return COURSE_COLORS[Math.max(0, index) % COURSE_COLORS.length];
}

function getUserName(id) {
  return (
    teachers.find((t) => t.id === id)?.name ||
    parents.find((p) => p.id === id)?.name ||
    "Desconocido"
  );
}

function getInitial(name) {
  return name?.charAt(0)?.toUpperCase() ?? "?";
}

// ─── MOBILE: Lista de grupos ──────────────────────────────────────────────────
function MobileCourseList({
  myCourses,
  messagesByCourse,
  getUnreadCount,
  currentUserId,
  onSelect,
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {myCourses.map((course, idx) => {
        const msgs = messagesByCourse[course.id] || [];
        const lastMsg = msgs[msgs.length - 1];
        const unread = getUnreadCount(currentUserId, course.id);
        const color = COURSE_COLORS[idx % COURSE_COLORS.length];
        return (
          <Box
            key={course.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(course.id)}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && onSelect(course.id)
            }
            aria-label={
              unread > 0
                ? `${course.name}, ${unread} mensajes sin leer`
                : course.name
            }
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 2,
              py: 1.5,
              cursor: "pointer",
              transition: "background 0.15s",
              borderBottom: "1px solid #f0f0f0",
              "&:hover": { backgroundColor: "#f5f9ff" },
              "&:active": { backgroundColor: "#e8f0fe" },
              "&:focus-visible": {
                outline: "2px solid #1976d2",
                outlineOffset: -2,
              },
            }}
          >
            <Badge
              badgeContent={unread}
              color="error"
              invisible={unread === 0}
              overlap="circular"
            >
              <Avatar
                sx={{
                  bgcolor: color,
                  width: 50,
                  height: 50,
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                {getInitial(course.name)}
              </Avatar>
            </Badge>
            <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  mb: 0.3,
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight={unread > 0 ? 700 : 600}
                  noWrap
                  sx={{ maxWidth: "70%" }}
                >
                  {course.name}
                </Typography>
                <Typography
                  variant="caption"
                  color={unread > 0 ? "primary.main" : "text.secondary"}
                  fontWeight={unread > 0 ? 600 : 400}
                >
                  {course.students.length} alumnos
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color={unread > 0 ? "text.primary" : "text.secondary"}
                fontWeight={unread > 0 ? 500 : 400}
                noWrap
                sx={{ fontSize: "0.8rem" }}
              >
                {lastMsg
                  ? `${getUserName(lastMsg.senderId)}: ${lastMsg.text}`
                  : "Sin mensajes aún"}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

// ─── MOBILE: Vista conversación ───────────────────────────────────────────────
function MobileChatView({ course, messages, currentUserId, onBack, onSend }) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const courseColor = getCourseColor(course.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSend(newMessage);
    setNewMessage("");
    inputRef.current?.focus();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#eef2f7",
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${courseColor} 0%, #1565c0 100%)`,
        }}
      >
        <Toolbar sx={{ gap: 1.5, minHeight: "60px" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onBack}
            aria-label="Volver a la lista de grupos"
          >
            <ArrowBackIcon />
          </IconButton>
          <Avatar
            sx={{
              bgcolor: "rgba(255,255,255,0.25)",
              width: 38,
              height: 38,
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {getInitial(course.name)}
          </Avatar>
          <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {course.name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              {course.students.length} alumnos
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mensajes */}
      <Box
        role="log"
        aria-label="Mensajes del grupo"
        aria-live="polite"
        aria-relevant="additions"
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: 1.5,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        {messages.length === 0 && (
          <Box sx={{ textAlign: "center", mt: 8, opacity: 0.5 }}>
            <GroupsIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No hay mensajes aún
            </Typography>
          </Box>
        )}
        {messages.map((msg, index) => {
          const isMine = msg.senderId === currentUserId;
          const prevMsg = messages[index - 1];
          const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId;
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start",
                alignItems: "flex-end",
                gap: 0.75,
                mt: isFirstInGroup ? 1 : 0,
              }}
            >
              {!isMine && (
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: 12,
                    fontWeight: 700,
                    bgcolor: courseColor,
                    opacity: isFirstInGroup ? 1 : 0,
                    flexShrink: 0,
                  }}
                >
                  {isFirstInGroup ? getInitial(getUserName(msg.senderId)) : ""}
                </Avatar>
              )}
              <Box sx={{ maxWidth: "75%" }}>
                {!isMine && isFirstInGroup && (
                  <Typography
                    variant="caption"
                    sx={{
                      ml: 1,
                      color: "text.secondary",
                      fontWeight: 600,
                    }}
                  >
                    {getUserName(msg.senderId)}
                  </Typography>
                )}
                <Box
                  sx={{
                    backgroundColor: isMine ? courseColor : "#fff",
                    color: isMine ? "#fff" : "#1a1a2e",
                    borderRadius: isMine
                      ? isFirstInGroup
                        ? "18px 18px 4px 18px"
                        : "18px 4px 4px 18px"
                      : isFirstInGroup
                        ? "4px 18px 18px 18px"
                        : "4px 18px 18px 4px",
                    boxShadow: isMine
                      ? "0 1px 4px rgba(25,118,210,0.3)"
                      : "0 1px 3px rgba(0,0,0,0.08)",
                    px: 1.75,
                    py: 0.85,
                  }}
                >
                  <Typography variant="body2" sx={{ lineHeight: 1.45 }}>
                    {msg.text}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} aria-hidden="true" />
      </Box>

      {/* Input */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 1.25,
          backgroundColor: "#fff",
          borderTop: "1px solid #e8ecf0",
          pb: "max(env(safe-area-inset-bottom), 12px)",
        }}
      >
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Escribe un mensaje..."
          inputRef={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          inputProps={{ "aria-label": "Escribe un mensaje" }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "24px",
              backgroundColor: "#f5f7fa",
              "& fieldset": { borderColor: "#e0e5ea" },
            },
          }}
        />
        <IconButton
          type="submit"
          disabled={!newMessage.trim()}
          aria-label="Enviar mensaje"
          sx={{
            backgroundColor: newMessage.trim() ? courseColor : "#e0e5ea",
            color: newMessage.trim() ? "#fff" : "#aaa",
            width: 44,
            height: 44,
            flexShrink: 0,
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: newMessage.trim() ? "#1565c0" : "#e0e5ea",
            },
            "&.Mui-disabled": { backgroundColor: "#e0e5ea", color: "#bbb" },
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

// ─── ChatContent ─────────────────────────────────────────────────────────────
function ChatContent({ role, currentUserId }) {
  const { messagesByCourse, sendMessage, markAsRead, getUnreadCount } =
    useChat();
  const [newMessage, setNewMessage] = useState("");
  const desktopMessagesEndRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const myCourses = useMemo(
    () => getCoursesForUser(role, currentUserId),
    [role, currentUserId],
  );

  const [activeCourseId, setActiveCourseId] = useState(
    myCourses[0]?.id || null,
  );
  const [mobileViewOpen, setMobileViewOpen] = useState(false);

  useEffect(() => {
    if (activeCourseId) markAsRead(currentUserId, activeCourseId);
  }, [activeCourseId, currentUserId, markAsRead]);

  useEffect(() => {
    desktopMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByCourse, activeCourseId]);

  const activeCourse = courses.find((c) => c.id === activeCourseId);
  const activeCourseColor = activeCourseId
    ? getCourseColor(activeCourseId)
    : "#1976d2";

  const participants = useMemo(() => {
    if (!activeCourse) return [];
    const teacher = teachers.find((t) => t.id === activeCourse.teacherId);
    const parentIds = [
      ...new Set(activeCourse.students.map((s) => s.parentId)),
    ];
    const parentUsers = parentIds.map((id) => parents.find((p) => p.id === id));
    return [
      { ...teacher, role: "teacher" },
      ...parentUsers.map((p) => ({ ...p, role: "parent" })),
    ];
  }, [activeCourse]);

  const messages = activeCourseId ? messagesByCourse[activeCourseId] || [] : [];

  const handleSend = (text) => {
    if (!text.trim() || !activeCourseId) return;
    sendMessage(activeCourseId, currentUserId, text);
  };

  const handleMobileSelect = (courseId) => {
    setActiveCourseId(courseId);
    markAsRead(currentUserId, courseId);
    setMobileViewOpen(true);
  };

  if (myCourses.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <GroupsIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No tienes grupos asignados
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {role === "teacher"
            ? "Aún no tienes cursos asignados."
            : "No tienes hijos matriculados en ningún curso."}
        </Typography>
      </Box>
    );
  }

  // ── MOBILE ──
  if (isMobile) {
    return (
      <Box>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            Mensajería
          </Typography>
          <Box
            sx={{
              ml: "auto",
              px: 1.25,
              py: 0.25,
              backgroundColor: "#e3f2fd",
              borderRadius: 10,
            }}
          >
            <Typography variant="caption" color="primary.main" fontWeight={600}>
              {myCourses.length} grupos
            </Typography>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #e8ecf0",
          }}
        >
          <MobileCourseList
            myCourses={myCourses}
            messagesByCourse={messagesByCourse}
            getUnreadCount={getUnreadCount}
            currentUserId={currentUserId}
            onSelect={handleMobileSelect}
          />
        </Paper>

        {mobileViewOpen && activeCourse && (
          <MobileChatView
            course={activeCourse}
            messages={messages}
            currentUserId={currentUserId}
            onBack={() => setMobileViewOpen(false)}
            onSend={handleSend}
          />
        )}
      </Box>
    );
  }

  // ── DESKTOP ──
  const totalUnread = myCourses.reduce(
    (sum, c) => sum + getUnreadCount(currentUserId, c.id),
    0,
  );

  return (
    <Box>
      {/* Título de página */}
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              background: "linear-gradient(135deg, #1976d2, #1565c0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(25,118,210,0.3)",
            }}
          >
            <ForumIcon sx={{ color: "#fff", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
              Mensajería por curso
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.25 }}
            >
              {role === "teacher"
                ? "Comunícate con los padres de cada uno de tus grupos."
                : "Conversa con los maestros de los cursos de tus hijos."}
            </Typography>
          </Box>
        </Box>
        {totalUnread > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.5,
              py: 0.75,
              backgroundColor: "#fde8e8",
              borderRadius: 10,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "error.main",
              }}
            />
            <Typography variant="caption" color="error.main" fontWeight={700}>
              {totalUnread} sin leer
            </Typography>
          </Box>
        )}
      </Box>

      {/* Panel principal */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          height: "calc(100vh - 164px)",
          minHeight: 500,
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e0e6ed",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* ── Sidebar: lista de cursos ── */}
        <Box
          sx={{
            width: 300,
            flexShrink: 0,
            borderRight: "1px solid #e8ecf0",
            backgroundColor: "#f8fafc",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.75,
              borderBottom: "1px solid #e8ecf0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              sx={{ letterSpacing: 0.8, textTransform: "uppercase" }}
            >
              Mis Grupos
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {myCourses.length}
            </Typography>
          </Box>
          <List disablePadding sx={{ flexGrow: 1, overflowY: "auto" }}>
            {myCourses.map((course, idx) => {
              const msgs = messagesByCourse[course.id] || [];
              const lastMsg = msgs[msgs.length - 1];
              const unread = getUnreadCount(currentUserId, course.id);
              const color = COURSE_COLORS[idx % COURSE_COLORS.length];
              const isActive = activeCourseId === course.id;
              return (
                <ListItemButton
                  key={course.id}
                  selected={isActive}
                  onClick={() => setActiveCourseId(course.id)}
                  sx={{
                    py: 1.5,
                    px: 1.5,
                    gap: 1.5,
                    transition: "all 0.15s",
                    borderLeft: `3px solid ${isActive ? color : "transparent"}`,
                    "&.Mui-selected": {
                      backgroundColor: `${color}18`,
                      "&:hover": { backgroundColor: `${color}22` },
                    },
                    "&:hover": { backgroundColor: "#edf2f7" },
                  }}
                >
                  <Badge
                    badgeContent={unread}
                    color="error"
                    invisible={unread === 0}
                    overlap="circular"
                  >
                    <Avatar
                      sx={{
                        bgcolor: color,
                        width: 44,
                        height: 44,
                        fontWeight: 700,
                        fontSize: 17,
                        flexShrink: 0,
                      }}
                    >
                      {getInitial(course.name)}
                    </Avatar>
                  </Badge>
                  <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.25,
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={isActive || unread > 0 ? 700 : 500}
                        noWrap
                        sx={{ maxWidth: "75%" }}
                      >
                        {course.name}
                      </Typography>
                      {unread > 0 && (
                        <Box
                          sx={{
                            minWidth: 20,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: "error.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            px: 0.75,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#fff",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              lineHeight: 1,
                            }}
                          >
                            {unread}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      sx={{ display: "block" }}
                    >
                      {lastMsg
                        ? `${getUserName(lastMsg.senderId)}: ${lastMsg.text}`
                        : "Sin mensajes"}
                    </Typography>
                  </Box>
                </ListItemButton>
              );
            })}
          </List>
          {/* Footer sidebar */}
          <Box
            sx={{
              px: 2,
              py: 1.25,
              borderTop: "1px solid #e8ecf0",
            }}
          >
            <Typography variant="caption" color="text.disabled">
              App Escolar · Mensajería
            </Typography>
          </Box>
        </Box>

        {/* ── Área de mensajes ── */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {activeCourse ? (
            <>
              {/* Header del chat */}
              <Box
                sx={{
                  px: 2.5,
                  py: 1.5,
                  borderBottom: "1px solid #e8ecf0",
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: activeCourseColor,
                    width: 44,
                    height: 44,
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {getInitial(activeCourse.name)}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={700} noWrap>
                    {activeCourse.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* Avatares apilados de participantes */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {participants.slice(0, 4).map((p, i) => (
                        <Tooltip
                          key={p.id}
                          title={`${
                            p.role === "teacher"
                              ? p.name + " (Maestro)"
                              : p.name
                          } · ${
                            onlineUserIds.includes(p.id)
                              ? "En línea"
                              : "Desconectado"
                          }`}
                        >
                          <Avatar
                            sx={{
                              width: 22,
                              height: 22,
                              fontSize: 10,
                              fontWeight: 700,
                              bgcolor: onlineUserIds.includes(p.id)
                                ? activeCourseColor
                                : "#bdbdbd",
                              border: "2px solid #fff",
                              ml: i === 0 ? 0 : -0.75,
                              zIndex: participants.length - i,
                              cursor: "default",
                            }}
                          >
                            {getInitial(p.name)}
                          </Avatar>
                        </Tooltip>
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {participants.length} participante
                      {participants.length !== 1 ? "s" : ""}
                      {" · "}
                      {
                        participants.filter((p) => onlineUserIds.includes(p.id))
                          .length
                      }{" "}
                      en línea
                    </Typography>
                  </Box>
                </Box>
                {/* Badge alumnos */}
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.4,
                    backgroundColor: `${activeCourseColor}15`,
                    border: `1px solid ${activeCourseColor}35`,
                    borderRadius: 10,
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: activeCourseColor, fontWeight: 600 }}
                  >
                    {activeCourse.students.length} alumnos
                  </Typography>
                </Box>
              </Box>

              {/* Mensajes */}
              <Box
                role="log"
                aria-label="Mensajes del grupo"
                aria-live="polite"
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  p: 2.5,
                  backgroundColor: "#f0f4f8",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                {messages.length === 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flexGrow: 1,
                      opacity: 0.45,
                    }}
                  >
                    <ForumIcon
                      sx={{ fontSize: 56, color: "text.disabled", mb: 1.5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Sé el primero en escribir en {activeCourse.name}
                    </Typography>
                  </Box>
                )}
                {messages.length > 0 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 1 }}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 0.4,
                        backgroundColor: "rgba(0,0,0,0.06)",
                        borderRadius: 10,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Hoy
                      </Typography>
                    </Box>
                  </Box>
                )}
                {messages.map((msg, index) => {
                  const isMine = msg.senderId === currentUserId;
                  const prevMsg = messages[index - 1];
                  const isFirstInGroup =
                    !prevMsg || prevMsg.senderId !== msg.senderId;
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: isMine ? "flex-end" : "flex-start",
                        alignItems: "flex-end",
                        gap: 1,
                        mt: isFirstInGroup ? 1.5 : 0,
                      }}
                    >
                      {!isMine && (
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            fontSize: 13,
                            fontWeight: 700,
                            bgcolor: activeCourseColor,
                            opacity: isFirstInGroup ? 1 : 0,
                            flexShrink: 0,
                          }}
                        >
                          {isFirstInGroup
                            ? getInitial(getUserName(msg.senderId))
                            : ""}
                        </Avatar>
                      )}
                      <Box sx={{ maxWidth: "65%" }}>
                        {!isMine && isFirstInGroup && (
                          <Typography
                            variant="caption"
                            sx={{
                              ml: 1,
                              color: "text.secondary",
                              fontWeight: 600,
                            }}
                          >
                            {getUserName(msg.senderId)}
                          </Typography>
                        )}
                        <Box
                          sx={{
                            backgroundColor: isMine
                              ? activeCourseColor
                              : "#fff",
                            color: isMine ? "#fff" : "#1a1a2e",
                            borderRadius: isMine
                              ? isFirstInGroup
                                ? "18px 18px 4px 18px"
                                : "18px 4px 4px 18px"
                              : isFirstInGroup
                                ? "4px 18px 18px 18px"
                                : "4px 18px 18px 4px",
                            boxShadow: isMine
                              ? "0 2px 6px rgba(25,118,210,0.25)"
                              : "0 1px 3px rgba(0,0,0,0.07)",
                            px: 2,
                            py: 1,
                          }}
                        >
                          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                            {msg.text}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
                <div ref={desktopMessagesEndRef} aria-hidden="true" />
              </Box>

              {/* Input */}
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(newMessage);
                  setNewMessage("");
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  backgroundColor: "#fff",
                  borderTop: "1px solid #e8ecf0",
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder={`Mensaje para ${activeCourse.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(newMessage);
                      setNewMessage("");
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "24px",
                      backgroundColor: "#f5f7fa",
                      "& fieldset": { borderColor: "#e0e5ea" },
                      "&:hover fieldset": { borderColor: activeCourseColor },
                      "&.Mui-focused fieldset": {
                        borderColor: activeCourseColor,
                      },
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
                >
                  Enter para enviar
                </Typography>
                <IconButton
                  type="submit"
                  disabled={!newMessage.trim()}
                  aria-label="Enviar mensaje"
                  sx={{
                    backgroundColor: newMessage.trim()
                      ? activeCourseColor
                      : "#e0e5ea",
                    color: newMessage.trim() ? "#fff" : "#aaa",
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: newMessage.trim()
                        ? "#1565c0"
                        : "#e0e5ea",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "#e0e5ea",
                      color: "#bbb",
                    },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                opacity: 0.45,
              }}
            >
              <ForumIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Selecciona un grupo para ver los mensajes
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

function Chat() {
  const { role, currentUserId } = useUser();

  return (
    <ChatContent
      key={`${role}-${currentUserId}`}
      role={role}
      currentUserId={currentUserId}
    />
  );
}

export default Chat;
