import { PhoneNumber, PhoneNumberSchema } from "@swooche/schemas";
import mongoose, { Document, Model } from "mongoose";
import { zodToMongoose } from "../utils/zodToMongoose";

const PhoneNumberMongooseSchema = new mongoose.Schema(
  zodToMongoose(
    PhoneNumberSchema.omit({ _id: true, createdAt: true, updatedAt: true })
  ).obj,
  { timestamps: true }
);

PhoneNumberMongooseSchema.set("toJSON", {
  transform: (_, ret) => {
    ret._id = ret._id.toString();
    if (ret.createdAt) ret.createdAt = ret.createdAt.toISOString();
    if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toISOString();
    return ret;
  },
});

export interface PhoneNumberDocument
  extends Omit<PhoneNumber, "_id">,
    Document {
  _id: mongoose.Types.ObjectId;
}

export const PhoneNumberModel: Model<PhoneNumberDocument> =
  mongoose.models.PhoneNumber ||
  mongoose.model<PhoneNumberDocument>("PhoneNumber", PhoneNumberMongooseSchema);
