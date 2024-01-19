import { atom } from 'recoil';
import { ToolFlags, ToolProperties } from '../../Types/Types';


export const toolFlags = atom<ToolFlags>({
    key: 'toolFlags',
    default: {
        rectangle: false,
        biSquare: false,
        circle: false,
        ellipse: false,
        line: false,
        pencil: false,
        eraser: false,
        text: false,
        select: true,
        grab: false,
    }
});

export const toolProperties = atom<ToolProperties>({
    key: 'toolProperties',
    default: {
        color: 'black',
        size: 2,
    }
});

export const currentTool = atom<string>({
    key: 'currentTool',
    default: 'select',
})