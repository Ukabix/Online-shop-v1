function protectRoutes (req, res, next) {
  // check if authenticated
  if (!res.locals.isAuth) {
    return res.redirect('/401');
  }
  // check if admin
  if (req.path.startsWith('/admin') && !res.locals.isAdmin) {
    return res.redirect('/403');
  }
  // allow middleware to proceed
  next();
}

// exports
module.exports = protectRoutes;