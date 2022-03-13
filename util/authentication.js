// update session data
function createUserSession (req, user,action) {
  // get user id
  req.session.uid = user._id.toString();
  // get isAdmin flag
  req.session.isAdmin = user.isAdmin;
  // save session, execute action after saving sucess
  req.session.save(action);
}

// destroy session
function destroyUserAuthSession (req) {
  // set uid to null
  req.session.uid = null;
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession
}