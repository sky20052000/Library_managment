const Book = require("../models/bookModels");

const addBook = async (req, res) => {
  try {
    const { book_title, author } = req.body;
    if (!(book_title && author)) {
      return res
        .status(400)
        .json({ success: false, message: "Mandatory fields can't be empty!" });
    }
    let authorId = req.middleware._id;
    let bookcount = await Book.countDocuments({
      $or: [{ book_title }, { authorId }],
    });
    // console.log(usercount, "nn");
    if (bookcount > 0) {
      return res.status(400).send({
        status: false,
        message: "Book title already exists!",
      });
    }

    let saveData = {
      book_title,
      author,
      created_by: String(req.middleware._id),
      createdAt: new Date(),
    };
    await Book.create(saveData);
    return res
      .status(200)
      .json({ success: true, message: "Book added successfully!" });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const updateBook = async (req, res) => {
  try {
    const { bookId, book_title, author } = req.body;
    if (!(bookId, book_title && author)) {
      return res
        .status(400)
        .json({ success: false, message: "Mandatory fields can't be empty!" });
    }

    let updateData = {
      book_title,
      author,
      updatedAt: new Date(),
    };
    await Book.findByIdAndUpdate({ _id: bookId }, updateData, { new: true });
    return res
      .status(200)
      .json({ success: true, message: "Book updated successfully!" });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const getBookList = async (req, res) => {
  try {
    const bookList = await Book.find({});
    if (bookList.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No records found!" });
    }
    return res
      .status(200)
      .json({ success: true, dataCount: bookList.length, data: bookList });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params._id);
    return res
      .status(200)
      .json({ success: true, message: "Book deleted successfully!" });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const getAllBorrowedBookHistory = async (req, res) => {
  try {
    const borrowedBook = await Book.find({status:"Borrowed",created_by:req.middleware._id}).populate('borrowerId','username');
    if (borrowedBook.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No records found!" });
    }
    return res
      .status(200)
      .json({ success: true, dataCount: borrowedBook.length, data: borrowedBook });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};


const getAllRetrurnBookHistory = async (req, res) => {
  try {
    const returnBookList = await Book.find({status:"Avaiable", returnDate:{$ne:null}}).populate('borrowerId','username');
    if (returnBookList.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No records found!" });
    }
    return res
      .status(200)
      .json({ success: true, dataCount: returnBookList.length, data: returnBookList });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};



module.exports = {
  addBook,
  updateBook,
  deleteBook,
  getBookList,
  getAllBorrowedBookHistory,
  getAllRetrurnBookHistory
};
