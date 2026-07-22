const publicOnly = (req, res, next) => {
  req.publicOnly = true;
  next();
};

module.exports = publicOnly;
