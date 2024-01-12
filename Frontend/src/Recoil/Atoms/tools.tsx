import { atom } from 'recoil';

export type toolTypes = {
    tools: {
        square: boolean,
        biSquare: boolean,
        circle: boolean,
        line: boolean,
        text: boolean,
        image: boolean,
        eraser: boolean,
    }
    color: string,
    size: number,
    cursor: string,

}

export const tools = atom<toolTypes>({
    key: 'toolSelcted',
    default: {
        tools: {
            square: false,
            biSquare: false,
            circle: false,
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