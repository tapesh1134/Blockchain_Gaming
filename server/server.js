import express from "express";
import http from "http";
import setupSocket from "./socket/gameSocket.js";
import cors from "cors";

const app = express();
const server = http.createServer(app);

app.use(cors()); // ✅ Enable CORS

setupSocket(server); // ✅ Attach WebSocket logic

server.listen(8000, () => console.log("Server running on port 8000"));
