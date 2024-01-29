import React from "react";
import { RiArrowDropDownFill } from "react-icons/ri";

const Strokes = () => {
  return (
    <span>
      <button className="flex items-center gap-1 hover:bg-gray-100 rounded-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="30">
          <line
            x1="10"
            y1="10"
            x2="20"
            y2="10"
            stroke="black"
            strokeWidth="1"
          />
          <line
            x1="10"
            y1="14"
            x2="20"
            y2="14"
            stroke="black"
            strokeWidth="2.5"
          />
          <line
            x1="10"
            y1="19"
            x2="20"
            y2="19"
            stroke="black"
            strokeWidth="4"
          />
        </svg>
        <RiArrowDropDownFill className="text-base text-red-200" />
      </button>
    </span>
  );
};

export default Strokes;
