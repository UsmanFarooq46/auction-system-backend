const express=require("express");
const router=express.Router();
const definitionsController=require("./../../controllers/admin/definitions")
const authVerify=require("./../../../middleware/auth_check");

router.post('/teacher',authVerify.isAdmin,definitionsController.addTeacher,)

module.exports=router