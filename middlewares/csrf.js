function addCsrfToken(req, res, next) {
  // generate csrf token on request and save to res.locals
  res.locals.csrfToken = req.csrfToken();
  next();
}

module.exports = addCsrfToken;
