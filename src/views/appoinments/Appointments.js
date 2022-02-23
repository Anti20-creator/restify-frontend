import React, { useEffect, useRef, useState } from 'react';
import { 
    Button, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    Table, IconButton,
    TableHead,TableRow, TableCell, TableBody, TableContainer, Typography, Modal, Box, TextField 
} from '@material-ui/core';
import { SearchOutlined, Delete } from '@material-ui/icons';
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
import { appointmentsState, seenAppointments, removeAppointment } from '../../store/features/appointmentsSlice';
import { tableIds } from '../../store/features/liveSlice';
import BookingModal from '../../components/appointments/BookingModal';

const columns = [
    { id: 'email', label: 'E-mail' },
    {
        id: 'date',
        label: 'Időpont',
        format: (value) => value.toLocaleISOString(),
    },
    {
        id: 'tableId',
        label: 'Asztal ID',
    },
    { id: 'peopleCount', label: 'Személyek száma'},
    { id: 'delete', label: ''}
];

function Appointments() {

    // state variables
    const dispatch = useDispatch()
    const table = useRef('')
    const email = useRef('')
    const selectedDate = useRef(new Date())
    const tables = useSelector(tableIds)
    //const [selectedDate, setSelectedDate] = useState(new Date());
    const appointments = useSelector(appointmentsState)
    const [filteredAppointments, setFilteredAppointments] = useState([])
    const [addModalOpen, setModalOpen] = useState(false)

    const setAppointments = () => {
        const date = new Date(selectedDate.current)
        setFilteredAppointments(
            appointments.filter(appointment => 
                date.getYear() === (new Date(appointment.day)).getYear() &&
                date.getMonth() === (new Date(appointment.day)).getMonth() &&
                date.getDate() === (new Date(appointment.day)).getDate() &&
                (appointment.TableId === table.current || table.current === '') &&
                appointment.email.toLowerCase().includes(email.current.toLowerCase())
        ))
        console.log(appointments.filter(appointment => 
            date.getYear() === (new Date(appointment.day)).getYear() &&
            date.getMonth() === (new Date(appointment.day)).getMonth() &&
            date.getDate() === (new Date(appointment.day)).getDate() &&
            (appointment.TableId === table.current || table.current === '') &&
            appointment.email.toLowerCase().includes(email.current.toLowerCase())))
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

        setAppointments()
    }

    const deleteAppointment = (id) => {
        API.delete('/api/appointments/delete-appointment/' + id).then(response => {
            if(response.data.success) {
                dispatch(removeAppointment(id))
            }else{
                toast.error('Hiba a rendelés törlése során!')
            }
        })
    }
    
    // useEffect hook
    useEffect(() => {
        console.log('effect')
        getSocket().emit('join-appointment')
        API.get('api/appointments').then(response => {
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
        console.log(selectedDate.current)
        setAppointments()
    }, [appointments])
    

    return (
      <div className="w-100 h-100 appointments m-auto p-3">
          <div className="d-flex align-items-center searchbox justify-content-between px-4" style={{height: '10%'}}>
                <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center flex-grow-1">
                        <SearchOutlined />
                        <input onKeyUp={filterAppoinments} type="text" className="search-input w-100" placeholder="Szűrés email alapján" />
                    </div>
                    <div className="d-flex align-items-center flex-grow-1">
                        <FormControl variant="filled" className={"m-2"} style={{minWidth: 120}}>
                            <InputLabel id="demo-simple-select-label">Asztal</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={table.current}
                                onChange={handleChange}
                                >
                                {tables.map((table) => 
                                    (<MenuItem key={table} value={table}>{table}</MenuItem>)
                                )}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="flex-grow-1">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="Date picker inline"
                                value={selectedDate.current}
                                onChange={handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                </div>
                <div className="d-flex invite-box flex-grow-1 book-box">
                    <Button color="primary" variant="outlined" onClick={() => setModalOpen(true)}>
                        Hozzáadás
                    </Button>
                </div>
            </div>
            <TableContainer sx={{height: '100%'}}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                    {columns.map((column) => (
                        <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        >
                        {column.label}
                        </TableCell>
                    ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredAppointments
                    .map((appointment) => {
                        return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={appointment._id}>
                            <TableCell>
                                {appointment.email}
                            </TableCell>
                            <TableCell>
                                {appointment.day + ' ' + appointment.time} {/*.toISOString().slice(0, 10)*/}
                            </TableCell>
                            <TableCell>
                                {appointment.TableId}
                            </TableCell>
                            <TableCell>
                                {appointment.peopleCount}
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => deleteAppointment(appointment._id)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                        );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
            <BookingModal addModalOpen={addModalOpen} setModalOpen={setModalOpen} />
      </div>
  )
}

export default Appointments;
