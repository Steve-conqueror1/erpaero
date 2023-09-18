import { Router } from 'express';
import multer from 'multer';
import {uploadFile, deleteFile, getFile, downloadFile} from '../controllers';

const upload = multer({ dest: 'uploads/' });

const router = Router();

router.post('/upload', upload.single('file'), uploadFile);
router.delete('/delete/:id', deleteFile);
router.get('/:id', getFile);
router.get('/download/:id', downloadFile);


export default router;
