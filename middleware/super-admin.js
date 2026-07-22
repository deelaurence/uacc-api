const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();
const Admin = require('../models/AdminAuth');
const { Unauthenticated } = require('../errors/customErrors');

const superAdminAuth = async (req, res, next) => {
  try {
    let { authorization } = req.headers;
    if (!authorization) {
      throw new Unauthenticated('supply token and Bearer');
    }

    authorization = authorization.replace(/(^"|"$)/g, '');
    const token = authorization.split(' ')[1] || authorization;

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'admin') {
      throw new Unauthenticated('Admin access required');
    }

    const admin = await Admin.findById(payload.id);
    if (!admin?.superAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Super admin access required' });
    }

    req.decoded = { name: payload.name, id: payload.id, role: payload.role, superAdmin: true };
    next();
  } catch (error) {
    const { message, statusCode } = error;
    if (statusCode) {
      res.status(statusCode).json({ message });
      return;
    }
    res.status(StatusCodes.UNAUTHORIZED).json({ message: message || 'Unauthorized' });
  }
};

module.exports = superAdminAuth;
