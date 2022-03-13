// imports
const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

// controller for signup
function getSignup(req, res) {
  // store session data
  let sessionData = sessionFlash.getSessionData(req);
  // handle null and undefined session data
  if (!sessionData) {
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      fullname: '',
      street: '',
      postal: '',
      city: '',
    };
  }
  // pass data to render
  res.render('customer/auth/signup', {
    inputData: sessionData
  });
}

// signup function
async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };
  // user input validation
  if (
    // check user details
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
      // check if email and confirmEmail are same
    ) ||
    !validation.emailIsConfirmed(
      req.body.email,
      req.body['confirm-email']
    )
  ) {
    // if incorrect input
    // flash data
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          'Please check your input! [input data requirements]',
        ...enteredData,
      },
      function () {
        res.redirect('/signup');
      }
    );
    return;
  }
  // input is correct
  // call user class - get data from form via urlencoded
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  // call signup
  try {
    // check if user exists
    const existsAlready =
      await user.existsAlready();

    if (existsAlready) {
      // user exists
      // flash session data
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: 'User exists already!',
          ...enteredData,
        },
        function () {
          res.redirect('/signup');
        }
      );
      return;
    }
    // user does not exist - register user
    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  // send response
  res.redirect('/login');
}

// function for rendering login page
function getLogin(req, res) {
  // get session data
  let sessionData = sessionFlash.getSessionData(req);
  // handle null of undefined session data
  if (!sessionData) {
    sessionData = {
      email: '',
      password: ''
    }
  }
  // pass session data to render
  res.render('customer/auth/login', {
    inputData: sessionData
  });
}

// login function
async function login(req, res, next) {
  // create user object
  const user = new User(
    req.body.email,
    req.body.password
  );
  //// user validation
  // check if user exists
  // declare existingUser to escape try/catch scope
  let existingUser;
  try {
    existingUser =
      await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }
  const sessionErrorData = {
    errorMessage:
      'Invalid credentials. Check your email and password.',
    email: user.email,
    password: user.password,
  };
  if (!existingUser) {
    // user not existing
    // flash session data
    sessionFlash.flashDataToSession(
      req,
      sessionErrorData,
      function () {
        
        res.redirect('/login');
      }
    );
    return;
  }
  // existing user - check pass
  const passwordIsCorrect =
    await user.hasMatchingPassword(
      existingUser.password
    );
  if (!passwordIsCorrect) {
    // user pass not matching
    // flash session data
    sessionFlash.flashDataToSession(
      req,
      sessionErrorData,
      function () {
        res.redirect('/login');
      }
    );
    return;
  }
  // user pass matching - log in
  authUtil.createUserSession(
    req,
    existingUser,
    function () {
      res.redirect('/');
    }
  );
}

// logout function
function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect('/login');
}

//// middleware exports
module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
