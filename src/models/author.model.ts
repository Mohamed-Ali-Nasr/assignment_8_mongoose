import { Schema, Document, model } from "mongoose";
import { IAuthor } from "../types/index.type";

const AuthorSchema: Schema = new Schema({
  name: { type: String, required: true },

  bio: { type: String },

  birthDate: { type: Date },

  booksId: [{ type: Schema.Types.ObjectId, ref: "Book" }],
});

export type IAuthorSchema = Document & IAuthor;

export default model<IAuthorSchema>("Author", AuthorSchema);
