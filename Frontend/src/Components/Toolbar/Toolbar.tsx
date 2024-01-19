import { useState } from "react";
import { LuBrush } from "react-icons/lu";
import { LuEraser } from "react-icons/lu";
import { PiTextTBold } from "react-icons/pi";
import { MdOutlineSquare } from "react-icons/md";
import { BiSquareRounded } from "react-icons/bi";
import { TbOvalVertical } from "react-icons/tb";
import { LiaMousePointerSolid } from "react-icons/lia";
import { PiHandGrabbingBold } from "react-icons/pi";
import { LuShapes } from "react-icons/lu";
import { SlActionUndo } from "react-icons/sl";
import { LuPencil } from "react-icons/lu";
import { SlActionRedo } from "react-icons/sl";
import { FaRegCircle } from "react-icons/fa";
import { currentTool } from "../../Recoil/Atoms/tools";
import { activeElementIdAtom } from "../../Recoil/Atoms/elements";
import { useRecoilState } from "recoil";


const Toolbar: React.FC= () => {
  const [selectedTool, setSelectedTool] = useRecoilState<string>(currentTool);
  const [isShapesMenuOpen, setIsShapesMenuOpen] = useState<boolean>(false);

  const setToolAndActiveElementId = (tool: string) => {
    setSelectedTool(tool);
    // setActiveElementId("");
  };

  return (
    <div className="bg-white rounded-md drop-shadow-xl p-2 relative plus-cursor">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setToolAndActiveElementId("select")}
          className={`hover:bg-gray-100 rounded-md px-2 py-1 ${
            selectedTool == "select" ? "bg-purple-200 hover:bg-purple-200" : "bg-transparent"
          }`}
        >
          <LiaMousePointerSolid className="text-2xl" />
        </button>
        <button
          onClick={() => setToolAndActiveElementId("grab")}
          className={`hover:bg-gray-100 rounded-md px-2 py-1 ${
            selectedTool == "grab" ? "bg-purple-200 hover:bg-purple-200" : "bg-transparent"
          }`}
        >
          <PiHandGrabbingBold className="text-2xl" />
        </button>
        <button
          onClick={() => setToolAndActiveElementId("pencil")}
          className={`hover:bg-gray-100 rounded-md px-2 py-1 ${
            selectedTool == "pencil" ? "bg-purple-200 hover:bg-purple-200" : "bg-transparent"
          }`}
        >
          <LuPencil className="text-2xl" />
        </button>
        <button
          onClick={() => setToolAndActiveElementId("eraser")}
          className={`hover:bg-gray-100 rounded-md px-2 py-1 ${
            selectedTool == "eraser" ? "bg-purple-200 hover:bg-purple-200" : "bg-transparent"
          }`}
        >
          <LuEraser className="text-2xl" />
        </button>
        <button
          onClick={() => setToolAndActiveElementId("text")}
          className={`hover:bg-gray-100 rounded-md px-2 py-1 ${
            selectedTool == "text" ? "bg-purple-200 hover:bg-purple-200" : "bg-transparent"
          }`}
        >
          <PiTextTBold className="text-2xl" />
        </button>

        <button
          onClick={() => setIsShapesMenuOpen(!isShapesMenuOpen)}
          className={`hover:bg-gray-100 rounded-md px-2 py-1 relative ${
            selectedTool == "circle" ||
            selectedTool == "ellipse" ||
            selectedTool == "rectangle" ||
            selectedTool == "biSquare"
              ? "bg-purple-200 hover:bg-purple-200"
              : "bg-transparent"
          }`}
        >
          <LuShapes className="text-2xl" />
          {isShapesMenuOpen && (
            <div className="absolute bg-white shadow-full rounded-md top-12 flex -left-6">
              <button
                onClick={() => {
                  setToolAndActiveElementId("circle");
                }}
                className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1"
              >
                <FaRegCircle className="text-2xl" />
              </button>
              <button
                onClick={() => {
                  setToolAndActiveElementId("ellipse");
                }}
                className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1"
              >
                <TbOvalVertical className="text-2xl" />
              </button>
              <button
                onClick={() => {
                  setToolAndActiveElementId("rectangle");
                }}
                className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1"
              >
                <MdOutlineSquare className="text-2xl" />
              </button>
              <button
                onClick={() => {
                  setToolAndActiveElementId("biSquare");
                }}
                className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1"
              >
                <BiSquareRounded className="text-2xl" />
              </button>
            </div>
          )}
        </button>

        <button
          onClick={() => setToolAndActiveElementId("undo")}
          className={`bg-transparent hover:bg-gray-100 rounded-md px-2 py-1`}
        >
          <SlActionUndo className="text-2xl" />
        </button>
        <button
          onClick={() => setToolAndActiveElementId("redo")}
          className="bg-transparent hover:bg-gray-100 rounded-md px-2 py-1"
        >
          <SlActionRedo className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
