import { Account, AccountSchema } from "@swooche/schemas";
import mongoose, { Document, Model } from "mongoose";
import { zodToMongoose } from "../utils/zodToMongoose";

const AccountMongooseSchema = new mongoose.Schema(
  zodToMongoose(
    AccountSchema.omit({ _id: true, createdAt: true, updatedAt: true })
  )
);

AccountMongooseSchema.set("toJSON", {
  transform: (_, ret) => {
    ret._id = ret._id.toString();
    if (ret.createdAt) ret.createdAt = ret.createdAt.toISOString();
    if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toISOString();
    return ret;
  },
});

export interface AccountDocument extends Omit<Account, "_id">, Document {
  _id: mongoose.Types.ObjectId;
}

export const AccountModel: Model<AccountDocument> =
  mongoose.models.Account ||
  mongoose.model<AccountDocument>("Account", AccountMongooseSchema);
