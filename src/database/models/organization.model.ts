import mongoose, { Document, Schema, model } from "mongoose";

// Define an interface for the organization document
interface IOrganization extends Document {
  name: string;
  description: string;
  organization_members: mongoose.Types.ObjectId[];
}

// Create the schema
const organizationSchema = new Schema<IOrganization>({
  name: {
    type: String,
    trim: true,
    required: [true, "name is required"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  organization_members: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

// Create and export the model
const OrganizationModel = model<IOrganization>("Org", organizationSchema);
export default OrganizationModel;