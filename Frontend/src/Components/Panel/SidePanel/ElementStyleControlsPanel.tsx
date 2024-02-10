import React, { useState } from "react";
import { useRecoilState } from "recoil";
import {
  currentActiveElementOnCanvas,
  DoddleDeskElements,
} from "../../../Recoil/Atoms/elements";
import { ElementsContainer, ElementTypes } from "../../../Types/Types";
import { doddleDeskColors } from "../../../Utils/doddleDeskColors";
import {
  activeInteractiveElement,
  canvasElements,
  setCanvasElements,
  undoStack,
} from "../../../Utils/interactionhelpers";

let top: number = 0;
let left: number = 0;

export const ElementStyleControlsPanel: React.FC = () => {
  const [strokeColor, setStrokeColor] = useState<string>("red");
  const [fillColor, setFillColor] = useState<string>("red");
  const [strokeWidth, setStrokeWidth] = useState<number>(1);
  const [isStrokeColorMenuOpen, setIsStrokeColorMenuOpen] =
    useState<boolean>(false);
  const [isFillColorMenuOpen, setIsFillColorMenuOpen] =
    useState<boolean>(false);
  const [isStrokeWidthMenuOpen, setIsStrokeWidthMenuOpen] =
    useState<boolean>(false);
  const [activeElement, setActiveElement] = useRecoilState<ElementTypes | null>(
    currentActiveElementOnCanvas
  );
 
  const [appElements, setAppElements] =
    useRecoilState<ElementsContainer>(DoddleDeskElements);
  let activeElementIndex: number | null = null;

  const handleStrokeColorChange = (color: string) => {
    setStrokeColor(color);
    //only update the stroke color of the active element if there is an active element
    if (activeElement) updateElementsAfterStrokeColorChange(color);
  };

  const updateElementsAfterStrokeColorChange = (color: string) => {
    const updatedElements = canvasElements.map((element, index) => {
      const updatedElement = { ...element };
      if (updatedElement.id == activeElement?.id) {
        updatedElement.isStroked = true;
        updatedElement.strokeColor =
          doddleDeskColors[color as keyof typeof doddleDeskColors];
        activeElementIndex = index;
        undoStack.push(updatedElement);
      }
      return updatedElement;
    });

    setCanvasElements([...updatedElements]);
    setAppElements(() => [...updatedElements]);
  };

  const handleFillColorChange = (color: string) => {
    setFillColor(color);
    //only update the fill color of the active element if there is an active element
    if (activeElement) updateElementsAfterFillColorChange(color);
  };

  const updateElementsAfterFillColorChange = (color: string) => {
    const updatedElements = canvasElements.map((element) => {
      const updatedElement = { ...element };
      if (updatedElement.id == activeElement?.id) {
        updatedElement.isFilled = true;
        updatedElement.fillColor =
          doddleDeskColors[color as keyof typeof doddleDeskColors];
        undoStack.push(updatedElement);
      }
      return updatedElement;
    });

    setCanvasElements([...updatedElements]);
    setAppElements(() => [...updatedElements]);
  };

  const handleStrokeWidthChange = (width: number) => {
    setStrokeWidth(width);
    //only update the stroke width of the active element if there is an active element
    if (activeElement) updateElementsAfterStrokeWidthChange(width);
  };

  const updateElementsAfterStrokeWidthChange = (width: number) => {
    const updatedElements = canvasElements.map((element) => {
      const updatedElement = { ...element };
      if (updatedElement.id == activeElement?.id) {
        updatedElement.strokeWidth = width;
        undoStack.push(updatedElement);
      }
      return updatedElement;
    });

    setCanvasElements([...updatedElements]);
    setAppElements(() => [...updatedElements]);
  };

  const handleControlsPanelPosition = () => {

    if(!activeInteractiveElement) return;
    const { startCoordinates, endCoordinates } = activeInteractiveElement!;
    top = startCoordinates!.y - 60;
    left = startCoordinates!.x;

    if(left < 0) left = 0;
    if(top < 150) {
      top = endCoordinates!.y + 10;
    }
    if(top > window.innerHeight) {
      top = window.innerHeight - 10;
    }
  }

  handleControlsPanelPosition();

  return (
    <div 
    className="absolute z-20 flex bg-white rounded-md border border-gray-200 shadow-md py-2 px-2 divide-x divide-gray-200"
    style={{ top: `${top}px`, left: `${left}px` }}
    >
      <button
        className="outline-none px-3"
        onClick={() => {
          setIsFillColorMenuOpen(false);
          setIsStrokeWidthMenuOpen(false);
          setIsStrokeColorMenuOpen(!isStrokeColorMenuOpen);
        }}
      >
        <div className="w-5 h-5 border-4 border-red-400 rounded-full outline-none"></div>
      </button>

      <button
        className="outline-none px-3"
        onClick={() => {
          setIsStrokeColorMenuOpen(false);
          setIsStrokeWidthMenuOpen(false);
          setIsFillColorMenuOpen(!isFillColorMenuOpen);
        }}
      >
        <div className="w-5 h-5 border bg-transparent rounded-full outline-none"></div>
      </button>

      <button
        className="outline-none px-3 flex gap-1 items-center justify-center"
        onClick={() => {
          setIsFillColorMenuOpen(false);
          setIsStrokeColorMenuOpen(false);
          setIsStrokeWidthMenuOpen(!isStrokeWidthMenuOpen);
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="2" y1="3" x2="18" y2="3" stroke="black" strokeWidth="1" />
          <line x1="2" y1="8" x2="18" y2="8" stroke="black" strokeWidth="3" />
          <line x1="2" y1="15" x2="18" y2="15" stroke="black" strokeWidth="5" />
        </svg>

        <svg
          width="10"
          height="10"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5,7 L10,12 L15,7"
            stroke="black"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </button>

      {isStrokeColorMenuOpen && (
        <div className="w-40 absolute -top-20 left-0 gap-3 flex flex-wrap bg-white rounded-md border border-gray-200 shadow-md py-3 px-3">
          <button
            onClick={() => handleStrokeColorChange("border-red-600")}
            className={`w-4 h-4 rounded-full outline-none border-4 border-red-600 ${
              strokeColor == "border-red-600" ? "outline" : ""
            }`}
          ></button>
          <button
            onClick={() => handleStrokeColorChange("border-orange-500")}
            className={`w-4 h-4 rounded-full outline-none border-4 border-orange-500 ${
              strokeColor == "border-orange-500" ? "" : ""
            }`}
          ></button>
          <button
            onClick={() => handleStrokeColorChange("border-lime-500")}
            className={`w-4 h-4 rounded-full outline-none border-4 border-lime-500 ${
              strokeColor == "border-lime-500" ? "" : ""
            }`}
          ></button>
          <button
            onClick={() => handleStrokeColorChange("border-blue-600")}
            className={`w-4 h-4 rounded-full outline-none border-4 border-blue-600 ${
              strokeColor == "border-blue-600" ? "" : " "
            }`}
          ></button>
          <button
            onClick={() => handleStrokeColorChange("border-violet-600")}
            className={`w-4 h-4 rounded-full outline-none border-4 border-violet-600 ${
              strokeColor == "border-violet-600" ? "" : " "
            }`}
          ></button>
          <button
            onClick={() => handleStrokeColorChange("border-fuchsia-500")}
            className={`w-4 h-4 rounded-full outline-none border-4 border-fuchsia-500 ${
              strokeColor == "border-fuchsia-500" ? "" : " "
            }`}
          ></button>
          <button
            onClick={() => handleStrokeColorChange("border-pink-400")}
            className={`w-4 h-4 rounded-full outline-none border-4 border-pink-400 ${
              strokeColor == "border-pink-400" ? "" : " "
            }`}
          ></button>
          <button
            onClick={() => handleStrokeColorChange("border-rose-600")}
            className={`w-4 h-4 rounded-full outline-none border-4 border-rose-600 ${
              strokeColor == "border-rose-600" ? "" : " "
            }`}
          ></button>
        </div>
      )}

      {isFillColorMenuOpen && (
        <div className="w-56 absolute -top-20 left-0 gap-3 flex flex-wrap bg-white rounded-md border border-gray-200 shadow-md py-3 px-3">
          <button
            onClick={() => handleFillColorChange("bg-red-300")}
            className={`w-4 h-4 rounded-full outline-none bg-red-300 ${
              fillColor == "bg-red-300" ? "ring-2 ring-gray-400" : ""
            }`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-orange-500")}
            className={`w-4 h-4 rounded-full outline-none bg-orange-500 ${
              fillColor == "bg-orange-500" ? "ring-2 ring-gray-400" : ""
            }`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-lime-500")}
            className={`w-4 h-4 rounded-full outline-none bg-lime-500 ${
              fillColor == "bg-lime-500" ? "ring-2 ring-gray-400" : ""
            }`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-blue-600")}
            className={`w-4 h-4 rounded-full outline-none bg-blue-600 ${
              fillColor == "bg-blue-600" ? "ring-2 ring-gray-400" : ""
            }`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-violet-600")}
            className={`w-4 h-4 rounded-full outline-none bg-violet-600 ${
              fillColor == "bg-violet-600" ? "ring-2 ring-gray-400" : ""
            }`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-fuchsia-500")}
            className={`w-4 h-4 rounded-full outline-none bg-fuchsia-500 ${
              fillColor == "bg-fuchsia-500" ? "ring-2 ring-gray-400" : ""
            }`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-pink-400")}
            className={`w-4 h-4 rounded-full outline-none bg-pink-400 ${
              fillColor == "bg-pink-400" ? "ring-2 ring-gray-400" : ""
            }`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-rose-600")}
            className={`w-4 h-4 rounded-full outline-none bg-rose-600 ${
              fillColor == "bg-rose-600" ? "ring-2 ring-gray-400" : ""
            }`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-slate-600")}
            className={`w-4 h-4 rounded-full outline-none bg-slate-600 ${
              fillColor == "bg-slate-600" ? "ring-2 ring-gray-400" : ""
            }`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-zinc-500")}
            className={`w-4 h-4 rounded-full outline-none bg-zinc-500 ${
              fillColor == "bg-zinc-500" ? "ring-2 ring-gray-400" : ""
            }`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-amber-500")}
            className={`w-4 h-4 rounded-full outline-none bg-amber-500 ${
              fillColor == "bg-amber-500" ? "ring-2 ring-gray-400" : ""
            }`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-yellow-300")}
            className={`w-4 h-4 rounded-full outline-none bg-yellow-300 ${
              fillColor == "bg-yellow-300" ? "ring-2 ring-gray-400" : ""
            }`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-green-500")}
            className={`w-4 h-4 rounded-full outline-none bg-green-500 ${
              fillColor == "bg-green-500" ? "ring-2 ring-gray-400" : ""
            }`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-cyan-400")}
            className={`w-4 h-4 rounded-full outline-none bg-cyan-400 ${
              fillColor == "bg-cyan-400" ? "ring-2 ring-gray-400" : ""
            }`}
          ></button>
          {/* <button
            onClick={() => handleFillColorChange("bg-indigo-300")}
            className={`w-4 h-4 rounded-full outline-none bg-indigo-300 ${
              fillColor == "bg-indigo-300" ? "ring-2 ring-gray-400" : ""
            }`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-indigo-800")}
            className={`w-4 h-4 rounded-full outline-none bg-indigo-800 ${
              fillColor == "bg-indigo-800" ? "ring-2 ring-gray-400" : ""
            }`}
          ></button> */}
        </div>
      )}

      {isStrokeWidthMenuOpen && (
        <div className="w-20 flex-col absolute -top-20 right-0 bg-white rounded-md border border-gray-200 shadow-md py-1 px-1">
          <button
            className="w-full flex justify-center items-center hover:bg-gray-100 rounded-sm p-1" // Adjusted padding here
            onClick={() => handleStrokeWidthChange(1)}
          >
            <svg
              width="100%"
              height="10"
              viewBox="0 0 40 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0"
                y1="5"
                x2="40"
                y2="5"
                stroke="black"
                strokeWidth="1"
              />
            </svg>
          </button>
          <button
            className="w-full flex justify-center items-center hover:bg-gray-100 rounded-sm p-1" // Adjusted padding here
            onClick={() => handleStrokeWidthChange(3)}
          >
            <svg
              width="100%"
              height="10"
              viewBox="0 0 40 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0"
                y1="5"
                x2="40"
                y2="5"
                stroke="black"
                strokeWidth="3"
              />
            </svg>
          </button>
          <button
            className="w-full flex justify-center items-center hover:bg-gray-100 rounded-sm p-1" // Adjusted padding here
            onClick={() => handleStrokeWidthChange(5)}
          >
            <svg
              width="100%"
              height="10"
              viewBox="0 0 40 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0"
                y1="5"
                x2="40"
                y2="5"
                stroke="black"
                strokeWidth="5"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ElementStyleControlsPanel;
