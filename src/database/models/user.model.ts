import  { Document, Schema, model } from "mongoose";
// import bcrypt from "bcrypt";

// Define an interface for the user document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  access_level: "read-only" | "read-write";
}

// Create the schema
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    trim: true,
    required: [true, "name is required"],
    minLength: [2, "name is too short"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "email is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  access_level: {
    type: String,
    enum: ["read-only", "read-write"],
    default: "read-only",
  },
});

// Add a pre-save hook to hash the password
// userSchema.pre<IUser>("save", function (this:any,next: () => void ) {
//   if (this.isModified("password") && this.password) {
//     const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);
//     this.password = bcrypt.hashSync(this.password, saltRounds);
//   }
//   next();
// });

// Create and export the model
const UserModel = model<IUser>("User", userSchema);
export default UserModel;