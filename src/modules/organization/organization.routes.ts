import express from "express";
import * as OrganizationController from "./organization.controller.js";
import { protectRoutes } from "../auth/auth.controller.js";

const organizationRouter = express.Router();

organizationRouter.route("/")
  .post(protectRoutes, OrganizationController.addOrg)
  .get(OrganizationController.getAllOrg);

organizationRouter.route("/:organization_id")
  .get(OrganizationController.getOrg)
  .put(protectRoutes, OrganizationController.updateOrg)
  .delete(protectRoutes, OrganizationController.deleteOrg);

organizationRouter.route("/:organization_id/invite")
  .post(protectRoutes, OrganizationController.inviteUserToOrg);

export default organizationRouter;
