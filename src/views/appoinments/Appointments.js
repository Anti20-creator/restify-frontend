import React, { useEffect, useRef, useState } from 'react';
import { 
    Button, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    Table, IconButton,
    TableHead,TableRow, TableCell, TableBody, TableContainer, List, ListItem, ListItemSecondaryAction, ListItemAvatar,
    ListItemText, Avatar, Fab, Modal, Box,
    Tab, AppBar, TablePagination
} from '@material-ui/core';
import { TabList, TabPanel, TabContext } from '@material-ui/lab'
import { SearchOutlined, Delete, Add, Check, Close } from '@material-ui/icons';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import './Appointments.css'
import API from '../../communication/API';
import { getSocket } from '../../communication/socket';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { appointmentsState, seenAppointments, removeAppointment, acceptAppointment } from '../../store/features/appointmentsSlice';
import { tableIds } from '../../store/features/liveSlice';
import { layout } from '../../store/features/layoutSlice'
import BookingModal from '../../components/appointments/BookingModal';
import useWindowSize from '../../store/useWindowSize'
import ConfirmedAppointments from '../../components/appointments/ConfirmedAppointments'
import UnConfirmedAppointments from '../../components/appointments/UnConfirmedAppointments'
import AppointmentConfirmalModal from '../../components/appointments/AppointmentConfirmalModal'
const moment = require('moment-timezone')

function Appointments() {

    // state variables
    const [timezoneOffset, setTimezoneOffset] = useState(0)
    const [filteredAppointments, setFilteredAppointments] = useState([])
    const [appointmentData, setAppointmentData] = useState(null)
    const [addModalOpen, setModalOpen] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [colors, setColors] = useState([])
    
    const layoutValue = useSelector(layout)
    const tables = useSelector(tableIds)
    const appointments = useSelector(appointmentsState)
    const dispatch = useDispatch()
    const table = useRef('')
    const email = useRef('')
    const selectedDate = useRef(new Date())
    const { height, width } = useWindowSize();

    const stringToColor = function(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let colour = '#';
        for (let i = 0; i < 3; i++) {
          let value = (hash >> (i * 8)) & 0xFF;
          colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
    }

    const setAppointments = () => {
        const date = new Date(selectedDate.current)
        setFilteredAppointments(
            appointments.filter(appointment => 
                appointment.confirmed &&
                date.getFullYear() == (appointment.date.slice(0,4)) &&
                date.getMonth() == (Number(appointment.date.slice(5,7)) - 1).toString() &&
                date.getDate() == Number(appointment.date.slice(8,10)).toString() &&
                (appointment.TableId === layoutValue.find(layoutTable => layoutTable.localId == table.current - 1)?.TableId || table.current === '') &&
                appointment.email.toLowerCase().includes(email.current.toLowerCase())
        ))

    }
    
    // event handlers
    const handleDateChange = (newDate) => {
        selectedDate.current = newDate
        setAppointments()
    }
    const handleChange = (event) => {
        table.current = event.target.value

        setAppointments()
    };

    const filterAppoinments = (e) => {
        email.current = e.target.value
        console.log(email.current)
        setAppointments()
    }

    const deleteAppointment = (id) => {
        const loadingToast = toast.loading('Foglalás törlése...')
        API.delete('/api/appointments/delete-appointment/' + id).then(response => {
            dispatch(removeAppointment(id))
            setSelectedAppointment(null)
            toast.update(loadingToast, {render: 'Foglalás törölve!', autoClose: 1500, isLoading: false, type: "success"})
        }).catch(err => {
            toast.update(loadingToast, {render: 'Hiba a törlés során!', autoClose: 1500, isLoading: false, type: "error"})
        })
    }
    
    // useEffect hook
    useEffect(() => {
        console.log('effect')
        getSocket().emit('join-appointment')
        API.get('/api/appointments').then(response => {
            if(response.data.success) {
                dispatch(seenAppointments())
            }else{
                toast.error('Hiba a foglalások betöltése során!', {
                    autoClose: 1500
                })
            }
        })

        return () => getSocket().emit('leave-appointment')
    }, [])

    useEffect(() => {
        if(value === '1') {
            setAppointments()
        }else{
            setFilteredAppointments(appointments.filter(appointment => !appointment.confirmed))
        }
    }, [appointments])

    const [value, setValue] = React.useState('1');

    const handleChange2 = (event, newValue) => {
        if(newValue === '2') {
            setFilteredAppointments(appointments.filter(appointment => !appointment.confirmed))
        }else{
            setAppointments()
        }
        setValue(newValue);
    };

    const showConfirmalModal = (id, accept, tableId, date) => {
        console.log('show')
        setAppointmentData({id, accept, tableId, date})
    }
    
    const confirmAppointment = (id, accept, tableId) => {
        API.put('/api/appointments/accept-appointment', {accept: accept, appointmentId: id, tableId: tableId}).then(() => {
            if(!accept) {
                dispatch(removeAppointment(id))
            }else{
                dispatch(acceptAppointment(id))
            }
        }).catch(err => {
            console.warn('Error while updating...')
        })
    }

    useEffect(() => {
        const newColors = [] 
        for (const appointment of filteredAppointments) {
            let newColor = ""
            for (const otherAppointment of filteredAppointments.filter(a => a.TableId === appointment.TableId)) {
                if(appointment._id === otherAppointment._id) {
                    continue
                }

                if(Math.abs(new Date(appointment.date) - new Date(otherAppointment.date)) <= 3_600_000 * 1.5) {
                    newColor = "#ef5350"
                }else if(Math.abs(new Date(appointment.date) - new Date(otherAppointment.date)) <= 3_600_000 * 3 && newColor === '') {
                    newColor = "#ff9800"
                }
            }
            newColors.push(newColor)
        }
        setColors(newColors)
    }, [filteredAppointments])

    return (
      <div className="w-100 h-100 appointments m-auto">
        <TabContext value={value}>
            <AppBar position="static">
                <TabList onChange={handleChange2} aria-label="simple tabs example">
                    <Tab label="Könyvelt" value="1" />
                    <Tab label="Beérkező" value="2" />
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
                    deleteAppointment={deleteAppointment} setSelectedAppointment={setSelectedAppointment}
                    stringToColor={stringToColor} setModalOpen={setModalOpen}
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
          
            {appointmentData && <AppointmentConfirmalModal data={appointmentData} closeConfirmalModal={() => { setAppointmentData(null); setSelectedAppointment(null) }} />}
            <BookingModal addModalOpen={addModalOpen} setModalOpen={setModalOpen} tableIds={layoutValue.map(table => ({localId: table.localId, id: table.TableId}))} />
      </div>
  )
}

export default Appointments;