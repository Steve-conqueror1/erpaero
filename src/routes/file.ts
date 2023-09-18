import { Router } from 'express';
import multer from 'multer';
import { uploadFile, deleteFile, getFile } from '../controllers';

const upload = multer({ dest: 'uploads/' });

const router = Router();

router.post('/upload', upload.single('file'), uploadFile);
router.delete('/delete/:id', deleteFile);
router.get('/:id', getFile);


export default router;
