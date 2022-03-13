function checkAuthStatus (req,res,next){
  // get user id from session
  const uid = req.session.uid;
  // check if uid exists
  if (!uid) {
    return next();
  }
  // user id exists
  res.locals.uid = uid;
  // set isAuth to true
  res.locals.isAuth = true;
  // handle isAdmin
  res.locals.isAdmin = req.session.isAdmin;

  next();
}

module.exports = checkAuthStatus;