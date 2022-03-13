// imports
const multer = require('multer');
const uuid = require('uuid').v4;
// execute multer
const upload = multer({
  storage: multer.diskStorage({
    destination: 'product-data/images',
    filename: function (req, file, cb) {
      // use uuid to generate names + keep org filename
      cb(null, uuid() + '-' + file.originalname);
    }
  })
});
// configure single file upload to catch form data
const configuredMulterMiddleware = upload.single('image');

// exports
module.exports = configuredMulterMiddleware;