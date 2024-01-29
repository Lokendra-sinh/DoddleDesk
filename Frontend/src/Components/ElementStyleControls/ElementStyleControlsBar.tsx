import React from "react";
import ColorPicker from "./ColorPicker";
import Strokes from "./Strokes";
import "./ElementStyleControlsBar.css"

const ElementStyleControlsBar: React.FC = () => {
  return (
    <div className="control-bar py-1 px-1 bg-white border-gray-100 border rounded-sm absolute z-[10] h-fit flex items-center plus-cursor">
      <ColorPicker />
      <Strokes />
    </div>
  );
};

export default ElementStyleControlsBar;
