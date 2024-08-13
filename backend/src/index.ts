import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import api from "./routes/api";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(express.json());

app.use(cors());
app.use("/api", api);

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
