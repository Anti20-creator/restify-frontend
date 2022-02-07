import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: {}
}

export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        updateMenu: (state, action) => {
            state.value = action.payload
        },
        addCategory: (state, action) => {
            state.value.items[action.payload.category] = {}
            state.value.icons[action.payload.category] = action.payload.categoryIcon
        },
        addItem: (state, action) => {
            state.value.items[action.payload.category][action.payload.name] = {
                price: action.payload.price,
                unit: action.payload.unit,
                amount: action.payload.amount
            }
        }
    }
})

export const { updateMenu, addCategory, addItem } = menuSlice.actions
export const menuState = state => state.menu.value
export const menuItems = state => state.menu.value.items ? [].concat(...Object.keys(state.menu.value.items).map(category => {
    return Object.keys(state.menu.value.items[category]).map(item => {
        return {
            name: item,
            price: state.menu.value.items[category][item].price,
            amount: state.menu.value.items[category][item].amount,
            amount: state.menu.value.items[category][item].amount,
            category: category
        }
    })
})) : []

export default menuSlice.reducer