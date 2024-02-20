const { User, Thoughts } = require("../models");

module.exports = {
  //get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //Get single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select("-__V")
        .populate(["friends", "thoughts"]);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //create new user
  async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      res.status(200).json(newUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //update user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        res.status(404).json({ message: "No users with this id!" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //delete user and assosciated thoughts
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });
      if (!user) {
        res.status(400).json({ message: "No user with this id!" });
      }
      res.status(200).json({ message: "User and thoughts are deleted" });

      await Thoughts.deleteMany({ _id: { $in: user.thoughts } });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //   POST to add a new friend to a user's friend list

  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //   DELETE to remove a friend from a user's friend list

  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.friendId });
      if (!user) {
        res.status(400).json({ message: "No user with this id!" });
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!updatedUser) {
        return res
          .status(400)
          .json({ message: "user deleted but not found in any friendlists!" });
      }
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
