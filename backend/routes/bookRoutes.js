const express = require("express");
const bookController = require("../controller/bookController");
const Authorize = require("../middleware/auth");
const bookRouter = express.Router();

bookRouter.post("/add_book" , Authorize([1]), bookController.addBook);
bookRouter.put("/update_book", Authorize([1]), bookController.updateBook);
bookRouter.delete("/delete_book/:_id", Authorize([1]), bookController.deleteBook);
bookRouter.get("/book_list", Authorize([1,2]), bookController.getBookList);
bookRouter.get("/get_all_borrowed_book", Authorize([1]), bookController.getAllBorrowedBookHistory);
bookRouter.get("/get_all_retrun_book", Authorize([1]), bookController.getAllRetrurnBookHistory);



module.exports = bookRouter;