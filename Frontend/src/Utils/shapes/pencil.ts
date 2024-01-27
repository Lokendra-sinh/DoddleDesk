import { activeForegroundElement } from "../../Components/Board/Board";
import { ElementTypes } from "../../Types/Types";


export function drawPencil(
    ctx: CanvasRenderingContext2D,
    element: ElementTypes,
  ) {
   
    if(!ctx || !element!.points || element!.points.length < 1) return;

    ctx.beginPath();
    ctx.strokeStyle = element!.color;
    ctx.lineWidth = element!.lineWidth;
    ctx.lineCap = "round";

    ctx.moveTo(element!.points[0].x, element!.points[0].y);

    for(let i = 1; i < element!.points.length; i++) {
        ctx.lineTo(element!.points[i].x, element!.points[i].y);
        ctx.moveTo(element!.points[i].x, element!.points[i].y);
    }

    ctx.stroke();
   
  }