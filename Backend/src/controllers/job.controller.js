import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// when admin will post a job
const postJob = asyncHandler(async (req, res) => {

    const { title, description, salary, location, experience, jobType, position, skillsRequired, companyId } = req.body;

    if (
        [title, description, location, jobType, companyId].some(field => !field || field.trim() === "") ||
        [salary, experience, position].some(field => field === undefined || isNaN(field)) ||
         skillsRequired.length === 0
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const job = await Job.create({
        title,
        description,
        salary: Number(salary),
        location,
        experience,
        jobType,
        position,
        skillsRequired: skillsRequired.split(","),
        company: companyId,
        created_by: req.user._id,
    })

    return res.status(201).json(
        new ApiResponse(201, job, "Job posted successfully")
    )

})

// when user will get all the jobs
const getAllJobs = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword || "";

    const query = {
        $or: [
            { title: { $regex: keyword, $options: "i" } },
            { title: { $regex: keyword, $options: "i" } }
        ]
    }

    const jobs = await Job.find( query )
        .populate({ path: "company" })
        .sort({ createdAt: -1 })

    if (!jobs) {
        throw new ApiError(404, "No jobs found");
    }

    return res.status(200).json(
        new ApiResponse(200, jobs, "Jobs fetched successfully")
    )
})


// when user will get a single job
const getJobById = asyncHandler(async (req, res) => {

    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({ path: "application" });

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    return res.status(200).json(
        new ApiResponse(200, job, "Job fetched successfully")
    )

})

// no of job created by admin

const getAdminJobs = asyncHandler(async (req, res) => {
    const adminId = req.user._id;
    const jobs = await Job.find({ created_by: adminId }).populate({ path: "company", createdAt: -1 });

    if (!jobs || jobs.length === 0) {
        throw new ApiError(404, "No jobs found for this admin");
    }

    return res.status(200).json(
        new ApiResponse(200, jobs, "Admin jobs fetched successfully")
    );
})


export {
    postJob,
    getAllJobs,
    getJobById,
    getAdminJobs
}