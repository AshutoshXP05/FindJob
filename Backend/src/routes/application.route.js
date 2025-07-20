import express from "express";
import { 
    applyJob, 
    getApplicants, 
    getAppliedJobs, 
    updateStatus 
} from "../controllers/application.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/apply/:id").get(verifyJwt, applyJob);
router.route("/get").get(verifyJwt, getAppliedJobs);
router.route("/:id/applicants").get(verifyJwt, getApplicants);
router.route("/status/:id/update").post(verifyJwt, updateStatus);

export default router