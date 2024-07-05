import { RequestHandler } from "express";
import createHttpError from "http-errors";
import BookModel from "../models/book.model";
import AuthorModel from "../models/author.model";
import { IBook } from "../types/index.type";

export const createBook: RequestHandler = async (req, res, next) => {
  const { title, content } = req.body;
  const { authorId } = req.params;

  try {
    const existingTitle = await BookModel.findOne({
      title: title.toLowerCase(),
    });
    if (existingTitle) {
      throw createHttpError(
        400,
        "This Book Title Is Already Exist. Please Choose a Different One"
      );
    }

    const author = await AuthorModel.findById({ _id: authorId });
    if (!author) {
      throw createHttpError(404, "No Authors Found By This Id");
    }

    const newBook = new BookModel({ title, content, authorId });

    await newBook.save();

    (author?.booksId as string[]).push(newBook._id);

    await author?.save();

    res.status(201).json({ message: "Book Created Successfully", newBook });
  } catch (error) {
    next(error);
  }
};

export const getAllBooks: RequestHandler = async (req, res, next) => {
  try {
    const books = await BookModel.find();

    if (books.length < 1) {
      throw createHttpError(400, "There Is No Books Yet");
    }

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

export const getBooksByAuthorId: RequestHandler = async (req, res, next) => {
  const { authorId } = req.params;

  try {
    const author = await AuthorModel.findById({ _id: authorId });
    if (!author) {
      throw createHttpError(404, "No Authors Found By This Id");
    }

    const books = await BookModel.find({ authorId });

    if (books.length < 1) {
      throw createHttpError(400, "There Is No Books Found By This Author Id");
    }

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

export const getBookById: RequestHandler = async (req, res, next) => {
  const { authorId, bookId } = req.params;

  try {
    const author = await AuthorModel.findById({ _id: authorId });
    if (!author) {
      throw createHttpError(404, "No Authors Found By This Id");
    }

    const book = await BookModel.findById({ _id: bookId });
    if (!book) {
      throw createHttpError(400, "There Is No Book With This Id");
    }

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

export const updateBook: RequestHandler = async (req, res, next) => {
  const { title, content } = req.body;
  const { authorId, bookId } = req.params;

  try {
    const author = await AuthorModel.findById({ _id: authorId });
    if (!author) {
      throw createHttpError(404, "No Authors Found By This Id");
    }

    const updatedBook = await BookModel.findByIdAndUpdate(
      { _id: bookId },
      { title, content },
      { new: true }
    );

    if (!updatedBook) {
      throw createHttpError(404, "No Books Found By This Id");
    }

    await updatedBook.save();

    res.status(201).json({ message: "Book Updated Successfully", updatedBook });
  } catch (error) {
    next(error);
  }
};

export const deleteBook: RequestHandler = async (req, res, next) => {
  const { authorId, bookId } = req.params;

  try {
    const author = await AuthorModel.findById({ _id: authorId });
    if (!author) {
      throw createHttpError(404, "No Authors Found By This Id");
    }

    const deletedBook = await BookModel.findByIdAndDelete({ _id: bookId });

    if (!deletedBook) {
      throw createHttpError(404, "No Books Found By This Id");
    }

    author.booksId = (author.booksId as IBook[]).filter(
      (book) => book._id.toString() !== bookId
    );

    await author.save();

    res.status(201).json({ message: "Book Deleted Successfully", deletedBook });
  } catch (error) {
    next(error);
  }
};

export const getBooksPaginate: RequestHandler = async (req, res, next) => {
  const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 5;
  const page = parseInt(req.query.page as string) || 1;

  const skipAmount = (page - 1) * itemsPerPage;

  try {
    const books = await BookModel.find()
      .skip(skipAmount)
      .limit(itemsPerPage)
      .exec();

    if (books.length < 1) {
      throw createHttpError(400, "There Is No Books In This Page");
    }

    const count = await BookModel.countDocuments();
    const totalPages = Math.ceil(count / itemsPerPage);

    res.status(200).json({
      books,
      currentPage: page,
      itemsPerPage,
      totalPages,
      totalItems: count,
    });
  } catch (error) {
    next(error);
  }
};

export const searchBookByTitle: RequestHandler = async (req, res, next) => {
  const { title } = req.query;
  try {
    const books = await BookModel.find({
      title: { $regex: title, $options: "i" },
    });

    if (books.length < 1) {
      throw createHttpError(400, "There Is No Books With This Title");
    }

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};
