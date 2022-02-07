import { configureStore } from '@reduxjs/toolkit'
import layoutReducer from './features/layoutSlice'
import menuReducer from './features/menuSlice'
import loadingReducer from './features/loadingSlice'
import liveReducer from './features/liveSlice'
import invoiceReducer from './features/invoiceSlice'

export const store = configureStore({
    reducer: {
        layout: layoutReducer,
        menu: menuReducer,
        loading: loadingReducer,
        live: liveReducer,
        invoiceItems: invoiceReducer
    }
})