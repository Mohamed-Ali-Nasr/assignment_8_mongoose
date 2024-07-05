import express, { Router } from "express";
import book from "./book.route";
import author from "./author.route";

const router = express.Router();

export default (): Router => {
  book(router);

  author(router);

  return router;
};
