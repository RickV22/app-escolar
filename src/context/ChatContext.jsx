import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ChatContext = createContext();

const initialMessagesByCourse = {
  c1: [
    {
      senderId: "t1",
      text: "Buenas tardes a todos, recuerden la tarea para el viernes.",
    },
    { senderId: "p1", text: "Gracias profesor, Juan ya la está haciendo." },
  ],
  c2: [{ senderId: "t1", text: "Mañana tenemos examen de fracciones." }],
  c3: [{ senderId: "t2", text: "Bienvenidos al grupo de Ciencias 5°A." }],
};

export function ChatProvider({ children }) {
  const [messagesByCourse, setMessagesByCourse] = useState(
    initialMessagesByCourse,
  );
  // lastReadIndex: { [userId]: { [courseId]: cantidadDeMensajesLeidos } }
  const [lastReadIndex, setLastReadIndex] = useState({});

  const sendMessage = useCallback((courseId, senderId, text) => {
    setMessagesByCourse((prev) => {
      const nextCourseMessages = [
        ...(prev[courseId] || []),
        { senderId, text },
      ];

      // El remitente marca como leido su propio mensaje al enviarlo.
      setLastReadIndex((prevRead) => ({
        ...prevRead,
        [senderId]: {
          ...(prevRead[senderId] || {}),
          [courseId]: nextCourseMessages.length,
        },
      }));

      return { ...prev, [courseId]: nextCourseMessages };
    });
  }, []);

  const markAsRead = useCallback(
    (userId, courseId) => {
      const total = messagesByCourse[courseId]?.length || 0;
      setLastReadIndex((prev) => {
        const current = prev[userId]?.[courseId] || 0;
        if (current === total) return prev;
        return {
          ...prev,
          [userId]: { ...(prev[userId] || {}), [courseId]: total },
        };
      });
    },
    [messagesByCourse],
  );

  const getUnreadCount = useCallback(
    (userId, courseId) => {
      const total = messagesByCourse[courseId]?.length || 0;
      const read = lastReadIndex[userId]?.[courseId] || 0;
      return Math.max(0, total - read);
    },
    [messagesByCourse, lastReadIndex],
  );

  const getLastMessage = useCallback(
    (courseId) => {
      const msgs = messagesByCourse[courseId];
      return msgs && msgs.length > 0 ? msgs[msgs.length - 1] : null;
    },
    [messagesByCourse],
  );

  const value = useMemo(
    () => ({
      messagesByCourse,
      sendMessage,
      markAsRead,
      getUnreadCount,
      getLastMessage,
    }),
    [messagesByCourse, sendMessage, markAsRead, getUnreadCount, getLastMessage],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
  return useContext(ChatContext);
}
