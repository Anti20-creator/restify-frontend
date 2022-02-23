import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
    modified: null
}

export const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        updateLayout: (state, action) => {
            state.value = action.payload
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

export const { updateLayout, setModifiedLayout, refreshLayout } = layoutSlice.actions
export const layout = state => state.layout.value
export const modifiedLayout = state => state.layout.modified

export default layoutSlice.reducer