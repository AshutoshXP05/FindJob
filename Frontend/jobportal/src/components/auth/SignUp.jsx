import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../../lib/constants";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../app/authSlice";

function SignUp() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loading } = useSelector(state => state.auth);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.agree) {
      alert("You must agree to our Terms and Privacy Policy.");
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, form, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/complete-profile");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
    finally {
      dispatch(setLoading(false));
    }
  };
  // };

  return (
    <div className="min-h-screen ">
      <Navbar />
      <div className="flex justify-center">
        <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6 mt-16">
          <div className="flex flex-col items-center space-y-3 mb-6">
            <UserPlus size={48} color="red" strokeWidth={1.3} />
            <h1 className="font-bold text-3xl sm:text-4xl">Sign Up</h1>
            <span className="text-gray-500 text-sm text-center">
              Create your account to access the Job Portal
            </span>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={handleChange}
                value={form.email}
                required
                placeholder="Email"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              />
            </div>
            {/* Password with show/hide */}
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  onChange={handleChange}
                  value={form.password}
                  required
                  placeholder="Password"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 transition pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {/* Terms and Privacy */}
            <div className="flex items-center">
              <input
                id="agree"
                name="agree"
                type="checkbox"
                checked={form.agree}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label htmlFor="agree" className="text-gray-700 text-sm">
                I agree to the{" "}
                <a
                  href="/terms"
                  className="underline text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="underline text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#F83002] text-white py-2 rounded font-semibold hover:bg-[#cf2601] transition"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-gray-700 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-[#F83002] hover:underline">
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
