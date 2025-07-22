import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { User, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../../lib/constants";
import axios from "axios";
import { toast } from "sonner";

function CompleteProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:"",
    role: "",
    mobNo: "",
    profilePic: null,
    resume: null,
  });
  const [previewPic, setPreviewPic] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((f) => ({ ...f, [name]: files[0] }));
      if (name === "profilePic" && files[0]) {
        setPreviewPic(URL.createObjectURL(files[0]));
      }
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form)

    if (!form.role) {
      alert("Please select your role.");
      
      return;
    }
    setSubmitting(true);

    try {

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("role", form.role);
    formData.append("mobNo", form.mobNo);
    if (form.profilePic) formData.append("profilePic", form.profilePic);
    if (form.role === "employee" && form.resume) formData.append("resume", form.resume);


      // ----- Your backend call here -----
      // Example: await axios.patch('/api/user/profile', formData, { ... });

      // Simulating profile update...
      const res = await axios.post(`${USER_API_END_POINT}/complete-profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true,
      })
      if ( res.data.success ) {
        toast.success(res.data.message);
        navigate("/login");
      }
      setTimeout(() => {
        setSubmitting(false);
        navigate("/");
      }, 1120);
    } catch (err) {
      setSubmitting(false);
      alert("There was a problem updating your profile.", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 mt-16">
          <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>

            <div>
              <label className="block text-gray-700 mb-1">Profile Picture</label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="profilePic"
                  className="w-20 h-20 flex items-center justify-center bg-gray-100 border rounded-full cursor-pointer hover:ring-2 hover:ring-orange-400 transition"
                >
                  {previewPic ? (
                    <img src={previewPic} alt="Profile Preview" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                  <input
                    id="profilePic"
                    name="profilePic"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
                {form.profilePic && (
                  <span className="text-sm text-gray-700 truncate">{form.profilePic.name}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1" htmlFor="mobNo">
                Mobile Number
              </label>
              <input
                id="mobNo"
                name="mobNo"
                type="tel"
                autoComplete="tel"
                required
                value={form.mobNo}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <span className='block text-gray-700 mb-1'>Role</span>
              <div className='flex gap-6 mt-2'>
                <label className='flex items-center'>
                  <input
                    type="radio"
                    name="role"
                    value="employee"
                    checked={form.role === "employee"}
                    onChange={handleChange}
                    className='accent-[#F83002] mr-2 cursor-pointer'
                  />
                  Employee
                </label>
                <label className='flex items-center'>
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={form.role === "recruiter"}
                    onChange={handleChange}
                    className='accent-[#F83002] mr-2 cursor-pointer'
                  />
                  Recruiter
                </label>
              </div>
            </div>

            {form.role === "employee" && (
              <div>
                <label className="block text-gray-700 mb-1">Upload Resume</label>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="resume"
                    className="bg-gray-100 px-4 py-2 rounded-lg border border-dashed cursor-pointer hover:bg-orange-50 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {form.resume ? form.resume.name : "Select file"}
                  </label>
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}
 
            <button
              type="submit"
              className="w-full bg-[#F83002] text-white py-2 rounded font-semibold hover:bg-[#cf2601] transition disabled:opacity-70"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Complete Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompleteProfile;
