const User = require("../models/userModels");
const Validator = require("validator");
const bcrypt = require("bcrypt");

/////////////// Register as LIBRARIAN and MEMBER  //////
const GenerateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    //   console.log(admin,"<>")
    const accessToken = await user.GenerateAccessToken();
    const refreshToken = await user.GenerateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error, "bb");
  }
};


const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!(username && email && password && role)) {
      return res
        .status(400)
        .json({ success: false, message: "Mandatory fields can't be empty!" });
    }
    // validateEmail
    const validateEmail = Validator.isEmail(email);
    if (!validateEmail) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    let usercount = await User.countDocuments({
      $or: [{ username }, { email }],
    });
    // console.log(usercount, "nn");
    if (usercount > 0) {
      return res.status(400).send({
        status: false,
        message: "Duplicate entry!",
      });
    }

    let saveData = {
      username,
      email,
      password,
      role: String(role),
      createdAt: new Date()
    };
    // console.log(saveData,"ssssssssssssss")
    await User.create(saveData);
    return res
      .status(200)
      .json({ success: true, message: "User added successfully!" });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { username,email, password } = req.body;
    if (!(username && email && password)) {
      return res.status(400).json({
        success: false,
        message: "Mandatory fields can not be epmty!",
      });
    }
    // validate email
    const validateEmail = Validator.isEmail(email);
    if (!validateEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email!" });
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exists" });
    }
    // compare password
    const validatePassword = await user.comparePassword(password);
    if (!validatePassword) {
      return res
        .status(400)
        .json({ sucess: false, message: "Incorrct passowrd!" });
    }

    const { accessToken, refreshToken } =
      await GenerateAccessTokenAndRefreshToken(user._id);
    let userData = {
      _id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
    };
  
    return res
      .status(200)
      .json({ sucess: true, userData, accessToken, refreshToken });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};


////////////////////Member module ////////////////////
const getMemberList = async (req, res) => {
  try {
    let matchData = { role:"2"};
    const memberList = await User.find(matchData);
    if (memberList.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No records found!" });
    }
    return res
      .status(200)
      .json({ success: true, dataCount: memberList.length, data: memberList });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const get_delete_member_list = async (req, res) => {
  try {
     let matchData = {status:"DELETED"}
    const getList = await User.find(matchData)
    if(!getList){
       return res.status(400).json({success:success, message:"No records found!"})
    }
    return res
      .status(200)
      .json({ success: true,data:getList });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};


const deleteMember = async (req, res) => {
  try {
    const member = await User.findByIdAndUpdate(req.params._id,{ status: 'DELETED' }, { new: true });
    if(!member){
       return res.status(404).json({success:false, message:"Member not found!"})
    }
    return res
      .status(200)
      .json({ success: true, message: "Member deleted successfully!" });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const updateMember = async (req, res) => {
  try {
    const { memberId,username,role  } = req.body;
    if (!(memberId && username)) {
      return res
        .status(400)
        .json({ success: false, message: "Mandatory fields can't be empty!" });
    }

    let updateData = {
      username,
      role,
      updatedAt: new Date(),
    };
    await User.findByIdAndUpdate({ _id: memberId }, updateData, { new: true });
    return res
      .status(200)
      .json({ success: true, message: "Member updated successfully!" });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};



module.exports = {
  register,
  userLogin,
  getMemberList,
  deleteMember,
  get_delete_member_list,
  updateMember
};
