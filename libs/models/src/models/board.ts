import { Board, BoardSchema } from "@swooche/schemas";
import mongoose, { Document, Model } from "mongoose";
import { zodToMongoose } from "../utils/zodToMongoose";

const BoardMongooseSchema = new mongoose.Schema(
  zodToMongoose(
    BoardSchema.omit({ _id: true, createdAt: true, updatedAt: true })
  )
);

BoardMongooseSchema.set("toJSON", {
  transform: (_, ret) => {
    ret._id = ret._id.toString();
    if (ret.createdAt) ret.createdAt = ret.createdAt.toISOString();
    if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toISOString();
    return ret;
  },
});

export interface BoardDocument extends Omit<Board, "_id">, Document {
  _id: mongoose.Types.ObjectId;
}

export const BoardModel: Model<BoardDocument> =
  mongoose.models.Board ||
  mongoose.model<BoardDocument>("Board", BoardMongooseSchema);
