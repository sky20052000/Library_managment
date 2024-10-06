const mongoose = require("mongoose");
const bookShcema = new mongoose.Schema({
  book_title: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  status: { type: String, enum: ["Avaiable", "Borrowed"], default: "Avaiable" },
  borrowerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  created_by: { type: String, required: true },
  borrowDate: { type: Date, default: null },
  returnDate: { type: Date, default: null },
  createdAt: { type: Date },
  updatedAt: { type: Date, default: null },
});

module.exports = new mongoose.model("Book", bookShcema);
