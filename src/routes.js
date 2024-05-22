import {
  getAllBooksHandler,
  addBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} from "./routesHandler.js"

const routes = [
  {
    method: "GET",
    path: "/books",
    handler: getAllBooksHandler,
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: getBookByIdHandler,
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: editBookByIdHandler,
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: deleteBookByIdHandler,
  },
  {
    method: "POST",
    path: "/books",
    handler: addBookHandler,
  },
  {
    method: "*",
    path: "/{any*}",
    handler: () => "Page Not Found :(",
  },
]

export default routes
