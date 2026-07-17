import { useState } from "react";
import {
  Box, Typography, Paper, IconButton, Button, Chip, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Select, InputLabel, FormControl,
  useMediaQuery, useTheme, Fab, Divider, Avatar,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";
import { useUser } from "../../context/UserContext";
import { getCoursesForUser, documents as initialDocs } from "../../data/mockData";

// Colores por curso para diferenciarlos visualmente
const courseColors = { c1: "#1976d2", c2: "#43a047", c3: "#e53935", c4: "#fbc02d" };

function Documents() {
  const { role, currentUserId } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const myCourses = getCoursesForUser(role, currentUserId);
  const myCourseIds = myCourses.map((c) => c.id);

  const [docs, setDocs] = useState(initialDocs);
  const [openDialog, setOpenDialog] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: "", courseId: myCourseIds[0] || "" });

  const myDocuments = docs.filter((d) => myCourseIds.includes(d.courseId));
  const courseName = (courseId) => myCourses.find((c) => c.id === courseId)?.name || "";
  const courseColor = (courseId) => courseColors[courseId] || "#1976d2";

  // Agrupa documentos por curso para mobile
  const groupedByCourse = myCourseIds.reduce((acc, id) => {
    const courseDocs = myDocuments.filter((d) => d.courseId === id);
    if (courseDocs.length > 0) acc[id] = courseDocs;
    return acc;
  }, {});

  const handleAddDoc = () => {
    if (!newDoc.title.trim() || !newDoc.courseId) return;
    setDocs((prev) => [
      ...prev,
      {
        id: Date.now(),
        courseId: newDoc.courseId,
        title: newDoc.title.trim(),
        date: new Date().toLocaleDateString("es-CO"),
      },
    ]);
    setNewDoc({ title: "", courseId: myCourseIds[0] || "" });
    setOpenDialog(false);
  };

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
      <FolderIcon sx={{ fontSize: isMobile ? 28 : 36 }} />
      <Box>
        <Typography variant={isMobile ? "h6" : "h4"} fontWeight={700}>
          Documentos Escolares
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.3 }}>
          {role === "teacher"
            ? "Administra circulares y tareas de tus cursos."
            : "Consulta tareas y circulares de tus hijos."}
        </Typography>
      </Box>
    </Box>
  );

  // ── DIALOG para agregar doc (compartido) ──
  const AddDialog = (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3, mx: { xs: 2, sm: "auto" } } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Nuevo documento</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "12px !important" }}>
        <TextField
          label="Título del documento"
          fullWidth
          size="small"
          value={newDoc.title}
          onChange={(e) => setNewDoc((p) => ({ ...p, title: e.target.value }))}
          autoFocus
        />
        <FormControl fullWidth size="small">
          <InputLabel>Curso</InputLabel>
          <Select
            label="Curso"
            value={newDoc.courseId}
            onChange={(e) => setNewDoc((p) => ({ ...p, courseId: e.target.value }))}
          >
            {myCourses.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => setOpenDialog(false)} color="inherit">Cancelar</Button>
        <Button
          onClick={handleAddDoc}
          variant="contained"
          disabled={!newDoc.title.trim() || !newDoc.courseId}
        >
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );

  // ── Sin documentos ──
  if (myDocuments.length === 0) {
    return (
      <Box>
        {Header}
        <Typography color="text.secondary" variant="body2">
          No hay documentos disponibles todavía.
        </Typography>
        {role === "teacher" && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            onClick={() => setOpenDialog(true)}
          >
            Agregar documento
          </Button>
        )}
        {AddDialog}
      </Box>
    );
  }

  // ── MOBILE: agrupado por curso ──
  if (isMobile) {
    return (
      <Box sx={{ pb: 2 }}>
        {Header}

        {/* Grupos de documentos por curso */}
        {Object.entries(groupedByCourse).map(([courseId, courseDocs]) => (
          <Box key={courseId} sx={{ mb: 3 }}>
            {/* Cabecera del curso */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.2 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: courseColor(courseId),
                  flexShrink: 0,
                }}
              />
              <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                {courseName(courseId)}
              </Typography>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography variant="caption" color="text.secondary">
                {courseDocs.length} doc{courseDocs.length !== 1 ? "s" : ""}
              </Typography>
            </Box>

            {/* Documentos del curso */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {courseDocs.map((doc) => (
                <Paper
                  key={doc.id}
                  elevation={1}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    borderLeft: `3px solid ${courseColor(courseId)}`,
                    "&:active": { backgroundColor: "#f5f7fa" },
                  }}
                >
                  {/* Ícono */}
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      backgroundColor: `${courseColor(courseId)}18`,
                      flexShrink: 0,
                    }}
                  >
                    <DescriptionIcon sx={{ color: courseColor(courseId), fontSize: 20 }} />
                  </Avatar>

                  {/* Info */}
                  <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                    <Typography
                      fontWeight={600}
                      noWrap
                      sx={{ fontSize: "0.875rem" }}
                    >
                      {doc.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {doc.date}
                    </Typography>
                  </Box>

                  {/* Descargar */}
                  <IconButton
                    size="small"
                    sx={{
                      color: courseColor(courseId),
                      backgroundColor: `${courseColor(courseId)}12`,
                      flexShrink: 0,
                      "&:active": { backgroundColor: `${courseColor(courseId)}28` },
                    }}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Paper>
              ))}
            </Box>
          </Box>
        ))}

        {/* FAB flotante para maestros */}
        {role === "teacher" && (
          <Fab
            color="primary"
            onClick={() => setOpenDialog(true)}
            sx={{
              position: "fixed",
              bottom: 80, // encima del BottomNav
              right: 20,
              boxShadow: 6,
            }}
          >
            <AddIcon />
          </Fab>
        )}

        {AddDialog}
      </Box>
    );
  }

  // ── DESKTOP: zona de subir + grid de tarjetas ──
  return (
    <Box>
      {Header}

      {/* Zona de subir (maestro) */}
      {role === "teacher" && (
        <Paper
          variant="outlined"
          sx={{
            mb: 3, p: 3, borderRadius: 2,
            borderStyle: "dashed", borderColor: "primary.main",
            textAlign: "center", backgroundColor: "#f0f6ff",
          }}
        >
          <UploadFileIcon sx={{ fontSize: 36, color: "primary.main", mb: 1 }} />
          <Typography fontWeight={600} gutterBottom>Subir nuevo documento</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Comparte circulares o tareas con los padres de tus cursos.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Agregar documento
          </Button>
        </Paper>
      )}

      {/* Grid de documentos */}
      <Grid container spacing={2}>
        {myDocuments.map((doc) => (
          <Grid item xs={12} sm={6} md={4} key={doc.id}>
            <Paper
              elevation={2}
              sx={{
                p: 2, borderRadius: 2, height: "100%",
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                borderTop: `3px solid ${courseColor(doc.courseId)}`,
                transition: "0.2s",
                "&:hover": { boxShadow: 4 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, overflow: "hidden", mr: 1 }}>
                <Avatar sx={{ bgcolor: `${courseColor(doc.courseId)}18`, flexShrink: 0 }}>
                  <DescriptionIcon sx={{ color: courseColor(doc.courseId) }} />
                </Avatar>
                <Box sx={{ overflow: "hidden" }}>
                  <Typography fontWeight={600} noWrap sx={{ fontSize: "0.9rem" }}>
                    {doc.title}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.8, alignItems: "center", mt: 0.3, flexWrap: "wrap" }}>
                    <Typography variant="caption" color="text.secondary">{doc.date}</Typography>
                    <Chip
                      label={courseName(doc.courseId)}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.68rem", height: 18, borderColor: courseColor(doc.courseId), color: courseColor(doc.courseId) }}
                    />
                  </Box>
                </Box>
              </Box>
              <IconButton size="small" sx={{ color: courseColor(doc.courseId), flexShrink: 0 }}>
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {AddDialog}
    </Box>
  );
}

export default Documents;