import { Router } from "express";
import {
  createAuthor,
  deleteAuthor,
  getAllAuthors,
  getAuthorBooks,
  getAuthorById,
  getAuthorsPaginate,
  searchAuthorByName,
  updateAuthor,
} from "../controllers/author.controller";
import {
  createAuthorSchema,
  AuthorByIdSchema,
  updateAuthorSchema,
  PaginationSchema,
  searchAuthorSchema,
} from "../schemas/author.schema";
import { validationMiddleware } from "../middlewares/validation.middleware";

export default (router: Router) => {
  router.post(
    "/author",
    validationMiddleware(createAuthorSchema),
    createAuthor
  );

  router.get("/author", getAllAuthors);

  router.get(
    "/author/:authorId",
    validationMiddleware(AuthorByIdSchema),
    getAuthorById
  );

  router.patch(
    "/author/:authorId",
    validationMiddleware(updateAuthorSchema),
    updateAuthor
  );

  router.delete(
    "/author/:authorId",
    validationMiddleware(AuthorByIdSchema),
    deleteAuthor
  );

  router.get(
    "/author-paginate",
    validationMiddleware(PaginationSchema),
    getAuthorsPaginate
  );

  router.get(
    "/search-author",
    validationMiddleware(searchAuthorSchema),
    searchAuthorByName
  );

  router.get(
    "/author-books/:authorId",
    validationMiddleware(AuthorByIdSchema),
    getAuthorBooks
  );
};
