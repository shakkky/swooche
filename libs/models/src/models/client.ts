import { Client, ClientSchema } from "@swooche/schemas";
import mongoose, { Document, Model } from "mongoose";
import { zodToMongoose } from "../utils/zodToMongoose";

const ClientMongooseSchema = new mongoose.Schema(
  zodToMongoose(
    ClientSchema.omit({ _id: true, createdAt: true, updatedAt: true })
  ).obj,
  { timestamps: true }
);

ClientMongooseSchema.set("toJSON", {
  transform: (_, ret) => {
    ret._id = ret._id.toString();
    if (ret.createdAt) ret.createdAt = ret.createdAt.toISOString();
    if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toISOString();
    return ret;
  },
});

export interface ClientDocument extends Omit<Client, "_id">, Document {
  _id: mongoose.Types.ObjectId;
}

export const ClientModel: Model<ClientDocument> =
  mongoose.models.Client ||
  mongoose.model<ClientDocument>("Client", ClientMongooseSchema);
