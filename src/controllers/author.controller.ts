import { RequestHandler } from "express";
import createHttpError from "http-errors";
import AuthorModel from "../models/author.model";
import BookModel from "../models/book.model";

export const createAuthor: RequestHandler = async (req, res, next) => {
  const { name, bio, birthDate } = req.body;

  try {
    const existingName = await AuthorModel.findOne({
      name: name.toLowerCase(),
    });
    if (existingName) {
      throw createHttpError(
        400,
        "This Author Name Is Already Exist. Please Choose a Different One"
      );
    }

    const newAuthor = new AuthorModel({ name, bio, birthDate });

    await newAuthor.save();

    res.status(201).json({ message: "Author Created Successfully", newAuthor });
  } catch (error) {
    next(error);
  }
};

export const getAllAuthors: RequestHandler = async (req, res, next) => {
  try {
    const authors = await AuthorModel.find();

    if (authors.length < 1) {
      throw createHttpError(400, "There Is No Authors Yet");
    }

    res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
};

export const getAuthorById: RequestHandler = async (req, res, next) => {
  const { authorId } = req.params;

  try {
    const author = await AuthorModel.findById({ _id: authorId });

    if (!author) {
      throw createHttpError(400, "There Is No Author With This Id");
    }

    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
};

export const updateAuthor: RequestHandler = async (req, res, next) => {
  const { name, bio, birthDate } = req.body;
  const { authorId } = req.params;

  try {
    const updatedAuthor = await AuthorModel.findByIdAndUpdate(
      { _id: authorId },
      { name, bio, birthDate },
      { new: true }
    );

    if (!updatedAuthor) {
      throw createHttpError(404, "No Authors Found By This Id");
    }

    await updatedAuthor.save();

    res
      .status(201)
      .json({ message: "Author Updated Successfully", updatedAuthor });
  } catch (error) {
    next(error);
  }
};

export const deleteAuthor: RequestHandler = async (req, res, next) => {
  const { authorId } = req.params;

  try {
    const deletedAuthor = await AuthorModel.findByIdAndDelete({
      _id: authorId,
    });

    if (!deletedAuthor) {
      throw createHttpError(404, "No Authors Found By This Id");
    }

    const authorBooks = await BookModel.find({ authorId });
    authorBooks.forEach(async (book) => {
      await book.deleteOne();
    });

    res
      .status(201)
      .json({ message: "Author Deleted Successfully", deletedAuthor });
  } catch (error) {
    next(error);
  }
};

export const getAuthorsPaginate: RequestHandler = async (req, res, next) => {
  const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 5;
  const page = parseInt(req.query.page as string) || 1;

  const skipAmount = (page - 1) * itemsPerPage;

  try {
    const authors = await AuthorModel.find()
      .skip(skipAmount)
      .limit(itemsPerPage)
      .exec();

    if (authors.length < 1) {
      throw createHttpError(400, "There Is No Authors In This Page");
    }

    const count = await AuthorModel.countDocuments();
    const totalPages = Math.ceil(count / itemsPerPage);

    res.status(200).json({
      authors,
      currentPage: page,
      itemsPerPage,
      totalPages,
      totalItems: count,
    });
  } catch (error) {
    next(error);
  }
};

export const searchAuthorByName: RequestHandler = async (req, res, next) => {
  const { name } = req.query;
  try {
    const authors = await AuthorModel.find({
      name: { $regex: name, $options: "i" },
    });

    if (authors.length < 1) {
      throw createHttpError(400, "There Is No Authors With This Name");
    }

    res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
};

export const getAuthorBooks: RequestHandler = async (req, res, next) => {
  const { authorId } = req.params;

  try {
    const author = await AuthorModel.findById({ _id: authorId }).populate([
      {
        path: "booksId",
        model: BookModel,
        select: "_id title content publishedDate",
      },
    ]);

    if (!author) {
      throw createHttpError(400, "There Is No Author With This Id");
    }

    if (author!.booksId.length < 1) {
      throw createHttpError(400, "There Is No Books By This Author Yet");
    }

    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
};
