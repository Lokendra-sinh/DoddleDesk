import React from 'react'
import { LuBrush } from "react-icons/lu";
import { LuEraser } from "react-icons/lu";
import { PiTextTBold } from "react-icons/pi";
import { MdOutlineSquare } from "react-icons/md";
import { MdOutlineCropSquare } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";
import { tools } from '../../Recoil/Atoms/tools';
import { useRecoilState } from 'recoil';
import { toolTypes } from '../../Recoil/Atoms/tools';



const Toolbar = () => {

    const [selectedTools, setSelectedTool] = useRecoilState<toolTypes>(tools);

    const handleToolsSelection = (selectedTool : string) => {
         setSelectedTool({
            ...selectedTools,
            tools: {
            square: selectedTool === "square" ? true : false,
            circle: selectedTool === "circle" ? true : false,
            line: selectedTool === "line" ? true : false,
            text: selectedTool === "text" ? true : false,
            image: selectedTool === "image" ? true : false,
            eraser: selectedTool === "eraser" ? true : false,
            },
            
         })
    }

  return (
    <div className='bg-white rounded-md drop-shadow-xl p-2'>
        <div className="flex items-center justify-center gap-2">
            <button onClick={() => handleToolsSelection("brush")} className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1">
                <LuBrush className="text-2xl"/>
            </button>
            <button onClick={() => handleToolsSelection("eraser")} className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1">
                <LuEraser className="text-2xl"/>
            </button>
            <button onClick={() => handleToolsSelection("text")} className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1">
                <PiTextTBold className="text-2xl"/>
            </button>

            <button onClick={() => handleToolsSelection("circle")} className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1">
                <FaRegCircle className="text-2xl"/>
            </button>
            <button onClick={() => handleToolsSelection("square")} className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1">
                <MdOutlineSquare className="text-2xl"/>
            </button>
            <button onClick={() => handleToolsSelection("croppedSquare")} className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1">
                <MdOutlineCropSquare className="text-2xl"/>
            </button>
            <button onClick={() => handleToolsSelection("undo")} className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1">
                <p className="font-medium">Undo</p>
            </button>
            <button onClick={() => handleToolsSelection("redo")} className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1">
                <p className="font-medium">Redo</p>
            </button>
        </div>  
    </div>
  )
}

export default Toolbar