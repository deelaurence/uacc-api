require("dotenv").config();
const User = require("../models/UserModel");
const bcrypt = require('bcryptjs')
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

const editPassword = async (req, res) => {
  const seedPhrase = req.body.seedPhrase
  try {
    if (!req.body.password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        Message: "password field cannot be empty"
      })
    }
    if (!req.body.email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        Message: "email field cannot be empty"
      })
    }
    if (!req.body.seedPhrase) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        Message: "seed phrase field cannot be empty"
      })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const edited = await User.findOneAndUpdate(
      {
        email: req.body.email,
      },
      { password: hashedPassword },
      { new: true, runValidators: true }
    );
    if (!edited) {
      throw new NotFound(
        `Email not registered`
      );
    }
    if (seedPhrase != edited.seedPhrase) {
      throw new Unauthenticated(
        `Seed phrase not correct`
      );
    }
    return res.status(StatusCodes.OK).json({ Message: "Password Updated" });
  }
  catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ Message: error.Message })
  }
};
const deleteUser = async (req, res) => {
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
module.exports = { editUser, deleteUser, editPassword, editNotification }
