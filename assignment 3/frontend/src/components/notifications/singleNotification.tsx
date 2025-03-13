import Toast from "react-bootstrap/Toast";
import NotificationType from "../../types/notificationType";
import { useState } from "react";

export default function SingleNotification({
  notification,
}: {
  notification: NotificationType;
}) {
  const [show, setShow] = useState(notification.show);

  return (
    <Toast
      show={show}
      onClose={() => {
        notification.show = false;
        setShow(false);
      }}
      delay={3000}
      autohide>
      <Toast.Header style={{ backgroundColor: notification.backgroundColor }}>
        <p className={`me-auto h6 pt-2 ${notification.textColor}`}>
          {notification.message}
        </p>
      </Toast.Header>
    </Toast>
  );
}
