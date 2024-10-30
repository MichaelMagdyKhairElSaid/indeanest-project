import express, { Request, Response, NextFunction } from "express";
import { config as configDotenv } from 'dotenv';
import mongodb_connection from "./database/mongo_connection.js";
import authRouter from "./modules/auth/auth.routes.js";
import { globalError } from "./utils/middleware/globalErrorHandel.js";
import AppError from "./utils/services/AppError.js";
import organizationRouter from "./modules/organization/organization.routes.js";
import redis from "./utils/services/redisService.js";

export const app = express();
const port = 3000;
const BaseUrl = "/api/v1";

configDotenv();
mongodb_connection();

app.use(express.json());

app.use(`${BaseUrl}/auth`, authRouter);
app.use(`${BaseUrl}/organization`, organizationRouter);
app.use(`${BaseUrl}/revoke-token`, organizationRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Invalid URL ${req.originalUrl}`, 404));
});

app.use(globalError);

// Graceful shutdown
process.on('SIGINT', () => {
  redis.quit().then(() => {
    console.log('Redis client disconnected');
    process.exit(0);
  });
});

app.listen(process.env.PORT || port, () => {
  console.log("server running on", port);
});
