import ToastContainer from "react-bootstrap/ToastContainer";
import SingleNotification from "./singleNotification";
import NotificationType from "../../types/notificationType";

interface StackingExampleProps {
    notifications: NotificationType[];
}

function StackingExample({ notifications }: StackingExampleProps) {
  return (
    <ToastContainer className='position-static' style={{ zIndex: 9999 }}>
      {notifications.map((notification, index) => (
        <SingleNotification key={index} notification={notification} />
      ))}
    </ToastContainer>
  );
}

export default StackingExample;
