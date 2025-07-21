import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/Popover";
import { Button } from "../components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { LogIn, LogOut, User2, UserPlus } from "lucide-react";

function Navbar() {
  const user = false;
  return (
    <div className="bg-white-500">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-1">
        <div>
          <h1 className="text-2xl font-bold">
            Job <span className="text-[#F83002]">Portal</span>
          </h1>
        </div>
        <div className="flex items-center justify-end gap-15">
          <ul className="flex font-medium items-center gap-5">
            <li>Home</li>
            <li>Jobs</li>
            <li>Browse</li>
          </ul>

          {!user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <LogIn size={18} />
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 rounded-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Login
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <UserPlus size={18} />
                <Button
                  variant="solid"
                  className="flex items-center gap-2 bg-[#F83002] text-white font-semibold px-4 py-2 shadow hover:bg-[#cf2601] transition-colors duration-200 cursor-pointer"
                >
                  SignUp
                </Button>
              </div>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex gap-5">
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="https://github.com/shadcn.png" />
                  </Avatar>
                  <div>
                    <h4> Ashutosh Kumar Pathak </h4>
                    <p className="text-white-400 text-accent-foreground font-semibold">
                      Here will be bio
                    </p>
                  </div>
                </div>
                <div className="flex flex-col my-2 items-start">
                  <div className="flex items-center ">
                    <User2 size={20} color="currentColor" />
                    <Button
                      variant="link"
                      className="text-black-900 cursor-pointer"
                    >
                      {" "}
                      View Profile{" "}
                    </Button>
                  </div>

                  <div className="flex items-center">
                    <LogOut size={20} color="currentColor" />
                    <Button
                      variant="link"
                      className="text-black-900 cursor-pointer"
                    >
                      {" "}
                      Logout{" "}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            //  <Button> User Exist</Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
