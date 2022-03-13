// flashing functions
function getSessionData (req) {
  // get data
  const sessionData = req.session.flashedData;
  // clear data
  req.session.flashedData = null;
  // return data
  return sessionData;
}

function flashDataToSession (req, data, action) {
  // get data
  req.session.flashedData = data;
  // save data
  req.session.save(action); // after saving - action will fire
}

// exports
module.exports = {
  getSessionData: getSessionData,
  flashDataToSession: flashDataToSession
};