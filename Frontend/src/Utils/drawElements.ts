import React from "react";
import { elementTypes, elementsContainer } from "../Recoil/Atoms/elements";
import { drawRectangle } from "./shapes/rectangle";
import { drawCircle } from "./shapes/circle";
import { drawEllipse } from "./shapes/ellipse";
import { drawBiSquare } from "./shapes/biSquare";

export function drawElements(ctx: CanvasRenderingContext2D, element: elementTypes) {
  if (!ctx) return;

   switch(element.type) {
     case "rectangle":
       drawRectangle(ctx, element);
       break;
     case "circle":
       drawCircle(ctx, element);
       break;
     case "ellipse":
       drawEllipse(ctx, element);
       break;
     case "biSquare":
       drawBiSquare(ctx, element);
       break;
     default:
       break;
   }
}