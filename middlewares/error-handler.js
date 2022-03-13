// error handler for server-side
function handleErrors(error, req, res, next) {
  console.log(error);
  // check for 404 error code
  if (error.code === 404) {
    return res.status(404).render('shared/404');
  }

  // set status and render error page
  res.status(500).render('shared/500');
}

module.exports = handleErrors;