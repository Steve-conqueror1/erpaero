import { Router } from 'express';
import { createUser, login, logout, refreshToken } from './../controllers';

const router = Router();
router.post('/signup', createUser);
router.post('/signin', login);
router.post('/logout', logout);
router.post('/signin/new_token', refreshToken);

export default router;
