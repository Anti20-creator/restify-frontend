import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    invoiceOpen: false,
    liveViewMobileMode: false,
    currency: ''
}

export const temporarySlice = createSlice({
    name: 'temp',
    initialState,
    reducers: {
        setInvoiceViewOpen: (state, action) => {
            state.invoiceOpen = action.payload
        },
        setLiveViewMobileMode: (state, action) => {
            state.liveViewMobileMode = action.payload
        },
        setCurrency: (state, action) => {
            state.currency = action.payload
        }
    }
})

export const { setInvoiceViewOpen, setLiveViewMobileMode, setCurrency } = temporarySlice.actions

export const isInvoiceOpenSelector  = state => state.temporary.invoiceOpen
export const isInMobileModeSelector = state => state.temporary.liveViewMobileMode
export const getCurrency            = state => state.temporary.currency

export default temporarySlice.reducer