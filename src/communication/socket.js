import { io } from 'socket.io-client'
import { setInUse } from '../store/features/liveSlice'
import { addItem, removeAll, setItems, clear } from '../store/features/invoiceSlice'
import { setModifiedLayout, updateLayout } from '../store/features/layoutSlice'

let socket = null
let store  = null

export const createSocket = (_store) => {
    
    if(!socket) {
        socket = io.connect('https://192.168.31.216:4000')
    }
    store = _store
    registerListeners()

}

const registerListeners = () => {
    socket.on('notify-new-guest', (tableId) => {
        store.dispatch(setInUse({id: tableId, value: true}))
    })
    socket.on('guest-leaved', (tableId) => {
        store.dispatch(setInUse({id: tableId, value: false}))
        store.dispatch(clear())
    })
    socket.on('new-order', (order) => {
        store.dispatch(addItem(order))
    })
    socket.on('order-removed', (order) => {
        store.dispatch(removeAll({name: order}))
    })
    socket.on('layout-modified', (layout) => {
        console.log('Layout modified', layout)
        store.dispatch(setModifiedLayout(layout))
    })
}

export const getSocket = () => {
    return socket
}