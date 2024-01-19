import React from "react";
import { ElementTypes } from "../Types/Types";
import { drawRectangle } from "./shapes/rectangle";
import { drawCircle } from "./shapes/circle";
import { drawEllipse } from "./shapes/ellipse";
import { drawBiSquare } from "./shapes/biSquare";

export function drawElement(ctx: CanvasRenderingContext2D, element: ElementTypes) {
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