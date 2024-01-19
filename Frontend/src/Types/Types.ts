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
    type: string,
    startCoordinates: Position,
    endCoordinates: Position,
    color: string,
    size: number,
    cornerRadius? : number,
    cursor: string,
    id: string,
    active: boolean,
}

export type BoundingBoxAndCueBalls = {
boundingBox: {
    x: number,
    y: number,
    width: number,
    height: number,
},
cueBalls: {
    topLeft: {
        x: number,
        y: number,
    },
    topRight: {
        x: number,
        y: number,
    },
    bottomLeft: {
        x: number,
        y: number,
    },
    bottomRight: {
        x: number,
        y: number,
    },
    topMiddle: {
        x: number,
        y: number,
    },
    bottomMiddle: {
        x: number,
        y: number,
    },
    leftMiddle: {
        x: number,
        y: number,
    },
    rightMiddle: {
        x: number,
        y: number,
    },
}
};

export type ElementsContainer = ElementTypes[];