import { Schema, Document, model } from "mongoose";
import { IBook } from "../types/index.type";

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },

  content: { type: String, required: true },

  authorId: { type: Schema.Types.ObjectId, ref: "Author" },

  publishedDate: { type: Date, default: Date.now() },
});

export type IBookSchema = Document & IBook;

export default model<IBookSchema>("Book", BookSchema);
