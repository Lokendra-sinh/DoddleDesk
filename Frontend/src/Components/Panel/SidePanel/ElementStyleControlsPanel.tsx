import React, { useState } from "react";
import { useRecoilState} from "recoil";
import { currentActiveElementOnCanvas, DoddleDeskElements } from "../../../Recoil/Atoms/elements";
import { ElementsContainer, ElementTypes } from "../../../Types/Types";
import { doddleDeskColors } from "../../../Utils/doddleDeskColors";
import { canvasElements, setCanvasElements } from "../../../Utils/interactionhelpers";

export const ElementStyleControlsPanel = () => {
  const [strokeColor, setStrokeColor] = useState<string>("red");
  const [fillColor, setFillColor] = useState<string>("red");
  const [strokeWidth, setStrokeWidth] = useState<number>(1);
  const [activeElement, setActiveElement] = useRecoilState<ElementTypes | null>(currentActiveElementOnCanvas);
  const [appElements, setAppElements] = useRecoilState<ElementsContainer>(DoddleDeskElements);
  let activeElementIndex: number | null = null;

  const handleStrokeColorChange = (color: string) => {
    setStrokeColor(color);
    //only update the stroke color of the active element if there is an active element
    if(activeElement) updateElementsAfterStrokeColorChange(color);
  };

    const updateElementsAfterStrokeColorChange = (color: string) => {
        const updatedElements = canvasElements.map((element, index) => {
        if(element.id == activeElement?.id) {
            return {...element, strokeColor: doddleDeskColors[color as keyof typeof doddleDeskColors]};
        } else {
            return element;
        }
        });
       console.log("updatedElements after stroke color change: ", updatedElements);
        setCanvasElements([...updatedElements]);
        setAppElements(updatedElements);
    };

  const handleFillColorChange = (color: string) => {
    setFillColor(color);
    //only update the fill color of the active element if there is an active element
    if(activeElement) updateElementsAfterFillColorChange(color);
  };

    const updateElementsAfterFillColorChange = (color: string) => {
      console.log("selected fill color: ", color);
        console.log("filled color is: ", doddleDeskColors[color as keyof typeof doddleDeskColors]);
        const updatedElements = canvasElements.map((element) => {
        if(element.id == activeElement?.id) {
            return {...element, fillColor: doddleDeskColors[color as keyof typeof doddleDeskColors]};
        } else {
            return element;
        }
        });
        console.log("updatedElements after fill color change: ", updatedElements);
        setCanvasElements([...updatedElements]);
        setAppElements(() => [...updatedElements]);
    };

  const handleStrokeWidthChange = (width: number) => {
    setStrokeWidth(width);
    //only update the stroke width of the active element if there is an active element
    if(activeElement) updateElementsAfterStrokeWidthChange(width);
  };

    const updateElementsAfterStrokeWidthChange = (width: number) => {
        const updatedElements = canvasElements.map((element) => {
        if(element.id == activeElement?.id) {
            return {...element, strokeWidth: width};
        } else {
            return element;
        }
        });
        console.log("updatedElements after stroke width change: ", updatedElements);
        setCanvasElements([...updatedElements]);
        setAppElements(() => [...updatedElements]);
    };

  return (
    <div className="absolute top-20 left-2 z-20 flex flex-col gap-3 py-2 w-52 bg-white rounded-md border border-gray-200 shadow-md px-2 py-1">
      <div className="flex flex-col gap-2 ">
        <p className="text-sm font-medium text-gray-600">Stroke</p>
        <div className="w-full flex flex-wrap gap-1">
          <button
            onClick={() => handleStrokeColorChange("border-red-600")}
            className={`w-5 h-5 rounded-md outline-none border border-red-600 ${
              strokeColor == "border-red-600"
                ? "ring-2 ring-red-600"
                : "ring-0 ring-red-600"
            }`}
          ></button>
          <button
            onClick={() => handleStrokeColorChange("border-orange-500")}
            className={`w-5 h-5 rounded-md outline-none border border-orange-500 ${
              strokeColor == "border-orange-500"
                ? "ring-2 ring-orange-500"
                : "ring-0 ring-orange-500"
            }`}
          ></button>
          <button
            onClick={() => handleStrokeColorChange("border-lime-500")}
            className={`w-5 h-5 rounded-md outline-none border border-lime-500 ${
              strokeColor == "border-lime-500"
                ? "ring-2 ring-lime-500"
                : "ring-0 ring-lime-500"
            }`}
          ></button>
          <button
            onClick={() => handleStrokeColorChange("border-blue-600")}
            className={`w-5 h-5 rounded-md outline-none border border-blue-600 ${
              strokeColor == "border-blue-600"
                ? "ring-2 ring-blue-600"
                : " ring-0 ring-blue-600"
            }`}
          ></button>
          <button
            onClick={() => handleStrokeColorChange("border-violet-600")}
            className={`w-5 h-5 rounded-md outline-none border border-violet-600 ${
              strokeColor == "border-violet-600"
                ? "ring-2 ring-violet-600"
                : " ring-0 ring-violet-600"
            }`}
          ></button>
          <button
            onClick={() => handleStrokeColorChange("border-fuchsia-500")}
            className={`w-5 h-5 rounded-md outline-none border border-fuchsia-500 ${
              strokeColor == "border-fuchsia-500"
                ? "ring-2 ring-fuchsia-500"
                : " ring-0 ring-fuchsia-500"
            }`}
          ></button>
          <button
            onClick={() => handleStrokeColorChange("border-pink-400")}
            className={`w-5 h-5 rounded-md outline-none border border-pink-400 ${
              strokeColor == "border-pink-400"
                ? "ring-2 ring-pink-400"
                : " ring-0 ring-pink-400"
            }`}
          ></button>
          <button
            onClick={() => handleStrokeColorChange("border-rose-600")}
            className={`w-5 h-5 rounded-md outline-none border border-rose-600 ${
              strokeColor == "border-rose-600"
                ? "ring-2 ring-rose-600"
                : " ring-0 ring-rose-600"
            }`}
          ></button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 ">
        <p className="text-sm font-medium text-gray-600">Fill</p>
        <div className="w-full flex flex-wrap gap-1">
          <button
            onClick={() => handleFillColorChange("bg-red-300")}
            className={`w-5 h-5 rounded-md outline-none bg-red-300 ${fillColor == "bg-red-300" ? "ring-2 ring-gray-400" : ""}`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-orange-500")}
            className={`w-5 h-5 rounded-md outline-none bg-orange-500 ${fillColor == "bg-orange-500" ? "ring-2 ring-gray-400" : ""}`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-lime-500")}
            className={`w-5 h-5 rounded-md outline-none bg-lime-500 ${fillColor == "bg-lime-500" ? "ring-2 ring-gray-400" : ""}`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-blue-600")}
            className={`w-5 h-5 rounded-md outline-none bg-blue-600 ${fillColor == "bg-blue-600" ? "ring-2 ring-gray-400" : ""}`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-violet-600")}
            className={`w-5 h-5 rounded-md outline-none bg-violet-600 ${fillColor == "bg-violet-600" ? "ring-2 ring-gray-400" : ""}`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-fuchsia-500")}
            className={`w-5 h-5 rounded-md outline-none bg-fuchsia-500 ${fillColor == "bg-fuchsia-500" ? "ring-2 ring-gray-400" : ""}`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-pink-400")}
            className={`w-5 h-5 rounded-md outline-none bg-pink-400 ${fillColor == "bg-pink-400" ? "ring-2 ring-gray-400" : ""}`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-rose-600")}
            className={`w-5 h-5 rounded-md outline-none bg-rose-600 ${fillColor == "bg-rose-600" ? "ring-2 ring-gray-400" : ""}`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-slate-600")}
            className={`w-5 h-5 rounded-md outline-none bg-slate-600 ${fillColor == "bg-slate-600" ? "ring-2 ring-gray-400" : ""}`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-zinc-500")}
            className={`w-5 h-5 rounded-md outline-none bg-zinc-500 ${fillColor == "bg-zinc-500" ? "ring-2 ring-gray-400" : ""}`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-amber-500")}
            className={`w-5 h-5 rounded-md outline-none bg-amber-500 ${fillColor == "bg-amber-500" ? "ring-2 ring-gray-400" : ""}`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-yellow-300")}
            className={`w-5 h-5 rounded-md outline-none bg-yellow-300 ${fillColor == "bg-yellow-300" ? "ring-2 ring-gray-400" : ""}`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-green-500")}
            className={`w-5 h-5 rounded-md outline-none bg-green-500 ${fillColor == "bg-green-500" ? "ring-2 ring-gray-400" : ""}`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-cyan-400")}
            className={`w-5 h-5 rounded-md outline-none bg-cyan-400 ${fillColor == "bg-cyan-400" ? "ring-2 ring-gray-400" : ""}`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-indigo-300")}
            className={`w-5 h-5 rounded-md outline-none bg-indigo-300 ${fillColor == "bg-indigo-300" ? "ring-2 ring-gray-400" : ""}`}
          ></button>
          <button
            onClick={() => handleFillColorChange("bg-indigo-800")}
            className={`w-5 h-5 rounded-md outline-none bg-indigo-800 ${fillColor == "bg-indigo-800" ? "ring-2 ring-gray-400" : ""}`}
          ></button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-600">Stroke Width</p>
        <div className="w-full flex flex-wrap gap-1">
          {/* Button with strokeWidth 1 */}
          <button 
          onClick={() => handleStrokeWidthChange(1)}
          className={`w-5 h-5 rounded-md outline-none border border-gray-400 flex justify-center items-center ${strokeWidth == 1 ? "ring-2 ring-gray-400" : ""}`}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <line x1="5" y1="12" x2="19" y2="12" strokeWidth="1" />
            </svg>
          </button>

          {/* Button with strokeWidth 2 */}
          <button 
          onClick={() => handleStrokeWidthChange(3)}
          className={`w-5 h-5 rounded-md outline-none border border-gray-400 flex justify-center items-center ${strokeWidth == 3 ? "ring-2 ring-gray-400" : ""}`}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <line x1="5" y1="12" x2="19" y2="12" strokeWidth="3" />
            </svg>
          </button>

          {/* Button with strokeWidth 3 */}
          <button 
          onClick={() => handleStrokeWidthChange(5)}
          className={`w-5 h-5 rounded-md outline-none border border-gray-400 flex justify-center items-center ${strokeWidth == 5 ? "ring-2 ring-gray-400" : ""}`}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <line x1="5" y1="12" x2="19" y2="12" strokeWidth="5" />
            </svg>
          </button>

          {/* Button with strokeWidth 4 */}
          <button 
          onClick={() => handleStrokeWidthChange(7)}
          className={`w-5 h-5 rounded-md outline-none border border-gray-400 flex justify-center items-center ${strokeWidth == 7 ? "ring-2 ring-gray-400" : ""}`}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <line x1="5" y1="12" x2="19" y2="12" strokeWidth="7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
