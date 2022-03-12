import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
    modified: null,
    sizeX: 0,
    sizeY: 0
}

export const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        updateLayout: (state, action) => {
            state.value = action.payload
        },
        updateSize: (state, action) => {
            state.sizeX = action.payload.sizeX
            state.sizeY = action.payload.sizeY
        },
        setModifiedLayout: (state, action) => {
            if (!window.location.href.includes("settings")) {
                state.value = action.payload
            }else{
                state.modified = action.payload
            }
        },
        refreshLayout: (state) => {
            state.value = state.modified ? state.modified.slice() : []
            state.modified = null
        }
    }
})

export const { updateLayout, setModifiedLayout, refreshLayout, updateSize } = layoutSlice.actions
export const layout = state => state.layout.value
export const modifiedLayout = state => state.layout.modified
export const layoutWidthSelector = state => state.layout.sizeX
export const layoutHeightSelector = state => state.layout.sizeY

export default layoutSlice.reducer