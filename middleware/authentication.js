const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const { Unauthenticated } = require("../errors/customErrors");

const auth = async (req, res, next) => {
  try {
    console.log('auth start')
    // const { authorization } = req.headers;
    const { token } = req.cookies;
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      // res.status(401).json({ message: 'Unauthorized' });
      // return;
      console.log("User agent not ios")
    }

    let iosToken;
    if (authorization) {

      iosToken = authorization.split(' ')[1];
    }
    // return console.log(req.cookies)
    if (!token && !iosToken) {
      throw new Unauthenticated("supply token");
    }
    console.log("token: " + token)
    console.log("iosToken: " + iosToken)
    const payload = jwt.verify(token || iosToken, process.env.JWT_SECRET);
    req.decoded = { name: payload.name, id: payload.id };
    console.log('auth end, next')
    next();

  } catch (error) {
    console.log('auth error:' + error)
    const { Message, statusCode } = error;
    console.log(statusCode, Message);
    if (statusCode) {
      res.status(statusCode).json({ Message });
      console.log(statusCode, Message);
      return;
    }
    res.status(StatusCodes.UNAUTHORIZED).json({ Message });
    console.log(Message);
  }
};

module.exports = auth;
