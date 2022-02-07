import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: []
}

export const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        setItems: (state, action) => {
            state.value = action.payload
        },
        addOne: (state, action) => {
            state.value.find(item => item.name === action.payload.name).quantity += 1
        },
        removeOne: (state, action) => {
            state.value.find(item => item.name === action.payload.name).quantity -= 1
            if(state.value.find(item => item.name === action.payload.name).quantity === 0) {
                const index = state.value.findIndex(item => item.name === action.payload.name)
                state.value.splice(index, 1)
            }
        },
        removeAll: (state, action) => {
            const index = state.value.findIndex(item => item.name === action.payload.name)
            state.value.splice(index, 1)
        },
        addItem: (state, action) => {
            const index = state.value.findIndex(item => item.name === action.payload.name)
            if(index !== -1) {
                state.value[index].quantity += 1
            }else{
                state.value.push(action.payload)
            }
        },
        clear: (state) => {
            state.value = []
        }
    }
})

export const { setItems, addItem, removeAll, addOne, removeOne, clear } = invoiceSlice.actions
export const invoiceItems = state => state.invoiceItems.value
export default invoiceSlice.reducer