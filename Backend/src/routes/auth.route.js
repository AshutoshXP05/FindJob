import express from 'express';
import {
    completeProfile,
    login,
    logout,
    register,
    updateProfile
} from '../controllers/user.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { profileUpload } from '../middlewares/multer.js';

const router = express.Router();

router.route('/register').post(register);

router.route('/complete-profile').post(verifyJwt, profileUpload, completeProfile);

router.route('/login').post(login);

router.route('/logout').get(verifyJwt, logout);

router.route('/update-profile').post(verifyJwt, updateProfile);


export default router;