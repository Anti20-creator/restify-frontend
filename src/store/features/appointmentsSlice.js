import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
    unseen: false
}

const appoinmentsSlice = createSlice({
    name: 'appointments',
    initialState,
    reducers: {
        updateAppointments: (state, action) => {
            state.value = action.payload
        },
        removeAppointment: (state, action) => {
            const index = state.value.findIndex(appointment => appointment._id === action.payload)
            state.value.splice(index, 1)
        },
        addAppointment: (state, action) => {
            state.value.push(action.payload)
        },
        receivedAppointment: (state) => {
            state.unseen = true
        },
        seenAppointments: (state) => {
            state.unseen = false
        },
        acceptAppointment: (state, action) => {
            state.value.find(appointment => appointment._id === action.payload).confirmed = true
        },
        updateAppointmentTable: (state, action) => {
            state.value.find(appointment => appointment._id === action.payload.id).TableId = action.payload.tableId
        }
    }
})

export const { updateAppointments, removeAppointment, addAppointment, receivedAppointment, seenAppointments, acceptAppointment, updateAppointmentTable } = appoinmentsSlice.actions

export const appointmentsState = state => state.appointments.value
export const seenAllAppointments = state => state.appointments.unseen

export default appoinmentsSlice.reducer