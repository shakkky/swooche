import { Device, DeviceSchema } from "@swooche/schemas";
import mongoose, { Document, Model } from "mongoose";
import { zodToMongoose } from "../utils/zodToMongoose";

const DeviceMongooseSchema = new mongoose.Schema(
  zodToMongoose(
    DeviceSchema.omit({ _id: true, createdAt: true, updatedAt: true })
  ).obj,
  { timestamps: true }
);

DeviceMongooseSchema.set("toJSON", {
  transform: (_, ret) => {
    ret._id = ret._id.toString();
    if (ret.createdAt) ret.createdAt = ret.createdAt.toISOString();
    if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toISOString();
    return ret;
  },
});

export interface DeviceDocument extends Omit<Device, "_id">, Document {
  _id: mongoose.Types.ObjectId;
}

export const DeviceModel: Model<DeviceDocument> =
  mongoose.models.Device ||
  mongoose.model<DeviceDocument>("Device", DeviceMongooseSchema);
