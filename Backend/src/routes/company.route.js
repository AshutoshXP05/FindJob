import express from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import {
    getCompany,
    getCompanyById,
    registerCompany,
    updateCompany
} from '../controllers/company.controller.js';

const router = express.Router();

router.route('/register').post(verifyJwt, registerCompany)
router.route('/get').get(verifyJwt, getCompany)
router.route('/get/:id').get(verifyJwt, getCompanyById)
router.route('/update-company/:id').put(verifyJwt, updateCompany)

export default router;