import { atom } from 'recoil';

export type drawableElements = {
    rectangle: boolean,
    biSquare: boolean,
    circle: boolean,
    ellipse: boolean,
    line: boolean,
    text: boolean,
    image: boolean,
    eraser: boolean,
}

export type toolTypes = {
    tools: drawableElements,
    color: string,
    size: number,
    cursor: string,

}

export const tools = atom<toolTypes>({
    key: 'toolSelcted',
    default: {
        tools: {
            rectangle: false,
            biSquare: false,
            circle: false,
            ellipse: false,
            line: false,
            text: false,
            image: false,
            eraser: false,
        },
        color: 'black',
        size: 2,
        cursor: 'plus',
    }
});