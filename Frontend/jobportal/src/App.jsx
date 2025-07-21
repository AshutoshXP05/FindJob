import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Navbar from "./components/shared/Navbar";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import Home from "./components/Home";
import CompleteProfile from "./components/auth/CompleteProfile";

const appRouter = createBrowserRouter([
   {
     path: '/',
     element:<Home/>
   },
   {
     path: '/login',
     element:<Login/>
   },
   {
     path: '/signup',
     element:<SignUp/>
   },
   {
     path: '/complete-profile',
     element:<CompleteProfile/>
   },
])

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
