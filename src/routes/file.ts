import { Router } from 'express';
import multer from 'multer';
import { uploadFile, deleteFile } from '../controllers';

const upload = multer({ dest: 'uploads/' });

const router = Router();

router.post('/upload', upload.single('file'), uploadFile);
router.delete('/delete/:id', deleteFile);


export default router;
