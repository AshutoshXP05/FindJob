import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const applyJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id;

    if (!jobId) {
        throw new ApiError(400, "Job ID is required");
    }

    // check if the user already applied for the job or not
    const existingApplication = await Application.findOne({
        job: jobId,
        applicant: req.user._id
    })

    if (existingApplication) {
        throw new ApiError(409, "You have already applied for this job");
    }

    // check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    const jobApplication = await Application.create({
        job: jobId,
        applicant: req.user._id,
    })

    job.application.push(jobApplication._id)
    await job.save();

    return res.status(201).json(
        new ApiResponse(201, jobApplication, "Job application submitted successfully")
    );

})


const getAppliedJobs = asyncHandler(async (req, res) => {
    const user = req.user._id;
    const application = await Application.find({ applicant: user })
        .sort({ createdAt: -1 })
        .populate({
            path: "job",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "company",
                options: { sort: { createdAt: -1 } },
            }
        });

    if (!application) {
        throw new ApiError(404, "No applications found");
    }

    return res.status(200).json(
        new ApiResponse(200, application, "Applied jobs fetched successfully")
    );
})

// admin check for no of applicant applied for a job he posted
const getApplicants = asyncHandler(async (req, res) => {

    const id = req.params.id;
    const job = await Job.findById(id)
        .populate({
            path: "application",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "applicant",
                options: { sort: { createdAt: -1 } },
            }
        })

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    return res.status(200).json(
        new ApiResponse(200, job, "Applicants fetched successfully")
    )

})


const updateStatus = asyncHandler(async (req, res) => {

    const { status } = req.body;
    const applicantId = req.params.id;

    if (!status || !applicantId) {
        throw new ApiError(400, "Status and Applicant ID are required");
    }

    const application = await Application.findOne({ _id: applicantId });
    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    // update status 
    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json(
        new ApiResponse(200, application, "Application status updated successfully")
    );

})


export {
    applyJob,
    getAppliedJobs,
    getApplicants,
    updateStatus
}