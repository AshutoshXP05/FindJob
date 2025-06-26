import { Company } from "../models/company.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerCompany = asyncHandler ( async (req, res) => {
     const {name } = req.body;

     if ( ! name ) {
        throw new ApiError(404, "Company name is required here");
     }

     const registedCompany = await Company.findOne({ name });

     if ( registedCompany) {
        throw new ApiError(409, "Company already exists"); 
     }

     const company = await Company.create({
        name: name,
        userId: req.user._id,
     })

     return res.status(201).json(
        new ApiResponse( 201, company, "Company registered successfully")
     )
 });


 const getCompany = asyncHandler ( async (req, res) => {

     const userId = req.user?._id;
     const company = await Company.find({userId});

     if ( ! company) {
        throw new ApiError(404, "Company not found");
     }

      return res.status(200).json(
        new ApiResponse(200, company, "Company fetched successfully")
      )

 })

 
 const getCompanyById = asyncHandler ( async (req, res) => {

    const {id} = req.params;

    if ( ! id ) {
        throw new ApiError(404, "Company ID is required");
    }

     const company = await Company.findById(id);

       if (!company || company.length === 0) {
        throw new ApiError(404, "Company not found");
     }

     return res.status(200).json(
        new ApiResponse(200, company, "Company fetched successfully")   
     )

 })


const updateCompany = asyncHandler ( async (req, res) => {

    const {id} = req.params;

    if ( ! id ) {
        throw new ApiError(404, "Company ID is required");
    }

     const {name, description, location, website} = req.body;

     const company = await Company.findById(id);

     if ( ! company ) {
        throw new ApiError(404, "Company not found");
     }

     if ( name ) {
        const findCompany = await Company.findOne({ name });

        if ( findCompany ) {
            throw new ApiError(409, "Company name already exists");
        }
        company.name = name;
     } 
     if ( description ) company.description = description;
     if ( location ) company.location = location;
     if ( website ) company.website = website;

     await company.save()
     return res.status(200).json(
        new ApiResponse(200, company, "Company updated successfully")
     )


})



 export {
    registerCompany,
    getCompany,
    getCompanyById,
    updateCompany
 }