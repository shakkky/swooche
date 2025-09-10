import { ClickupTask, ClickupTaskSchema } from "@swooche/schemas";
import mongoose, { Document, Model } from "mongoose";
import { zodToMongoose } from "../../utils/zodToMongoose";

const ClickupTaskMongooseSchema = new mongoose.Schema(
  zodToMongoose(
    ClickupTaskSchema.omit({ _id: true, createdAt: true, updatedAt: true })
  )
);

ClickupTaskMongooseSchema.set("toJSON", {
  transform: (_, ret) => {
    ret._id = ret._id.toString();
    if (ret.createdAt) ret.createdAt = ret.createdAt.toISOString();
    if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toISOString();
    return ret;
  },
});

export interface ClickupTaskDocument
  extends Omit<ClickupTask, "_id">,
    Document {
  _id: mongoose.Types.ObjectId;
}

export const ClickupTaskModel: Model<ClickupTaskDocument> =
  mongoose.models.ClickupTask ||
  mongoose.model<ClickupTaskDocument>("ClickupTask", ClickupTaskMongooseSchema);
