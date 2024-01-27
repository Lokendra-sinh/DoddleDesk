
import { activeForegroundElement } from '../../Components/Board/Board';
import { drawCircle } from "../shapes/circle";
import { drawEllipse } from "../shapes/ellipse";
import { drawRectangle } from "../shapes/rectangle";
import { drawBiSquare } from "../shapes/biSquare";
import { drawPencil } from "../shapes/pencil";
import { drawResizeHandlesAndBoundingBox } from '../Resize/handleResizeHandlesAndBoundingBox';

let animationFrameId: number | null = null;
interface AnimateForegroundElement {
    startAnimation: () => void;
    stopAnimation: () => void;
}

type Nothing = void | null | undefined;

export function animateForegroundElement(
  foregroundContext: CanvasRenderingContext2D,
): AnimateForegroundElement | Nothing {
    if(!foregroundContext) return;

    let selectedTool = activeForegroundElement!.type;
    const drawSelectedTool = () => {
        switch (selectedTool) {
            case "circle":
                return drawCircle(foregroundContext, activeForegroundElement!);
            break;
            case "ellipse":
                return drawEllipse(foregroundContext, activeForegroundElement!);
            break;
            case "rectangle":
                return drawRectangle(foregroundContext, activeForegroundElement!);
            break;
            case "biSquare":
                return drawBiSquare(foregroundContext, activeForegroundElement!);
            break;
            case "pencil":
                return drawPencil(foregroundContext, activeForegroundElement!);
            break;
            case "text":
            break;
        }
    }
    
    function animate(){
        animationFrameId = requestAnimationFrame(animate);
        foregroundContext!.clearRect(0, 0, foregroundContext!.canvas.width, foregroundContext!.canvas.height);
        drawSelectedTool();
        if(activeForegroundElement!.isActive){
            drawResizeHandlesAndBoundingBox(foregroundContext, activeForegroundElement!);
        }
    }

    function startAnimation(){
        if(animationFrameId === null){
            animationFrameId = requestAnimationFrame(animate);
        }
    }

    function stopAnimation(){
        if(animationFrameId){
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            // foregroundContext!.clearRect(0, 0, foregroundContext!.canvas.width, foregroundContext!.canvas.height);
            
        }
    }

    return {startAnimation, stopAnimation};

}
