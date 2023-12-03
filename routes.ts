import express from 'express';
import { loginUser, registerUser } from './controller/controllerFile';
const router = express.Router();

router.post('/app/register', registerUser);
router.post('/app/login', loginUser);

export default router;