const express = require("express");

const router = express.Router();

const {
  getAllUser,
  addUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controller/user.controller");

router.get("/:id", getUserById);
router.get("/", getAllUser);
router.post("/", addUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
