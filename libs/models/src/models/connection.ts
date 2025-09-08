import { Connection, ConnectionSchema } from "@swooche/schemas";
import mongoose, { Document, Model } from "mongoose";
import { zodToMongoose } from "../utils/zodToMongoose";

const ConnectionMongooseSchema = new mongoose.Schema(
  zodToMongoose(
    ConnectionSchema.omit({ _id: true, createdAt: true, updatedAt: true })
  )
);

ConnectionMongooseSchema.set("toJSON", {
  transform: (_, ret) => {
    ret._id = ret._id.toString();
    if (ret.createdAt) ret.createdAt = ret.createdAt.toISOString();
    if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toISOString();
    return ret;
  },
});

export interface ConnectionDocument extends Omit<Connection, "_id">, Document {
  _id: mongoose.Types.ObjectId;
}

export const ConnectionModel: Model<ConnectionDocument> =
  mongoose.models.Connection ||
  mongoose.model<ConnectionDocument>("Connection", ConnectionMongooseSchema);
