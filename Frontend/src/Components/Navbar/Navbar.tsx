import React from "react";
import Toolbar from "../Toolbar/Toolbar"

interface NavbarProps {
setActiveElementId: React.Dispatch<React.SetStateAction<string>>,
}

const Navbar:React.FC = () => {
  return (
    <div className="p-4 flex justify-between absolute w-full h-auto left-0 top-0 z-10000">
        <div className="">
            <h3 className="text-xl font-bold">DoddleDesk</h3>
        </div>

        <Toolbar />

        <button className="bg-purple-300 px-3 rounded-md">
            <p className="font-medium">sign in/up</p>
        </button>
    </div>
  )
}

export default Navbar