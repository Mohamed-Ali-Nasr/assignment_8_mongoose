import Joi from "joi";
import { objectIdRule } from "../utils/validateRule.util";

export const createBookSchema = {
  body: Joi.object({
    title: Joi.string().min(5).required(),

    content: Joi.string().min(10).required(),
  }),

  params: Joi.object({
    authorId: Joi.string().custom(objectIdRule).required(),
  }),
};

export const authorBookSchema = {
  params: Joi.object({
    authorId: Joi.string().custom(objectIdRule).required(),

    bookId: Joi.string().custom(objectIdRule).required(),
  }),
};

export const updateBookSchema = {
  body: createBookSchema.body,

  params: authorBookSchema.params,
};

export const searchBookSchema = {
  query: Joi.object({
    title: Joi.string().required().messages({
      "any.required": "Title Query Is Required",
    }),
  }),
};
