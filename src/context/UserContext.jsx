import { createContext, useContext, useState } from "react";
import { teachers, parents } from "../data/mockData";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [role, setRoleState] = useState("parent");
  const [currentUserId, setCurrentUserId] = useState(parents[0].id);

  // Al cambiar de rol, selecciona automáticamente el primer usuario de esa lista
  const setRole = (newRole) => {
    setRoleState(newRole);
    setCurrentUserId(newRole === "teacher" ? teachers[0].id : parents[0].id);
  };

  const switchUser = (id) => setCurrentUserId(id);

  const currentUser =
    role === "teacher"
      ? teachers.find((t) => t.id === currentUserId)
      : parents.find((p) => p.id === currentUserId);

  return (
    <UserContext.Provider
      value={{ role, setRole, currentUserId, switchUser, currentUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  return useContext(UserContext);
}
