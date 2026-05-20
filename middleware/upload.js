const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const checkFileType = (file, cb) => {
    const filetypes = /jpg|jpeg|png|mp4|mkv|webm|avi/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype) || file.mimetype.startsWith('video/');

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images or Videos only!');
    }
};

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;
