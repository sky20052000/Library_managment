const mongoose = require("mongoose");
const borrowBookShcema = new mongoose.Schema({

  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    default: null,
  },
  borrowDate: { type: Date,required:true },
  returnDate: { type: Date, default: null },
  createdAt: { type: Date },
  updatedAt: { type: Date, default: null },
});

module.exports = new mongoose.model("BorrowBook", borrowBookShcema);
