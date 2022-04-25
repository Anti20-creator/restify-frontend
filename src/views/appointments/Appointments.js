import React, { useEffect, useRef, useState } from 'react';
import {  Tab, AppBar } from '@material-ui/core';
import { TabList, TabPanel, TabContext } from '@material-ui/lab'
import './Appointments.css'
import API from '../../communication/API';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { appointmentsState, seenAppointments, seenAllAppointments, updateAppointments } from '../../store/features/appointmentsSlice';
import { layout } from '../../store/features/layoutSlice'
import BookingModal from '../../components/appointments/BookingModal';
import ConfirmedAppointments from '../../components/appointments/ConfirmedAppointments'
import UnConfirmedAppointments from '../../components/appointments/UnConfirmedAppointments'
import AppointmentConfirmalModal from '../../components/appointments/AppointmentConfirmalModal'
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone'

function Appointments() {

    const dispatch = useDispatch()
    const table = useRef('')
    const email = useRef('')
    const selectedDate = useRef(new Date())
    const { t } = useTranslation()
    const seenAllAppointmentsSelector = useSelector(seenAllAppointments)
    const layoutValue = useSelector(layout)
    const appointments = useSelector(appointmentsState)
    const [filteredAppointments, setFilteredAppointments] = useState([])
    const [appointmentData, setAppointmentData] = useState(null)
    const [addModalOpen, setModalOpen] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [colors, setColors] = useState([])
    const [tab, setTab] = useState('1')

    useEffect(() => {
        if(seenAllAppointmentsSelector) {
            API.get('/api/appointments').then(response => {
                dispatch(seenAppointments())
                dispatch(updateAppointments(response.data.message))
            }).catch(err => {
                toast.error(t(`api.${err.response.data.message}`), {
                    autoClose: 1500
                })
            })
        }
    }, [seenAllAppointmentsSelector])

    useEffect(() => {
        if(tab === '1') {
            setAppointments()
        }else{
            setFilteredAppointments(appointments.filter(appointment => !appointment.confirmed))
        }
    }, [appointments])

    useEffect(() => {
        const newColors = [] 
        for (const appointment of filteredAppointments) {
            let newColor = ""
            for (const otherAppointment of appointments.filter(a => a.TableId === appointment.TableId && a.confirmed)) {
                if(appointment._id === otherAppointment._id) {
                    continue
                }

                if(Math.abs(new Date(appointment.date) - new Date(otherAppointment.date)) <= 3_600_000 * 1.5) {
                    newColor = "error"
                    break
                }else if(Math.abs(new Date(appointment.date) - new Date(otherAppointment.date)) <= 3_600_000 * 3 && newColor === '') {
                    newColor = "warning"
                    break
                }
            }
            newColors.push(newColor)
        }
        setColors(newColors)
    }, [filteredAppointments, appointments])

    const setAppointments = () => {
        const date = new Date(selectedDate.current)
        setFilteredAppointments(
            appointments.filter(appointment => 
                appointment.confirmed &&
                Number(date.getFullYear()) === Number(appointment.date.slice(0,4)) &&
                (date.getMonth()).toString() === (Number(appointment.date.slice(5,7)) - 1).toString() &&
                (date.getDate()).toString() === Number(appointment.date.slice(8,10)).toString() &&
                (appointment.TableId === layoutValue.find(layoutTable => layoutTable.localId === table.current - 1)?.TableId || table.current === '') &&
                appointment.email.toLowerCase().includes(email.current.toLowerCase())
        ))
    }
    
    const handleDateChange = (newDate) => {
        selectedDate.current = newDate
        setAppointments()
    }
    const handleChange = (event) => {
        table.current = event.target.value
        setAppointments()
    }

    const filterAppoinments = (e) => {
        email.current = e.target.value
        setAppointments()
    }

    const handleChange2 = (event, newValue) => {
        if(newValue === '2') {
            setFilteredAppointments(appointments.filter(appointment => !appointment.confirmed))
        }else{
            setAppointments()
        }
        setTab(newValue);
    }

    const showConfirmalModal = (id, accept, tableId, date, peopleCount) => {
        setAppointmentData({id, accept, tableId, date, peopleCount})
    }

    return (
      <div className="w-100 h-100 appointments m-auto">
        <TabContext value={tab}>
            <AppBar position="static">
                <TabList onChange={handleChange2} aria-label="simple tabs example">
                    <Tab label={t('commons.approved')} value="1" />
                    <Tab label={t('commons.unapproved')} value="2" />
                </TabList>
            </AppBar>
            <TabPanel value="1">
                <ConfirmedAppointments 
                    layoutValue={layoutValue}
                    filteredAppointments={filteredAppointments}
                    filterAppoinments={filterAppoinments}
                    handleChange={handleChange}
                    selectedAppointment={selectedAppointment}
                    table={table} selectedDate={selectedDate} handleDateChange={handleDateChange}
                    setModalOpen={setModalOpen}
                    setSelectedAppointment={setSelectedAppointment}
                    colors={colors}
                />     
            </TabPanel>
            <TabPanel value="2">
                <UnConfirmedAppointments 
                    filteredAppointments={filteredAppointments} 
                    selectedAppointment={selectedAppointment} 
                    showConfirmalModal={showConfirmalModal} 
                    setSelectedAppointment={setSelectedAppointment} />
            </TabPanel>
        </TabContext>
          
            {appointmentData && <AppointmentConfirmalModal data={appointmentData} closeConfirmalModal={() => { setAppointmentData(null); setSelectedAppointment(null) }} setData={setAppointmentData} />}
            <BookingModal addModalOpen={addModalOpen} setModalOpen={setModalOpen} tableIds={layoutValue.map(table => ({localId: table.localId, id: table.TableId}))} />
      </div>
  )
}

export default Appointments;