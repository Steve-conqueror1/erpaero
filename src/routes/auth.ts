import { Router } from 'express';
import { createUser, login, logout } from './../controllers';

const router = Router();
router.post('/signup', createUser);
router.post('/login', login);
router.post('/logout', logout);

export default router;
