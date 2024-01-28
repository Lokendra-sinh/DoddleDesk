import { useState } from "react";
import { PiEraserFill } from "react-icons/pi";
import { PiTextTBold } from "react-icons/pi";
import { MdOutlineSquare } from "react-icons/md";
import { BiSquareRounded } from "react-icons/bi";
import { TbOvalVertical } from "react-icons/tb";
import { LuMousePointer2 } from "react-icons/lu";
import { RiShapesLine } from "react-icons/ri";
import { IoCaretForwardSharp } from "react-icons/io5";
import { IoPencilOutline } from "react-icons/io5";
import { IoCaretBackSharp } from "react-icons/io5";
import { VscCircleLarge } from "react-icons/vsc";
import { currentTool } from "../../Recoil/Atoms/tools";
import { useRecoilState } from "recoil";
import { elementsAtom } from "../../Recoil/Atoms/elements";
import { ElementsContainer } from "../../Types/Types";
import { canvasElements, setCueBallsAreVisible } from "../../Utils/interactionhelpers";

const Toolbar: React.FC = () => {
  const [selectedTool, setSelectedTool] = useRecoilState<string>(currentTool);
  const [recoilElements, setRecoilElements] =
  useRecoilState<ElementsContainer>(elementsAtom);
  const [isShapesMenuOpen, setIsShapesMenuOpen] = useState<boolean>(false);

  const setToolAndActiveElementId = (tool: string) => {
    setSelectedTool(tool);
    canvasElements.forEach((element, index) => {
      canvasElements[index] = { ...element, isActive: false };
    });
    setCueBallsAreVisible(false);
    setRecoilElements(() => [...canvasElements]);

  };

  return (
    <div className="bg-white border-gray-100 border rounded-md relative h-fit flex items-center py-px px-px plus-cursor">
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={() => setToolAndActiveElementId("select")}
          className={`hover:bg-gray-100 outline-none w-full rounded-md px-3 py-2 ${
            selectedTool == "select" ? "bg-purple-200 hover:bg-purple-200" : "bg-transparent"
          }`}
        >
          <LuMousePointer2 className="text-sm" />
        </button>
        <button
          onClick={() => setToolAndActiveElementId("pencil")}
          className={`hover:bg-gray-100  outline-none rounded-md px-3 py-2 ${
            selectedTool == "pencil" ? "bg-purple-200 hover:bg-purple-200" : "bg-transparent"
          }`}
        >
          <IoPencilOutline className="text-sm" />
        </button>
        <button
          onClick={() => setToolAndActiveElementId("eraser")}
          className={`hover:bg-gray-100 outline-none rounded-md px-3 py-2 ${
            selectedTool == "eraser" ? "bg-purple-200 hover:bg-purple-200" : "bg-transparent"
          }`}
        >
          <PiEraserFill className="text-sm" />
        </button>
        <button
          onClick={() => setToolAndActiveElementId("text")}
          className={`hover:bg-gray-100 outline-none rounded-md px-3 py-2 ${
            selectedTool == "text" ? "bg-purple-200 hover:bg-purple-200" : "bg-transparent"
          }`}
        >
          <PiTextTBold className="text-sm" />
        </button>

        <button
          onClick={() => setIsShapesMenuOpen(!isShapesMenuOpen)}
          className={`hover:bg-gray-100 outline-none rounded-sm px-3 py-2 relative ${
            selectedTool == "circle" ||
            selectedTool == "ellipse" ||
            selectedTool == "rectangle" ||
            selectedTool == "biSquare"
              ? "bg-purple-200 hover:bg-purple-200"
              : "bg-transparent"
          }`}
        >
          <RiShapesLine className="text-sm" />
          {isShapesMenuOpen && (
            <div className="absolute border border-gray-100 bg-white shadow-full rounded-md px-1 py-1 top-12 flex -left-6">
              <button
                onClick={() => {
                  setToolAndActiveElementId("circle");
                }}
                className="bg-transparent hover:bg-gray-100 rounded-sm px-3 py-2"
              >
                <VscCircleLarge className="text-sm" />
              </button>
              <button
                onClick={() => {
                  setToolAndActiveElementId("ellipse");
                }}
                className="bg-transparent hover:bg-gray-100 rounded-sm px-3 py-2"
              >
                <TbOvalVertical className="text-sm" />
              </button>
              <button
                onClick={() => {
                  setToolAndActiveElementId("rectangle");
                }}
                className="bg-transparent hover:bg-gray-100 rounded-sm px-3 py-2"
              >
                <MdOutlineSquare className="text-sm" />
              </button>
              <button
                onClick={() => {
                  setToolAndActiveElementId("biSquare");
                }}
                className="bg-transparent hover:bg-gray-100 rounded-sm px-3 py-2"
              >
                <BiSquareRounded className="text-sm" />
              </button>
            </div>
          )}
        </button>

        <button
          onClick={() => setToolAndActiveElementId("redo")}
          className="bg-transparent outline-none hover:bg-gray-100 rounded-md px-3 py-2"
        >
          <IoCaretBackSharp className="text-base" />
        </button>

        <button
          onClick={() => setToolAndActiveElementId("undo")}
          className={`bg-transparent outline-none hover:bg-gray-100 rounded-sm px-3 py-2`}
        >
          <IoCaretForwardSharp className="text-base" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
