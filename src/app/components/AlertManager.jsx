import { useState, useEffect } from "react";

export default function AlertManager({ newAlert }) {
  const [alerts, setAlerts] = useState([]);

  // เพิ่มข้อความใหม่เมื่อ newAlert เปลี่ยนแปลง
  useEffect(() => {
    if (newAlert) {
      setAlerts((prev) => [...prev, { message: newAlert.message, type: newAlert.type }]);
    }
  }, [newAlert]);

  // ลบข้อความแจ้งเตือนตาม index
  const removeAlert = (index) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {alerts.map((alert, index) => (
        <Alert
          key={index}
          message={alert.message}
          type={alert.type}
          onClose={() => removeAlert(index)}
        />
      ))}
    </div>
  );
}

function Alert({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose && onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`text-xs p-4 rounded-lg shadow-lg text-white transition-transform duration-1000 ease-in-out ${
        type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-gray-500"
      }`}
    >
      {message}
    </div>
  );
}
