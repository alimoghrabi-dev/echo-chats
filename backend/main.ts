import express, { NextFunction, Response, Express } from "express";
import cors from "cors";
import logger from "./utils/logger.js";
import ConnectToDatabase from "./config/database.js";
import envConfig from "./config/env.js";
import helmet from "helmet";
import { createServer } from "node:http";
import { Server } from "socket.io";
import compression from "compression";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import authRouter from "./routes/auth.routes.js";
import TokenGuard from "./middlewares/tokenGuard.middleware.js";
import communityRouter from "./routes/community.routes.js";
import chatRouter from "./routes/chat.routes.js";
import userRouter from "./routes/user.routes.js";
import { asciiLogo, listRoutes } from "./utils/lists.js";
import chalk from "chalk";

const app: Express = express();
const server = createServer(app);

const PORT = envConfig.PORT || 3000;
const allowedOrigins = ["http://localhost:8000", envConfig.BASE_URL];

export const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS!"));
      }
    },
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (envConfig.NODE_ENV === "production") {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "https://fonts.googleapis.com",
            "https://fonts.gstatic.com",
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          connectSrc: ["'self'", envConfig.BASE_URL, "ws:", "wss:"],
          imgSrc: ["'self'", "data:"],
        },
      },
    })
  );
} else {
  app.use(helmet());
}

app.use(compression());
app.use(cookieParser(envConfig.COOKIE_SECRET));

app.use((_req, res: Response, next: NextFunction) => {
  res.set("Cache-Control", "public, max-age=31536000");
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS!"));
      }
    },
    credentials: true,
  })
);

const onlineUsers = new Map<string, string>();

const startServer = async () => {
  try {
    await ConnectToDatabase();

    server.listen(PORT, () => {
      console.log(chalk.cyan(asciiLogo));

      console.log(chalk.magentaBright.bold("🚀 Server is running!"));
      console.log(chalk.white("──────────────────────────────────"));
      console.log(chalk.blueBright(`📍 PORT: ${PORT}`));
      console.log(chalk.yellow(`🌍 ENV: ${envConfig.NODE_ENV}`));
      console.log(chalk.white("──────────────────────────────────"));
      listRoutes(app);
    });
  } catch (error) {
    logger.error("❌ Failed to connect to the database:");
    console.error(error);

    process.exit(1);
  }
};

app.use(arcjetMiddleware);

export const getIfUserIsOnline = (userId: string) => {
  return onlineUsers.has(userId) ? true : false;
};

io.on("connection", (socket) => {
  console.log("-----------------------");

  const userId = socket.handshake.auth.userId;
  if (!userId) {
    socket.disconnect();
    return;
  }

  onlineUsers.set(userId, socket.id);
  socket.join(String(userId));
  logger.info(`⚡ New client connected: ${socket.id}`);

  io.emit("onlineUsers", Array.from(onlineUsers.keys()));

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    onlineUsers.delete(userId);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});

app.use("/api/auth", authRouter);
app.use("/api/community", TokenGuard, communityRouter);
app.use("/api/chat", TokenGuard, chatRouter);
app.use("/api/user", TokenGuard, userRouter);

startServer();
