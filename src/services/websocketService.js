import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export const connectToQRStatus = (qrId, onMessage) => {
  if (stompClient && stompClient.active) {
    stompClient.deactivate();
  }

  stompClient = new Client({
    // webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    webSocketFactory: () => new SockJS("https://e-wallet-springboot-backend.onrender.com/ws"),
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("WebSocket connected");

      stompClient.subscribe(`/topic/qr/${qrId}`, (msg) => {
        const payload = JSON.parse(msg.body);
        console.log("WebSocket message received:", payload);
        onMessage(payload);
      });
    },

    onStompError: (frame) => {
      console.error("WebSocket error:", frame);
    },
  });

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};
