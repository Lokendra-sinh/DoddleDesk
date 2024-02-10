import { atom } from 'recoil';

export const currentTool = atom<string>({
    key: 'currentTool',
    default: 'select',
})