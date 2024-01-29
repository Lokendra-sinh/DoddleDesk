import { ElementTypes, ElementsContainer } from "../Types/Types";

export let activeInteractiveElement: ElementTypes | undefined = undefined;
export function setActiveInteractiveElement(element: ElementTypes | undefined) {
  activeInteractiveElement = element;
}

export const canvasElements: ElementsContainer = [];

export const addCanvasElement = (element: ElementTypes) => {
    if(!element) return;
    canvasElements.push(element);
};

export function setCanvasElements(elements: ElementsContainer) {
    if(!elements || elements.length === 0) return;
    canvasElements.length = 0;
    elements.forEach((element) => {
    canvasElements.push(element);
  });
}

export let globalCursorStyle: string = "default";
export function setGlobalCursorStyle(cursorStyle: string) {
  globalCursorStyle = cursorStyle;
}

export let isElementMoving : boolean = false;
export function setIsElementMoving(value: boolean){
  isElementMoving = value;
}

export let isElementResizing: boolean = false;
export function setIsElementResizing(value: boolean){
  isElementResizing = value;
}

export const MARGIN_GAP = 8;
export const CIRCLE_MARGIN_GAP = 1;
export const BALL_RADIUS = 4;
export const BOUNDING_BOX_COLOR = "#0891b2";
export const CUE_BALL_COLOR = "#06b6d4";
export let areListenersAttached = false;
export let cueBallsAreVisible = false;
export const setCueBallsAreVisible = (value: boolean) => {
    cueBallsAreVisible = value;
};
export const setAreListenersAttached = (value: boolean) => {
    areListenersAttached = value;
};
export const boundingBoxProperties = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    width: 0,
    height: 0,
    };
export const cueBallProperties = {
    topLeft: {
        x: 0,
        y: 0,
    },
    topMiddle: {
        x: 0,
        y: 0,
    },
    topRight: {
        x: 0,
        y: 0,
    },
    leftMiddle: {
        x: 0,
        y: 0,
    },
    rightMiddle: {
        x: 0,
        y: 0,
    },
    bottomLeft: {
        x: 0,
        y: 0,
    },
    bottomMiddle: {
        x: 0,
        y: 0,
    },
    bottomRight: {
        x: 0,
        y: 0,
    },
};


export const overlayForDrag = document.createElement("div");
overlayForDrag.style.position = "fixed";
overlayForDrag.style.top = "0";
overlayForDrag.style.left = "0";
overlayForDrag.style.width = `${window.innerWidth}px`;
overlayForDrag.style.height = `${window.innerHeight}px`;
overlayForDrag.style.cursor = "nwse-resize";
overlayForDrag.style.zIndex = "5";
overlayForDrag.style.display = "none";
overlayForDrag.style.backgroundColor = "transparent";
overlayForDrag.style.pointerEvents = "all";
overlayForDrag.className = "overlay-for-dragging";

document.body.appendChild(overlayForDrag);

const ballWidth = "10px";
const ballHeight = "10px";

export const boundingBox = document.createElement("div");
boundingBox.style.position = "absolute";
boundingBox.style.zIndex = "5";
boundingBox.style.border = "2px solid #0891b2";
boundingBox.style.pointerEvents = "none"; // To pass click events to canvas
boundingBox.className = "bounding-box";
document.body.appendChild(boundingBox);

export const bottomLeftCueBall = document.createElement("div");
setCueBallProperties(bottomLeftCueBall, "bottom-left-cue-ball");
export const bottomMiddleCueBall = document.createElement("div");
setCueBallProperties(bottomMiddleCueBall, "bottom-middle-cue-ball");
export const bottomRightCueBall = document.createElement("div");
setCueBallProperties(bottomRightCueBall, "bottom-right-cue-ball");
export const leftMiddleCueBall = document.createElement("div");
setCueBallProperties(leftMiddleCueBall, "left-middle-cue-ball");
export const rightMiddleCueBall = document.createElement("div");
setCueBallProperties(rightMiddleCueBall, "right-middle-cue-ball");
export const topLeftCueBall = document.createElement("div");
setCueBallProperties(topLeftCueBall, "top-left-cue-ball");
export const topMiddleCueBall = document.createElement("div");
setCueBallProperties(topMiddleCueBall, "top-middle-cue-ball");
export const topRightCueBall = document.createElement("div");
setCueBallProperties(topRightCueBall, "top-right-cue-ball");



function setCueBallProperties(
  cueBall: HTMLDivElement,
  cueBallName: string,
) {
  cueBall.style.position = "absolute";
  cueBall.style.zIndex = "5";
  cueBall.style.border = "1px solid #0891b2";
  cueBall.style.width = ballWidth;
  cueBall.style.height = ballHeight;
  cueBall.style.borderRadius = "30%";
  cueBall.style.backgroundColor = "white";
  cueBall.style.pointerEvents = "auto";
  cueBall.style.display = "none";
  cueBall.className = `${cueBallName} resize-handle`;
  document.body.appendChild(cueBall);
}