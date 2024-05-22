import { nanoid } from "nanoid";
import books from "./books.js";

const getAllBooksHandler = (request, handler) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name) {
    const nameRegex = new RegExp(name, "gi");
    filteredBooks = filteredBooks.filter((book) => nameRegex.test(book.name));
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) => Number(book.reading) === Number(reading));
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter((book) => Number(book.finished) === Number(finished));
  }

  const response = handler
    .response({
      status: "success",
      data: {
        books: filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher })),
      },
    })
    .code(200);

  return response;
};

const addBookHandler = (request, handler) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    return handler
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return handler
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.some((book) => book.id === id);

  if (isSuccess) {
    return handler
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: { bookId: id },
      })
      .code(201);
  }

  return handler
    .response({
      status: "error",
      message: "Buku gagal ditambahkan",
    })
    .code(500);
};

const getBookByIdHandler = (request, handler) => {
  const { bookId } = request.params;
  const book = books.find((book) => book.id === bookId);

  if (book) {
    return handler
      .response({
        status: "success",
        data: { book },
      })
      .code(200);
  }

  return handler
    .response({
      status: "fail",
      message: "Buku tidak ditemukan",
    })
    .code(404);
};

const editBookByIdHandler = (request, handler) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    return handler
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return handler
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name, year, author, summary, publisher, pageCount, readPage, reading, finished, updatedAt,
    };

    return handler
      .response({
        status: "success",
        message: "Buku berhasil diperbarui",
      })
      .code(200);
  }

  return handler
    .response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    })
    .code(404);
};

const deleteBookByIdHandler = (request, handler) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    return handler
      .response({
        status: "success",
        message: "Buku berhasil dihapus",
      })
      .code(200);
  }

  return handler
    .response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    })
    .code(404);
};

export {
  getAllBooksHandler,
  addBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
