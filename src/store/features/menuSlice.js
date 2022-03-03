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
        },
        editCategory: (state, action) => {
            if(action.payload.oldCategory !== action.payload.newCategory) {
                state.value.items[action.payload.newCategory] = state.value.items[action.payload.oldCategory]
                delete(state.value.items[action.payload.oldCategory])
            }
            state.value.icons[action.payload.newCategory] = action.payload.categoryIcon
            if(action.payload.oldCategory !== action.payload.newCategory) {
                delete(state.value.icons[action.payload.oldCategory])
            }
        },
        editItem: (state, action) => {
            state.value.items[action.payload.category][action.payload.newName] = {
                price: action.payload.price,
                unit: action.payload.unit,
                amount: action.payload.amount
            }
            if(action.payload.oldName !== action.payload.newName) {
                delete(state.value.items[action.payload.category][action.payload.oldName])
            }
        }
    }
})

export const { updateMenu, addCategory, addItem, editCategory, editItem } = menuSlice.actions
export const menuState = state => state.menu.value
export const menuItems = state => state.menu.value.items ? [].concat(...Object.keys(state.menu.value.items).map(category => {
    return Object.keys(state.menu.value.items[category]).map(item => {
        return {
            name: item,
            price: state.menu.value.items[category][item].price,
            amount: state.menu.value.items[category][item].amount,
            unit: state.menu.value.items[category][item].unit,
            category: category
        }
    })
})) : []
export const getMenuItem = (item, category) => state => {
    if(item === '' || category === '') {
        return {}
    }
    return state.menu.value.items[category][item]
}

export default menuSlice.reducer