import { atom } from 'jotai'

interface IWebviewComponents {
    id: number
}

export const webviewComponents = atom(['test'], (get, set, update) => {
    // `update` is any single value we receive for updating this atom
    set(update as any)
})
