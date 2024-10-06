const express = require("express");
const authController = require("../controller/authController");
const Authorize = require("../middleware/auth");
const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.userLogin);

/////// Member module creation by Librarian ///////////
authRouter.get("/getallmemberlist", Authorize([1]), authController.getMemberList); /// get all and active member list same api used in both case...
authRouter.delete("/delete_member/:_id", Authorize([1]), authController.deleteMember);
authRouter.get("/get_delete_member_list", Authorize([1]), authController.get_delete_member_list);
authRouter.patch("/update_member", Authorize([1]), authController.updateMember);



module.exports = authRouter;