import express from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { getAdminJobs, getAllJobs, getJobById, postJob } from '../controllers/job.controller.js';

const router = express.Router();

router.route('/post').post(verifyJwt, postJob)
router.route('/get').get(verifyJwt, getAllJobs)
router.route('/:id').get(verifyJwt, getJobById)
router.route('/getadminjobs').get(verifyJwt, getAdminJobs)


export default router;