require("dotenv").config();
const User = require("../models/UserModel");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequest,
  NotFound,
  Unauthenticated,
} = require("../errors/customErrors");
const editUser = async (req, res) => {
  try {
    if (req.body.password || req.body.email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        Message: "email and password are immutable"
      })
    }
    const ownerId = req.decoded.id;
    const edited = await User.findOneAndUpdate(
      {
        _id: ownerId,
      },
      req.body,
      { new: true, runValidators: true }
    );
    if (!edited) {
      throw new NotFound(
        `Token Expired`
      );
    }
    return res.status(StatusCodes.CREATED).json({ Message: "Profile Updated" });
  }
  catch (error) {
    console.log("in edit error")
    return res.status(StatusCodes.BAD_REQUEST).json({ Message: error.Message })
  }
};
const editNotification = async (req, res) => {
  try {
    const { index } = req.body
    const ownerId = req.decoded.id;
    const user = await User.findOne({ _id: ownerId })
    const pullNotifications = user.notification
    console.log(user);
    if (index >= pullNotifications.length) {
      throw new BadRequest("You cannot remove at an index greater than array length")
    }
    pullNotifications.splice(index, 1)
    const edited = await User.findOneAndUpdate(
      {
        _id: ownerId,
      },
      { notification: pullNotifications },
      { new: true, runValidators: true }
    );
    if (!edited) {
      throw new NotFound(
        `Token Expired`
      );
    }
    return res.status(StatusCodes.CREATED).json({ Message: "Profile Updated" });
  }
  catch (error) {
    console.log("in edit error")
    return res.status(StatusCodes.BAD_REQUEST).json({ Message: error.Message })
  }
};

const deleteUser = async (req, res) => {
  try {
    const ownerId = req.params.id;
    if (req.decoded.id !== ownerId) {
      throw new Unauthenticated("You can only delete your own account");
    }
    const deleted = await User.findOneAndDelete(
      {
        _id: ownerId,
      }
    );
    if (!deleted) {
      throw new NotFound(
        `user not found`
      );
    }
    return res.status(StatusCodes.OK).json({ Message: `deleted ${deleted.name}'s account successfully` });
  }
  catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json({ Message: error.Message })
  }
};
const getUser = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const deleted = await User.findOneAndDelete(
      {
        _id: ownerId,
      }
    );
    if (!deleted) {
      throw new NotFound(
        `user not found`
      );
    }
    return res.status(StatusCodes.OK).json({ Message: `deleted ${deleted.name}'s account successfully` });
  }
  catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json({ Message: error.Message })
  }
};
module.exports = { editUser, deleteUser, editNotification }
