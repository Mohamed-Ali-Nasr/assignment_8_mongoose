import Joi from "joi";
import { objectIdRule } from "../utils/validateRule.util";

export const createAuthorSchema = {
  body: Joi.object({
    name: Joi.string()
      .pattern(/^([A-Z]|[a-z]){3,}((\s+|\W|_)\w+)*$/)
      .required()
      .messages({
        "string.pattern.base":
          "The Name Must Start With At Least Three Alphabet Letters",
      }),

    bio: Joi.string().min(10).optional(),

    birthDate: Joi.date().optional(),
  }),
};

export const updateAuthorSchema = {
  body: createAuthorSchema.body,

  params: Joi.object({
    authorId: Joi.string().custom(objectIdRule).required(),
  }),
};

export const AuthorByIdSchema = {
  params: updateAuthorSchema.params,
};

export const PaginationSchema = {
  query: Joi.object({
    page: Joi.string()
      .pattern(/^(. *[^0-9]|)(1000|[1-9]\d{0,2})([^0-9]. *|)$/)
      .required()
      .messages({
        "string.pattern.base": "Page Must Be A Valid Number",
        "any.required": "Page Query Is Required",
      }),

    itemsPerPage: Joi.string()
      .pattern(/^(. *[^0-9]|)(1000|[1-9]\d{0,2})([^0-9]. *|)$/)
      .required()
      .messages({
        "string.pattern.base": "itemsPerPage Must Be A Valid Number",
        "any.required": "itemsPerPage Query Is Required",
      }),
  }),
};

export const searchAuthorSchema = {
  query: Joi.object({
    name: Joi.string().required().messages({
      "any.required": "Name Query Is Required",
    }),
  }),
};
