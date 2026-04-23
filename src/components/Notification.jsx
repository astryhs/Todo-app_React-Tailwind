import { useContext } from "react";
import { NetworkContext } from "../contexts/NetworkContext";

export const Notification = () => {
  const { networkStatus } = useContext(NetworkContext);
const {isOnline,showNotification,message}=networkStatus;

if(!showNotification) return null;

  return <div className={`mt-2 p-2 rounded text-sm ${isOnline?'bg-green-100 text-green-600':"bg-red-300 text-red-700"}`}>{message}</div>;
};
