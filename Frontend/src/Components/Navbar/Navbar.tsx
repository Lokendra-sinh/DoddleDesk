import React from "react";
import Toolbar from "../Toolbar/Toolbar"

interface NavbarProps {
isSidePanelOpen: boolean,
setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const Navbar: React.FC<NavbarProps> = ({isSidePanelOpen, setIsSidePanelOpen}) => {
  return (
    <div className="fixed z-[10] top-0 left-0 flex items-center justify-between w-full h-14 px-4 bg-white border-b border-gray-100">
        <div className="">
            <h3 className="text-xl font-bold">DoddleDesk</h3>
        </div>

        <Toolbar isSidePanelOpen={isSidePanelOpen} setIsSidePanelOpen={setIsSidePanelOpen} />

        <button className="w-content px-2 py-1 bg-purple-300 rounded">
            <p className="text-sm font-medium">sign in/up</p>
        </button>
    </div>
  )
}

export default Navbar