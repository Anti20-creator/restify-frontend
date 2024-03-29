import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    tables: {},
    selectedTableOrders: []
}

const liveSlice = createSlice({
    name: 'live',
    initialState,
    reducers: {
        updateTables: (state, action) => {
            for(const table of action.payload) {
                state.tables[table._id] = table.inLiveUse
            }
        },
        setInUse: (state, action) => {
            state.tables[action.payload.id] = action.payload.value
        }
    }
})

export const { updateTables, setInUse } = liveSlice.actions
export const tablesInUseSelector = state => {
    const result = []
    // eslint-disable-next-line array-callback-return
    Object.keys(state.live.tables).map(id => {
        if(state.live.tables[id]) {
            result.push(id)
        }
    })
    return result
}

export const tableIds = state => Object.keys(state.live.tables)
export const isTableInUse = id => state => state.live.tables[id]

export default liveSlice.reducer