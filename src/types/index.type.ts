export type IBook = {
  _id: string;
  title: string;
  content: string;
  authorId: string | IAuthor;
  publishedDate: Date;
};

export type IAuthor = {
  _id: string;
  name: string;
  bio: string;
  booksId: string[] | IBook[];
  birthDate: Date;
};
