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
import { DoddleDeskElements } from "../../Recoil/Atoms/elements";
import { ElementsContainer } from "../../Types/Types";
import {
  canvasElements,
  setCanvasElements,
  setCueBallsAreVisible,
  undoStack, 
  redoStack,
} from "../../Utils/interactionhelpers";


interface ToolbarProps {
  isSidePanelOpen: boolean;
  setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Toolbar: React.FC<ToolbarProps> = ({
  isSidePanelOpen,
  setIsSidePanelOpen,
}) => {
  const [selectedTool, setSelectedTool] = useRecoilState<string>(currentTool);
  const [appElements, setAppElements] =
    useRecoilState<ElementsContainer>(DoddleDeskElements);
  const [isShapesMenuOpen, setIsShapesMenuOpen] = useState<boolean>(false);

  const setToolAndActiveElementId = (tool: string) => {
    canvasElements.forEach((element, index) => {
      canvasElements[index] = { ...element, isActive: false };
    });
    setIsShapesMenuOpen(false);
    setSelectedTool(tool);
    setCueBallsAreVisible(false);
    setIsShapesMenuOpen(false);
    setIsSidePanelOpen(false);
    setAppElements([...canvasElements]);
  };


    const handleUndoOperation = () => {
      if(undoStack.length === 0) return;
      
      const poppedElement = undoStack.pop();
      if (poppedElement) {
      redoStack.push(poppedElement);
      
      //after pushing the popped element to redoStack, if the undoStack length is 0, then the top element in the undoStack is the last element in the canvasElements
        if(undoStack.length === 0){
            setCanvasElements([]);
            setIsSidePanelOpen(false);
            setAppElements([]);
            return;
        }

        //if the top element in the undoStack is deleted, then remove the element from the canvasElements otherwise update the element in the canvasElements
      const topElement = undoStack[undoStack.length - 1];
      const topElementIndexInCanvasElements = canvasElements.findIndex(Element => Element.id === poppedElement.id);

      if(topElement.isDeleted){
          const updatedElementsAfterUndoOperation = canvasElements.filter(Element => Element.id !== poppedElement.id);
          setCanvasElements(updatedElementsAfterUndoOperation);
      } else {
          canvasElements[topElementIndexInCanvasElements] = { ...poppedElement};
          setCanvasElements([...canvasElements]);
      }

      setAppElements(() => [...canvasElements]);
      }
    };

    const handleRedoOperation = () => {
      if (redoStack.length === 0) return;
    
      const lastElement = redoStack.pop();
      if (lastElement) {
        undoStack.push(lastElement);
    
        // Determine if lastElement is being re-added or if it was modified
        const elementIndex = canvasElements.findIndex(element => element.id === lastElement.id);
    
        let newElementsAfterRedoOperation;
        if (elementIndex !== -1) {
          // Element exists, so it was modified and we need to update it
          newElementsAfterRedoOperation = canvasElements.map((element, index) => 
            index === elementIndex ? lastElement : element
          );
        } else {
          // Element does not exist, so it was added
          newElementsAfterRedoOperation = [...canvasElements, lastElement];
        }
    
        setCanvasElements(newElementsAfterRedoOperation);
        setAppElements([...newElementsAfterRedoOperation]);
      }
    };


  return (
    <div className="bg-white border-gray-100 border rounded-md relative h-fit flex items-center py-px px-px plus-cursor">
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={() => setToolAndActiveElementId("select")}
          className={`hover:bg-gray-100 outline-none w-full rounded-md px-3 py-2 ${
            selectedTool == "select"
              ? "bg-theme-peach hover:bg-theme-light-peach"
              : "bg-transparent"
          }`}
        >
          <LuMousePointer2 className="text-sm" />
        </button>
        <button
          onClick={() => setToolAndActiveElementId("pencil")}
          className={`hover:bg-gray-100  outline-none rounded-md px-3 py-2 ${
            selectedTool == "pencil"
              ? "bg-theme-peach hover:bg-theme-light-peach"
              : "bg-transparent"
          }`}
        >
          <IoPencilOutline className="text-sm" />
        </button>
        <button
          onClick={() => setToolAndActiveElementId("eraser")}
          className={`hover:bg-gray-100 outline-none rounded-md px-3 py-2 ${
            selectedTool == "eraser"
              ? "bg-theme-peach hover:bg-theme-light-peach"
              : "bg-transparent"
          }`}
        >
          <PiEraserFill className="text-sm" />
        </button>
        <button
          onClick={() => setToolAndActiveElementId("text")}
          className={`hover:bg-gray-100 outline-none rounded-md px-3 py-2 ${
            selectedTool == "text"
              ? "bg-theme-peach hover:bg-theme-light-peach"
              : "bg-transparent"
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
              ? "bg-theme-peach hover:bg-theme-light-peach"
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
          onClick={() => {
            // setToolAndActiveElementId("undo");
            handleUndoOperation();
          }
          }
          className={`hover:bg-gray-100 outline-none rounded-md px-3 py-2 ${
            selectedTool == "undo"
              ? "bg-theme-peach hover:bg-theme-light-peach"
              : "bg-transparent"
          }`}
        >
          <IoCaretBackSharp className="text-base" />
        </button>

        <button
          onClick={() => {
            // setToolAndActiveElementId("redo")
            handleRedoOperation();
          }
          }
          className={`hover:bg-gray-100 outline-none rounded-md px-3 py-2 ${
            selectedTool == "redo"
              ? "bg-theme-peach hover:bg-theme-light-peach"
              : "bg-transparent"
          }`}
        >
          <IoCaretForwardSharp className="text-base" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
