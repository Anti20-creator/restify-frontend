import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: true
}

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setLoading } = loadingSlice.actions
export const loadingState = state => state.loading.value
export default loadingSlice.reducer