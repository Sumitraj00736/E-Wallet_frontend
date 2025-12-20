import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationCenter({ notifications }) {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    if (notifications.length === 0) return;

    const latest = notifications[0];
    setVisibleNotifications((prev) => [latest, ...prev]);

    // Auto-remove after 5 seconds
    const timer = setTimeout(() => {
      setVisibleNotifications((prev) => prev.filter((n) => n.id !== latest.id));
    }, 5000);

    return () => clearTimeout(timer);
  }, [notifications]);

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <AnimatePresence>
        {visibleNotifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", damping: 20 }}
            style={{
              background: "#1a1a1a",
              color: "#fff",
              borderLeft: n.status === "PAID" ? "4px solid #d4a017" : "4px solid #888",
              padding: "12px 16px",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              minWidth: "250px",
            }}
          >
            {n.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
