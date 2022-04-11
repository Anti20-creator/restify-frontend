import { io } from 'socket.io-client'
import { setInUse } from '../store/features/liveSlice'
import { addItem, removeAll, clear, addOne, removeOne, setItems } from '../store/features/invoiceSlice'
import { setModifiedLayout } from '../store/features/layoutSlice'
import { toast } from 'react-toastify'
import { receivedAppointment } from '../store/features/appointmentsSlice'
import data from './data.json'

let socket = null
let store  = null

export const createSocket = (_store) => {
    
    if(!socket) {
        socket = io.connect(data.base_uri, {
            transports: ['websocket']
        })
        registerListeners()
    }
    if(!store) {
        store = _store
    }

    return socket

}

const registerListeners = () => {

    socket.on('notify-new-guest', (tableId) => {
        store.dispatch(setInUse({id: tableId, value: true}))
        toast.info('Új vendég érkezett!', {
            position: "bottom-center",
            closeOnClick: true,
            progress: undefined,
            autoClose: 1000,
            hideProgressBar: false,
            pauseOnHover: false,
            draggable: false,
        });
    })
    socket.on('guest-leaved', (tableId) => {
        store.dispatch(setInUse({id: tableId, value: false}))
        store.dispatch(clear())
        toast.info('Egy asztal felszabadult!', {
            position: "bottom-center",
            closeOnClick: true,
            progress: undefined,
            autoClose: 1000,
            hideProgressBar: false,
            pauseOnHover: false,
            draggable: false,
        });
    })
    socket.on('order-added', (order, socketId) => {
        if(socketId === socket.id) return;
        
        store.dispatch(addItem(order))
        toast.info('Új számlaelem!', {
            position: "bottom-center",
            closeOnClick: true,
            progress: undefined,
            autoClose: 1000,
            hideProgressBar: false,
            pauseOnHover: false,
            draggable: false,
        });
    })
    socket.on('order-removed', (order, socketId) => {
        if(socketId === socket.id) return;

        store.dispatch(removeAll({name: order}))
        toast.info('Elem törölve a listából!', {
            position: "bottom-center",
            closeOnClick: true,
            progress: undefined,
            autoClose: 1000,
            hideProgressBar: false,
            pauseOnHover: false,
            draggable: false,
        });
    })
    socket.on('increase-order', (order, socketId) => {
        if(socketId === socket.id) return

        store.dispatch(addOne({name: order}))
        toast.info('Egy rendelés mennyisége nőtt!', {
            position: "bottom-center",
            closeOnClick: true,
            progress: undefined,
            autoClose: 1000,
            hideProgressBar: false,
            pauseOnHover: false,
            draggable: false,
        });
    })
    socket.on('decrease-order', (order, socketId) => {
        if(socketId === socket.id) return

        store.dispatch(removeOne({name: order}))
        toast.info('Egy rendelés mennyisége csökkent!', {
            position: "bottom-center",
            closeOnClick: true,
            progress: undefined,
            autoClose: 1000,
            hideProgressBar: false,
            pauseOnHover: false,
            draggable: false,
        });
    })
    socket.on('new-appointment', () => {
        console.log('new appointment')
        store.dispatch(receivedAppointment())
        socket.emit('leave-appointment')
    })
    socket.on('layout-modified', (layout) => {
        console.log('Layout modified', layout)
        store.dispatch(setModifiedLayout(layout))
    })
    socket.on('orders-modified', (orders) => {
        store.dispatch(setItems(orders))
    })
}

export const getSocket = () => {
    if(socket) {
        return socket
    }else{
        return createSocket()
    }
}