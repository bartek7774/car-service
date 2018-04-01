const mongoose = require('mongoose');
const multer = require('multer');

// extensions for filer
// const exts = ['.png', '.jpg', '.jpeg'];

// set up folder for file, filename convention
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './photos')
  },
  filename: function (req, file, cb) {
    cb(null, `${new mongoose.Types.ObjectId()}${file.originalname.slice(file.originalname.lastIndexOf('.'))}`);
  }
});

/*
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1048576,
    files: 3
  },
  fileFilter: function (req, file, cb) {
    let ext = file.originalname.slice(file.originalname.lastIndexOf('.'));
    if (!ext) { cb(new Error('Unsupported file!')); }
    else {
      cb(null, exts.includes(ext));
    }
  }
});

let cpUpload = upload.array('gallery', 3);

module.exports = {
  cpUpload,
  upload: function () { }
};
*/

module.exports = {
  autoUpload:
    function (
      fieldName = "gallery",
      maxFileCount = 3,
      maxFileSize = 1048576,
      extensions = ['.png', '.jpg', '.jpeg']) {

        const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './photos')
        },
        filename: function (req, file, cb) {
          cb(null, `${new mongoose.Types.ObjectId()}${file.originalname.slice(file.originalname.lastIndexOf('.'))}`);
        }
      });

      const upload = multer({
        storage: storage,
        limits: {
          fileSize: maxFileSize,
          files: maxFileCount
        },
        fileFilter: function (req, file, cb) {
          let ext = file.originalname.slice(file.originalname.lastIndexOf('.'));
          if (!ext) { cb(new Error('Unsupported file!')); }
          else {
            cb(null, extensions.includes(ext));
          }
        }
      });
      return upload.array(fieldName, maxFileCount);
    }
}