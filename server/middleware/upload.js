import multer from 'multer';
import path from 'path';

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const prefix = file.fieldname === 'image' ? 'img_' : 'vid_';
        cb(null, prefix + uniqueSuffix + ext);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif/;
    const allowedVideoTypes = /mp4|avi|mkv/;

    const ext = path.extname(file.originalname).toLowerCase().substring(1);

    if (file.fieldname === 'image') {
        if (allowedImageTypes.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid image file type. Allowed: jpg, jpeg, png, gif'));
        }
    } else if (file.fieldname === 'video') {
        if (allowedVideoTypes.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid video file type. Allowed: mp4, avi, mkv'));
        }
    } else {
        cb(null, true);
    }
};

// Upload middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB max file size
    }
});

export default upload;
