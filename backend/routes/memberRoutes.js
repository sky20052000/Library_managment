const express = require("express");
const memberController = require("../controller/memberController");
const Authorize = require("../middleware/auth");
const memberRouter = express.Router();

memberRouter.post("/borrrow_book/:bookId" , Authorize([2]), memberController.borrowBook);
memberRouter.post("/return_borrrow_book/:bookId" , Authorize([2]), memberController.returnBorrowBook);
memberRouter.get("/view_available_book" , Authorize([2]), memberController.getAvaialabeBookList);
memberRouter.get("/view_borrowed_book" , Authorize([2]), memberController.getBorrowedBookList);
memberRouter.delete("/delete_account" , Authorize([2]), memberController.deleteAccount);



module.exports = memberRouter;