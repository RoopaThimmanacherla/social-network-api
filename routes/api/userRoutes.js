const router = require("express").Router();

const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../../controller/userController");

//  api/users

router.route("/").get(getUsers).post(createUser);

//   /api/users/:userId/

router.route("/:userId").get(getSingleUser).put(updateUser).delete(deleteUser);

//  api/users/:userId/friends/:friendId

router.route("/:userId/friends/").put(addFriend);

router.route("/:userId/friends/:friendId").delete(removeFriend);

module.exports = router;
