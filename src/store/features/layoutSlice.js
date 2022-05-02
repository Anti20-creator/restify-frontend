import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
    modified: null,
    modifiedSize: null,
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
            if (!window.location.href.includes("edit")) {
                state.value = action.payload
            }else{
                state.modified = action.payload
            }
        },
        setModifiedLayoutSize: (state, action) => {
            console.log(action.payload)
            if (!window.location.href.includes("edit")) {
                state.sizeX = action.payload.sizeX
                state.sizeY = action.payload.sizeY
            }else{
                state.modifiedSize = action.payload
            }
        },
        refreshLayout: (state) => {
            if (state.modified) {
                state.value = state.modified.slice()
            }
            state.modified = null
        },
        refreshLayoutSize: (state) => {
            if (state.modifiedSize.sizeX) {
                state.sizeX = state.modifiedSize.sizeX
            }
            if (state.modifiedSize.sizeY) {
                state.sizeY = state.modifiedSize.sizeY
            }
            state.modifiedSize = null
        }
    }
})

export const { updateLayout, setModifiedLayout, refreshLayout, updateSize, setModifiedLayoutSize, refreshLayoutSize } = layoutSlice.actions
export const layout = state => state.layout.value
export const modifiedLayout = state => state.layout.modified || state.layout.modifiedSize
export const layoutWidthSelector = state => state.layout.sizeX
export const layoutHeightSelector = state => state.layout.sizeY

export default layoutSlice.reducer