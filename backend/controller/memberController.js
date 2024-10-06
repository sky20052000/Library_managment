const Book = require("../models/bookModels");
const BorrowBook = require("../models/borrowBookModels");
const User = require("../models/userModels");

const borrowBook = async (req, res) => {
  try {
     const findBook  = await Book.findById(req.params.bookId)
     console.log(findBook,"findBook")
    if (!findBook || findBook.status ==="Borrowed") {
      return res
        .status(400)
        .json({ success: false, message: "Book is not avaible to borrow!" });
    }
    findBook.status = "Borrowed";
    findBook.borrowerId = req.middleware._id;
    findBook.borrowDate = new Date()

    await findBook.save();
    const borrowBook = new BorrowBook({memberId:req.middleware._id,bookId:findBook._id, borrowDate:new Date()});
    await borrowBook.save();
    
    return res
      .status(200)
      .json({ success: true, message: "Book borrowed successfully!" });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const returnBorrowBook = async (req, res) => {
    try {
       const findBook  = await Book.findById(req.params.bookId)
       console.log(findBook,"findBook")
      if (!findBook || findBook.status ==="Avaiable") {
        return res
          .status(400)
          .json({ success: false, message: "Book is already returned!" });
      }
      findBook.status = "Avaiable";
      findBook.returnDate = new Date()
  
      await findBook.save();
      const borrowBook = await BorrowBook.findOne({memberId:req.middleware._id,bookId:findBook._id, returnDate:null});
      console.log(borrowBook,"borrow")
      if(borrowBook){
           borrowBook.returnDate = new Date();
           await borrowBook.save()
      }
      
      return res
        .status(200)
        .json({ success: true, message: "Book returned successfully!" });
    } catch (e) {
      console.log(e, "nn");
      return res
        .status(500)
        .json({ sucess: false, message: "Something went wrong!" });
    }
  };

const getAvaialabeBookList = async (req, res) => {
  try {
    let matchData = {status:"Avaiable"}
    const bookList = await Book.find(matchData);
    if (bookList.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No records found!" });
    }
    return res
      .status(200)
      .json({ success: true, dataCount: bookList.length, avaialabeBookList: bookList });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};


const getBorrowedBookList = async (req, res) => {
    try {
      let userId  = req.middleware._id
      const borrower = await Book.find({borrowerId:userId , status:"Borrowed"});
      if (borrower.length === 0) {
        return res
          .status(200)
          .json({ success: true, message: "No records found!" });
      }
      return res
        .status(200)
        .json({ success: true, dataCount: borrower.length, borrowerBook:borrower  });
    } catch (e) {
      console.log(e, "nn");
      return res
        .status(500)
        .json({ sucess: false, message: "Something went wrong!" });
    }
  };
const deleteAccount = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.middleware._id);
    return res
      .status(200)
      .json({ success: true, message: "Account deleted successfully!" });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

module.exports = {
    borrowBook,
    returnBorrowBook,
    getAvaialabeBookList,
    getBorrowedBookList,
    deleteAccount

};
