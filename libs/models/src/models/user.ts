import { User, UserSchema } from "@swooche/schemas";
import mongoose, { Document, Model } from "mongoose";
import { zodToMongoose } from "../utils/zodToMongoose";

const UserMongooseSchema = new mongoose.Schema(
  zodToMongoose(
    UserSchema.omit({ _id: true, createdAt: true, updatedAt: true })
  )
);

UserMongooseSchema.set("toJSON", {
  transform: (_, ret) => {
    ret._id = ret._id.toString();
    if (ret.createdAt) ret.createdAt = ret.createdAt.toISOString();
    if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toISOString();
    return ret;
  },
});

export interface UserDocument extends Omit<User, "_id">, Document {
  _id: mongoose.Types.ObjectId;
}

export const UserModel: Model<UserDocument> =
  mongoose.models.User ||
  mongoose.model<UserDocument>("User", UserMongooseSchema);
