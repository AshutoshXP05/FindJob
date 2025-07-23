import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/Button";
import { Search } from "lucide-react";

function HeroSection() {
  return (
    <>
    <div className="space-y-0">
    <div className="mx-auto py-10 rounded flex flex-col gap-2 ">
      <span className="mx-auto inline-block text-1xl font-bold bg-gray-100 text-[#F83002] mt-5 rounded-2xl align-bottom px-2 py-2 ">
        Find your dream job here
      </span>
      <h1 className="text-5xl font-bold mt-3">
        Search, Apply & <br /> Get your{" "}
        <span className="text-[#581bc2]"> Dream Job</span>
      </h1>
      <p className="my-3 mb-0">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim iusto eaque numquam architecto ducimus.</p>
    </div>

     <div className="flex max-w-xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <Input
        type="text"
        name="search"
        placeholder="Find your dream job, company, or keywords"
        className="px-6 py-4 font-semibold placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-300"
      />
      <Button
        type="submit"
        variant="solid"
        className="flex items-center gap-2 bg-[#581bc2] hover:bg-[#5c487f] text-white px-8 rounded-none"
      >
        <Search size={20} />
        Search
      </Button>
    </div>
    </div>

    </>
   
  );
}

export default HeroSection;
