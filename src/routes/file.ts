import { Router } from 'express';
import multer from 'multer';
import {uploadFile, deleteFile, getFile, downloadFile, updateFile} from '../controllers';

const upload = multer({ dest: 'uploads/' });

const router = Router();

router.post('/upload', upload.single('file'), uploadFile);
router.delete('/delete/:id', deleteFile);
router.get('/:id', getFile);
router.get('/download/:id', downloadFile);
router.put('/update/:id', upload.single('file'), updateFile);


export default router;
