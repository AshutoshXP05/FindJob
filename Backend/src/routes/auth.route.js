import express from 'express';
import {
    login,
    logout,
    register,
    updateProfile
} from '../controllers/user.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.route('/register').post(register);

router.route('/login').post(login);

router.route('/logout').post(verifyJwt, logout);

router.route('/update-profile').post(verifyJwt, updateProfile);


export default router;