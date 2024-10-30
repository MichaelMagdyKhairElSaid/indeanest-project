import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../../utils/middleware/catchAsyncError.js";
import organizationModel from "../../database/models/organization.model.js";
import AppError from "../../utils/services/AppError.js";
import userModel from "../../database/models/user.model.js";

// interface InviteUserRequest extends Request {
//   params: { organization_id: string };
//   body: { user_email: string };
// }

// interface OrganizationRequest extends Request {
//   params: { organization_id: string };
// }

export const addOrg = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const newOrg = await organizationModel.create({ ...req.body });
  if (!newOrg) return next(new AppError("Failed to create new organization", 401));
  res.status(201).json({ organization_id: newOrg._id });
});

interface OrganizationRequest extends Request {
  params: { organization_id: string };
}

export const getOrg = catchAsyncError(async (req: Request, res: Response) => {
  const { organization_id } = req.params;
  const result = await organizationModel.findById(organization_id ).populate("organization_members");
  res.status(201).json({ message: "Done", result });
});

export const getAllOrg = catchAsyncError(async (_req: Request, res: Response) => {
  const result = await organizationModel.find().populate("organization_members", "email name access_level -_id");
  res.status(200).json({ message: "Done", result });
});

export const updateOrg = catchAsyncError(async (req: Request, res: Response) => {
  const { organization_id } = req.params;
  const result = await organizationModel.findByIdAndUpdate(organization_id, req.body, { new: true });
  res.status(200).json({ message: "Done", result });
});

export const deleteOrg = catchAsyncError(async (req: Request, res: Response) => {
  const { organization_id } = req.params;
  await organizationModel.findByIdAndDelete(organization_id);
  res.status(204).json({ message: "Organization deleted" });
});

export const inviteUserToOrg = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { organization_id } = req.params;
  const { user_email } = req.body;
  const user = await userModel.findOne({ email: user_email });

  if (!user) return next(new AppError("User not found", 401));

  const result = await organizationModel.findByIdAndUpdate(
    organization_id,
    { $addToSet: { organization_members: user._id } },
    { new: true }
  );
  if (!result) return next(new AppError("Failed to invite user", 401));

  res.status(201).json({ message: "User invited successfully" });
});
