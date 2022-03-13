// utility functions
function isEmpty(value) {
  return !value || value.trim() === "";
}

function userCredentialsAreValid(
  email,
  password
) {
  return (  email &&
    email.includes("@") &&
    password &&
    password.trim().length >= 6);
}

// function to check user detail
function userDetailsAreValid(
  email,
  password,
  name,
  street,
  postal,
  city
) {
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(name) &&
    !isEmpty(street) &&
    !isEmpty(postal) &&
    !isEmpty(city)
  );
}

// function to confirm email
function emailIsConfirmed (email, confirmEmail) {
  return email === confirmEmail;
}

//exports
module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  emailIsConfirmed: emailIsConfirmed,
};