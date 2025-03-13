import { createContext, useState, useContext, ReactNode } from "react";
import NotificationType from "../types/notificationType";

interface NotificationContextType {
  notifications: NotificationType[];
  setNotifications: (value: NotificationType[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const value: NotificationContextType = {
    notifications,
    setNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { NotificationsProvider, useNotifications };
