import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Define the path to the uploads directory
const uploadDir = path.join(process.cwd(), 'uploads', 'images'); // Use process.cwd() for better portability

// Check if the directory exists; if not, create it
if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Upload directory created.');
    } catch (error) {
        console.error('Error creating upload directory:', error);
    }
}

// Configure multer storage for images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Use the created directory
    },
    filename: (req, file, cb) => {
        // Use timestamp and original extension as filename to avoid overwriting
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Set up multer with a maximum file size limit (optional, but good practice)
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Max file size: 5 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images are allowed.'));
        }
    }
});

export default upload;
