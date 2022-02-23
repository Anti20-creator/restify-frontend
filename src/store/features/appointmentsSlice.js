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
            state.value = state.value.filter(appointment => appointment._id !== action.payload)
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
    }
})

export const { updateAppointments, removeAppointment, addAppointment, receivedAppointment, seenAppointments } = appoinmentsSlice.actions

export const appointmentsState = state => state.appointments.value
export const seenAllAppointments = state => state.appointments.unseen

export default appoinmentsSlice.reducer