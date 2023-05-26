require("dotenv").config();
const User = require("../models/UserModel");
const { StatusCodes } = require("http-status-codes");
const { shuffle, seedArray } = require('../utils/seed-phrase')
const generator = require('generate-serial-number')
const serialNumber = generator.generate(1)
const jwt = require('jsonwebtoken')
const { sendMail } = require('../utils/mailer')
const {
  BadRequest,
  NotFound,
  Unauthenticated,
  InternalServerError
} = require("../errors/customErrors");
const register = async (req, res) => {
  try {
    shuffle(seedArray)
    let slicedArray = seedArray.slice(0, 6)
    let seedPhrase = slicedArray.join("-")
    req.body.seedPhrase = seedPhrase
    req.body.id = serialNumber
    // console.log(process.env.SERVER_URL)
    const newUser = await User.create(req.body);
    const token = newUser.generateJWT(process.env.JWT_SECRET);

    const link = `${process.env.SERVER_URL}/auth/verify-mail/${token}`
    const mailStatus = await sendMail(req.body.email, req.body.name, link)
    if (!mailStatus) {
      throw new InternalServerError("Something went wrong while trying to send verification email")
    }
    res
      .status(StatusCodes.CREATED)
      .json({ owner: newUser.name, email: newUser.email, });
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Email already registered, Sign In" });
      return;
    }
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log(StatusCodes.BAD_REQUEST, error.message);
  }
};
console.log(process.env.CLIENT_URL)
const clientUrl = `${process.env.CLIENT_URL}/#/verified`
const verifyEmail = async (req, res) => {
  try {
    const token = req.params.signature
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOneAndUpdate({ _id: payload.id }, { verified: true })
    res.status(StatusCodes.PERMANENT_REDIRECT)
      .redirect(clientUrl)
  } catch (error) {
    console.error(error)
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message })
  }
}
const deleteUser = async (req, res) => {
  try {
    const email = req.params.email
    const user = await User.findOneAndDelete({ email })
    if (!user) {
      throw new NotFound(`${email} does not exist`)
    }
    res.status(StatusCodes.OK)
      .json({ message: `${email} removed` })
  } catch (error) {
    console.error(error)
    res.status(error.statusCode)
      .json({ error: error.message })
  }
}
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequest("email and password cannot be empty");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new NotFound("Email not registered, Sign up");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Unauthenticated("Invalid credentials");
    }
    if (!user.verified) {
      throw new Unauthenticated("Verify your email")
    }
    const token = user.generateJWT(process.env.JWT_SECRET);
    res.cookie('token', token, { httpOnly: true });
    res.status(StatusCodes.OK).json({ ...user._doc, token: token });
  } catch (error) {
    const { message, statusCode } = error;
    console.log(statusCode, message);
    if (statusCode) {
      res.status(statusCode).json({ message: message });
      console.log(statusCode, message);
      return;
    }
    res.status(StatusCodes.UNAUTHORIZED).json({ message: message });
    console.log(message);
  }
};
const logout = (req, res) => {
  res.clearCookie('token', { httpOnly: true });
  res.json({ message: "logged out" });
}


module.exports = { register, login, logout, verifyEmail, deleteUser };
