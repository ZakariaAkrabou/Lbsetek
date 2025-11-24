import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();  

const fileFilter = (req: any, file: any, cb: any) => {
  // console.log('File received:', file); 
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const extname = /\.(jpg|jpeg|png)$/i.test(path.extname(file.originalname));
  const mimetype = allowedTypes.includes(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Images Only!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
}).single('identificationCard'); 

export default upload;
