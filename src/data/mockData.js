export const teachers = [
  { id: "t1", name: "Prof. García", subject: "Matemáticas" },
  { id: "t2", name: "Prof. Martínez", subject: "Ciencias" },
];

export const parents = [
  { id: "p1", name: "Carlos Pérez" },
  { id: "p2", name: "Laura Gómez" },
  { id: "p3", name: "Andrea Ruiz" },
  { id: "p4", name: "Miguel Torres" },
];

// Cursos asignados a cada maestro, con sus estudiantes y el padre/madre de cada uno
export const courses = [
  {
    id: "c1",
    name: "Matemáticas 5°A",
    teacherId: "t1",
    students: [
      { id: "s1", name: "Juan Pérez", parentId: "p1" },
      { id: "s2", name: "Sofía Gómez", parentId: "p2" },
    ],
  },
  {
    id: "c2",
    name: "Matemáticas 6°B",
    teacherId: "t1",
    students: [{ id: "s3", name: "Mateo Ruiz", parentId: "p3" }],
  },
  {
    id: "c3",
    name: "Ciencias 5°A",
    teacherId: "t2",
    students: [
      { id: "s1", name: "Juan Pérez", parentId: "p1" },
      { id: "s4", name: "Valentina Torres", parentId: "p4" },
    ],
  },
];
// Documentos asociados a cada curso
export const documents = [
  { id: 1, courseId: "c1", title: "Circular reunión de padres", date: "05/06/2026" },
  { id: 2, courseId: "c1", title: "Tarea de matemáticas", date: "12/06/2026" },
  { id: 3, courseId: "c3", title: "Guía de laboratorio", date: "15/06/2026" },
  { id: 4, courseId: "c2", title: "Circular evento cultural", date: "20/06/2026" },
];

// Cursos visibles según el rol y usuario logueado
export function getCoursesForUser(role, userId) {
  if (role === "teacher") {
    return courses.filter((c) => c.teacherId === userId);
  }
  return courses.filter((c) => c.students.some((s) => s.parentId === userId));
}

// Simula quién está conectado en este momento (para mostrar el punto verde "en línea")
export const onlineUserIds = ["p1", "p3", "t1", "t2"];