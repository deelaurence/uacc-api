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
    let iosToken;
    if (authorization) {
      iosToken = authorization.split(' ')[1];
    }
    // return console.log(req.cookies)
    if (!token && !iosToken) {
      throw new Unauthenticated("supply token");
    }
    const payload = jwt.verify(token || iosToken, process.env.JWT_SECRET);
    if (payload.role && payload.role !== 'user') {
      throw new Unauthenticated('Invalid user token');
    }
    req.decoded = { name: payload.name, id: payload.id, role: payload.role || 'user' };
    console.log('auth end, next')
    next();

  } catch (error) {
    console.log('auth error:' + error)
    const { message, statusCode } = error;
    if (statusCode) {
      res.status(statusCode).json({ message });
      return;
    }
    res.status(StatusCodes.UNAUTHORIZED).json({ message: message || 'Unauthorized' });
  }
};

module.exports = auth;
