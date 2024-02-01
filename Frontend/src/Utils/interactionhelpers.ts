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
    if(!elements) return;
    if(elements.length === 0){
      canvasElements.length = 0;
      return;
    }
    canvasElements.length = 0;
    elements.forEach((element) => {
    canvasElements.push(element);
  });
}
export const cursorWidth = 2;
export let cursorHeight = 20;
export const setCursorHeight = (height: number) => {
  cursorHeight = height;
};
export const cursorColor = "black";
export const cursorBlinkingInterval = 500;
export let cursorPosition = {
  x: 0,
  y: 0,
};
export function setCursorPosition(x: number, y: number) {
  cursorPosition.x = x;
  cursorPosition.y = y;
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

export const trailPointLifeSpan = 100;
export const eraserFadeTrailPoints: {x: number, y: number, drawnTime: number}[] = [];
export function setEraserFadeTrailPoints(points: {x: number, y: number, drawnTime: number}[]){
  eraserFadeTrailPoints.length = 0;
  points.forEach(point => {
    eraserFadeTrailPoints.push(point);
  })
}
export let blinkingCursorIntervalId: number | undefined = undefined;
export const setBlinkingCursorIntervalId = (id: number | undefined) => {
  blinkingCursorIntervalId = id;
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
overlayForDrag.style.zIndex = "9999";
overlayForDrag.style.display = "none";
overlayForDrag.style.backgroundColor = "transparent";
overlayForDrag.style.pointerEvents = "all";
overlayForDrag.className = "overlay-for-dragging";

document.body.appendChild(overlayForDrag);


export const undoStack: ElementsContainer = [];
export const redoStack: ElementsContainer = [];