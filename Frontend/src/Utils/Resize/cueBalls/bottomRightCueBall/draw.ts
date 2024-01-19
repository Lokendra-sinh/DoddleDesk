import { attachListeners } from "../bottomRightCueBall/listeners";

export function drawBottomRightCueBall(left: number, top: number, width: string, height: string, canvasRef: React.RefObject<HTMLCanvasElement>) {
  let bottomRightCueBall = document.querySelector('.bottom-right-cue-ball') as HTMLDivElement;
  if(!bottomRightCueBall) {
  bottomRightCueBall = document.createElement("div");
  bottomRightCueBall.style.position = "absolute";
  bottomRightCueBall.style.zIndex = "1001"
  bottomRightCueBall.style.border = "2px solid #fecdd3";
  bottomRightCueBall.style.width = width;
  bottomRightCueBall.style.height = height;
  bottomRightCueBall.style.borderRadius = "30%";
  bottomRightCueBall.style.backgroundColor = "white";
  bottomRightCueBall.style.pointerEvents = "all";
  bottomRightCueBall.className = "bottom-right-cue-ball";
  document.body.appendChild(bottomRightCueBall);

  attachListeners(bottomRightCueBall, canvasRef);
  }

  bottomRightCueBall.style.left = `${left}px`;
  bottomRightCueBall.style.top = `${top}px`;
  bottomRightCueBall.style.display = "block";

}