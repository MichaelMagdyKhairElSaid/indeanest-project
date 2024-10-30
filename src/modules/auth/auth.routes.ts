import express from "express";
import * as authController from "./auth.controller.js";

const authRouter = express.Router();

authRouter.route("/signup").post(authController.signup);
authRouter.route("/signIn").post(authController.signIn);
authRouter.route("/refresh-token").post(authController.refresh_token);
authRouter.route("/revoke-token").post(authController.protectRoutes, authController.revokedRefreshToken);

export default authRouter;
