import { Router } from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBooksByAuthorId,
  getBookById,
  getBooksPaginate,
  searchBookByTitle,
  updateBook,
} from "../controllers/book.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import {
  authorBookSchema,
  createBookSchema,
  searchBookSchema,
  updateBookSchema,
} from "../schemas/book.schema";
import { AuthorByIdSchema, PaginationSchema } from "../schemas/author.schema";

export default (router: Router) => {
  router.get("/book", getAllBooks);

  router.post(
    "/author/:authorId/book",
    validationMiddleware(createBookSchema),
    createBook
  );

  router.get(
    "/author/:authorId/book",
    validationMiddleware(AuthorByIdSchema),
    getBooksByAuthorId
  );

  router.get(
    "/author/:authorId/book/:bookId",
    validationMiddleware(authorBookSchema),
    getBookById
  );

  router.patch(
    "/author/:authorId/book/:bookId",
    validationMiddleware(updateBookSchema),
    updateBook
  );

  router.delete(
    "/author/:authorId/book/:bookId",
    validationMiddleware(authorBookSchema),
    deleteBook
  );

  router.get(
    "/book-paginate",
    validationMiddleware(PaginationSchema),
    getBooksPaginate
  );

  router.get(
    "/search-book",
    validationMiddleware(searchBookSchema),
    searchBookByTitle
  );
};
