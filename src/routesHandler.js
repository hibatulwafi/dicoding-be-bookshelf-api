import { nanoid } from "nanoid"
import books from "./books.js"

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query

  if (!name && !reading && !finished) {
    // no query found
    const response = h
      .response({
        status: "success",
        data: {
          books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200)

    return response
  }

  if (name) {
    const filteredBooksName = books.filter((book) => {
      // if there is a query name
      const nameRegex = new RegExp(name, "gi")
      return nameRegex.test(book.name)
    })

    const response = h
      .response({
        status: "success",
        data: {
          books: filteredBooksName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200)

    return response
  }

  if (reading) {
    // if there is a query reading
    const filteredBooksReading = books.filter(
      (book) => Number(book.reading) === Number(reading),
    )

    const response = h
      .response({
        status: "success",
        data: {
          books: filteredBooksReading.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200)

    return response
  }

  // if there is a query finished
  const filteredBooksFinished = books.filter(
    (book) => Number(book.finished) === Number(finished),
  )

  const response = h
    .response({
      status: "success",
      data: {
        books: filteredBooksFinished.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
    .code(200)

  return response
}

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload

  if (!name) {
    // The client doesn't attach the name property to the request body
    const response = h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400)
    return response
  }

  if (readPage > pageCount) {
    // The client attaches a value of the read Page property that is greater than the value of the pageCount property
    const response = h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400)
    return response
  }

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  }

  books.push(newBook) // push to books array

  const isSuccess = books.filter((note) => note.id === id).length > 0
  // checking if newBook pushed

  if (isSuccess) {
    // If the book is successfully added
    const response = h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      })
      .code(201)
    return response
  }

  // The server failed to load the book due to a generic error.
  const response = h
    .response({
      status: "error",
      message: "Buku gagal ditambahkan",
    })
    .code(500)
  return response
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((n) => n.id === bookId)[0]
  // check and look for book by id

  if (book) {
    // When the book with the attached id is found
    const response = h
      .response({
        status: "success",
        data: {
          book,
        },
      })
      .code(200)
    return response
  }

  // When the book with the id attached by the client is not found
  const response = h
    .response({
      status: "fail",
      message: "Buku tidak ditemukan",
    })
    .code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload

  if (!name) {
    // The client doesn't attach the name property to the request body
    const response = h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400)
    return response
  }

  if (readPage > pageCount) {
    // The client attaches a value of the read Page property that is greater than the value of the pageCount property
    const response = h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400)
    return response
  }

  const finished = pageCount === readPage
  const updatedAt = new Date().toISOString()

  const index = books.findIndex((note) => note.id === bookId)
  // check and look for book by id

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    }

    // When the book is updated successfully
    const response = h
      .response({
        status: "success",
        message: "Buku berhasil diperbarui",
      })
      .code(200)
    return response
  }

  // id attached by the client is not found by the server
  const response = h
    .response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    })
    .code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((note) => note.id === bookId)
  // check and look for book by id

  if (index !== -1) {
    books.splice(index, 1)

    // If id belongs to one of the books
    const response = h
      .response({
        status: "success",
        message: "Buku berhasil dihapus",
      })
      .code(200)
    return response
  }

  // If the id attached is not owned by any book
  const response = h
    .response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    })
    .code(404)
  return response
}

export {
  getAllBooksHandler,
  addBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
}
