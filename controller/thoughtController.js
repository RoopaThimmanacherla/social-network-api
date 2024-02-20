const { User, Thoughts } = require("../models");

module.exports = {
  // method to get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thoughts.find();
      if (!thoughts) {
        res.status(400).json({ message: "No thoughts found!" });
      }
      res.status(200).json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //method to get single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thoughts.findOne({ _id: req.params.thoughtId });
      if (!thought) {
        res.status(400).json({ message: "No thought found!" });
      }
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //method to create a thought
  async createThought(req, res) {
    try {
      const thought = await Thoughts.create(req.body);

      const userupdate = await User.findOneAndUpdate(
        { username: req.body.username },
        { $addToSet: { thoughts: thought._id } },
        { runValidators: true, new: true }
      );
      if (!userupdate) {
        res
          .status(400)
          .json({ message: "couldnit find user to update thought" });
      }
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //method to update thought based on id
  async updateThought(req, res) {
    try {
      const thought = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thought) {
        res.status(400).json({ message: "no thought with the id!" });
      }
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // method to delete thought based on id and update the user to pull the deleted thought from thoughts array
  async deleteThought(req, res) {
    try {
      const thought = await Thoughts.findOneAndRemove({
        _id: req.params.thoughtId,
      });
      if (!thought) {
        res.status(400).json({ message: "couldnt find thought with this id!" });
      }
      const updateUser = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );
      if (!updateUser) {
        res.status(200).json({
          message: "Thought is deleted but it is not embedded in the user",
        });
      }
      res.status(200).json(updateUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // method to add reaction and link to the thought
  async addReaction(req, res) {
    try {
      const thought = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        res.status(400).json({ message: "No thought found with this id!" });
      }
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // method to remove reaction based on the thought id provided and pulling the reaction from the reaction array based on reactionid
  async removeReaction(req, res) {
    try {
      const thought = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        res.status(400).json({ message: "No thought found" });
      }
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
