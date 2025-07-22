import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { LogIn, Eye, EyeOff, Truck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { USER_API_END_POINT } from '../../lib/constants.js';
import axios from 'axios';
import { toast } from 'sonner';

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${USER_API_END_POINT}/login`, form, {
        headers: {
          "Content-Type":"application/json",
        },
        withCredentials: true,
      })
      if ( res.data.success ) {
        navigate("/");
        toast.success(res.data.message)
      }
    } catch (error) {
       toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }

    console.log(form);
    // You can put login logic here
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center">
        <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6 mt-16">
          <div className="flex flex-col items-center space-y-3 mb-6">
            <LogIn size={48} color="red" strokeWidth={1.3} />
            <h1 className="font-bold text-3xl sm:text-4xl">Login</h1>
            <span className="text-gray-500 text-sm text-center">
              Login to your account to access the Job Portal
            </span>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className='block text-gray-700 mb-1' htmlFor="email">
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
                className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 transition'
              />
            </div>

            <div>
              <label className='block text-gray-700 mb-1' htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  onChange={handleChange}
                  value={form.password}
                  required
                  placeholder="Password"
                  className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 transition pr-10'
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className='w-full bg-[#F83002] text-white py-2 rounded font-semibold hover:bg-[#cf2601] transition'
            >
              Login
            </button>
          </form>
          <div className='mt-4 text-center'>
            <span className="text-gray-700 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#F83002] hover:underline">Sign Up</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
