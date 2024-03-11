const express = require("express");

const router = express.Router();

const {
  getAllUser,
  addUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controller/user.controller");

router.get("/getById/:id", getUserById);
router.get("/getAll", getAllUser);
router.post("/add", addUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

module.exports = router;
