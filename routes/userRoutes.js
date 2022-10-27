const { register, login, setProfilePic, allUsers } = require("../controllers/userController");


const router = require("express").Router();

router.post("/register" , register);
router.post("/login" , login);
router.put("/setProfilePic" , setProfilePic);
router.get("/allusers/:id" , allUsers);

module.exports = router;