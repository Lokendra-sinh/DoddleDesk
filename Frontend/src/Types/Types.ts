export type MouseEventType = React.MouseEvent<HTMLCanvasElement, MouseEvent>;
export type Position = {
    x: number;
    y: number;
    };


    
export type ToolFlags = {
    rectangle: boolean,
    biSquare: boolean,
    circle: boolean,
    ellipse: boolean,
    line: boolean,
    pencil: boolean,
    eraser: boolean,
    text: boolean,
    select: boolean,
    grab: boolean,
};

export type ToolProperties = {
    color: string,
    size: number,
};

export type ElementTypes = {
    id: string,
    type: string,
    startCoordinates?: Position,
    endCoordinates?: Position,
    points?: Position[],
    color: string,
    lineWidth: number | 1,
    text?: "",
    fontSize?: 0,
    fontFamily?: "",
    isFilled?: boolean,
    isStroked?: boolean,
    isText?: boolean,
    isErased?: boolean,
    isDragged?: boolean,
    isResized?: boolean,
    isRotated?: boolean,
    isDeleted?: boolean,
    isDrawn?: boolean,
    isActive: boolean,
    zIndex: number,
}

export type ElementsContainer = ElementTypes[];