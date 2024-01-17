import { useState } from "react";
import { LuBrush } from "react-icons/lu";
import { LuEraser } from "react-icons/lu";
import { PiTextTBold } from "react-icons/pi";
import { MdOutlineSquare } from "react-icons/md";
import { BiSquareRounded } from "react-icons/bi";
import { TbOvalVertical } from "react-icons/tb";
import { LuShapes } from "react-icons/lu";
import { SlActionUndo } from "react-icons/sl";
import { LuPencil } from "react-icons/lu";
import { SlActionRedo } from "react-icons/sl";
import { FaRegCircle } from "react-icons/fa";
import { tools } from "../../Recoil/Atoms/tools";
import { useRecoilState } from "recoil";
import { toolTypes } from "../../Recoil/Atoms/tools";
import { drawableElements } from "../../Recoil/Atoms/tools";
import "./Toolbar.css";
import { elementTypes } from "../../Recoil/Atoms/elements";
import { elementsContainer } from "../../Recoil/Atoms/elements";
import { elementsAtom } from "../../Recoil/Atoms/elements";

const Toolbar = () => {
  const [selectedTool, setSelectedTool] = useRecoilState<toolTypes>(tools);
  const [isShapesMenuOpen, setIsShapesMenuOpen] = useState<boolean>(false);
  const [elements, setElements] = useRecoilState<elementsContainer>(elementsAtom);
  const handleToolsSelection = (selectedTool: string) => {
    setSelectedTool(prevTools => {
      // Copy the previous tools state
      const updatedTools: drawableElements = { ...prevTools.tools };
  
      // Iterate and update each tool's value
      Object.keys(updatedTools).forEach((tool: string) => {
        updatedTools[tool as keyof drawableElements] = tool === selectedTool;
      });
  
      return {
        ...prevTools,
        tools: updatedTools
      };
    });

    setElements(prevElements => {
      // Deep copy and update
      return prevElements.map(element => ({
        ...element,
        active: false, // Set active to false
      }));
    });
  };
  

  return (
    <div className="bg-white rounded-md drop-shadow-xl p-2 relative plus-cursor">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handleToolsSelection("pencil")}
          className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1"
        >
          <LuPencil className="text-2xl" />
        </button>
        <button
          onClick={() => handleToolsSelection("eraser")}
          className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1"
        >
          <LuEraser className="text-2xl" />
        </button>
        <button
          onClick={() => handleToolsSelection("text")}
          className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1"
        >
          <PiTextTBold className="text-2xl" />
        </button>

        <button
          onClick={() => setIsShapesMenuOpen(!isShapesMenuOpen)}
          className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1 relative"
        >
          <LuShapes className="text-2xl" />
          {isShapesMenuOpen && (
            <div className="absolute bg-white shadow-full rounded-md top-12 flex -left-6">
              <button
                onClick={() => {
                    handleToolsSelection("circle")
                }}
                className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1"
              >
                <FaRegCircle className="text-2xl" />
              </button>
              <button
                onClick={() => { 
                    handleToolsSelection("ellipse")
                }}
                className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1"
              >
                <TbOvalVertical className="text-2xl" />
              </button>
              <button
                 onClick={() => {
                    handleToolsSelection("rectangle")
                }}
                className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1"
              >
                <MdOutlineSquare className="text-2xl" />
              </button>
              <button
                 onClick={() => {
                    handleToolsSelection("biSquare")
                }}
                className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1"
              >
                <BiSquareRounded className="text-2xl" />
              </button>
            </div>
          )}
        </button>

        <button
          onClick={() => handleToolsSelection("undo")}
          className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1"
        >
          <SlActionUndo className="text-2xl" />
        </button>
        <button
          onClick={() => handleToolsSelection("redo")}
          className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1"
        >
          <SlActionRedo className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
