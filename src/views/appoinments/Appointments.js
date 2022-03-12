import React, { useEffect, useRef, useState } from 'react';
import { 
    Button, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    Table, IconButton,
    TableHead,TableRow, TableCell, TableBody, TableContainer, List, ListItem, ListItemSecondaryAction, ListItemAvatar,
    ListItemText, Avatar, Fab
} from '@material-ui/core';
import { SearchOutlined, Delete, Add } from '@material-ui/icons';
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
import { layout } from '../../store/features/layoutSlice'
import BookingModal from '../../components/appointments/BookingModal';
import useWindowSize from '../../store/useWindowSize'
const moment = require('moment-timezone')

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
    const [timezoneOffset, setTimezoneOffset] = useState(0)
    const [filteredAppointments, setFilteredAppointments] = useState([])
    const [addModalOpen, setModalOpen] = useState(false)
    
    const layoutValue = useSelector(layout)
    const tables = useSelector(tableIds)
    const appointments = useSelector(appointmentsState)
    const dispatch = useDispatch()
    const table = useRef('')
    const email = useRef('')
    const selectedDate = useRef(new Date())
    const { height, width } = useWindowSize();

    const setAppointments = () => {
        const date = new Date(selectedDate.current)
        setFilteredAppointments(
            appointments.filter(appointment => 
                date.getFullYear() == (appointment.day.slice(0,4)) &&
                date.getMonth() == (Number(appointment.day.slice(5,7)) - 1).toString() &&
                date.getDate() == Number(appointment.day.slice(8,10)).toString() &&
                (appointment.TableId === table.current || table.current === '') &&
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
        console.log(selectedDate.current)
        setAppointments()
    }, [appointments])

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

    useEffect(() => {
        console.log(width)
    }, [width])
    

    return (
      <div className="w-100 h-100 appointments m-auto p-3">
          <div className="d-flex align-items-center searchbox justify-content-between px-4" style={{height: '10%'}}>
                <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center flex-grow-1">
                        <SearchOutlined />
                        <input onKeyUp={filterAppoinments} type="text" className="search-input w-100" placeholder="Szűrés email alapján" />
                    </div>
                    {width > 768 && 
                        <>
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
                        </>}
                </div>
                {width > 768 && <div className="d-flex invite-box flex-grow-1 book-box">
                    <Button color="primary" variant="outlined" onClick={() => setModalOpen(true)}>
                        Hozzáadás
                    </Button>
                </div>}
            </div>
            {width > 768 && <TableContainer sx={{height: '100%'}}>
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
                        const table = layoutValue.find(table => table.TableId === appointment.TableId)
                        return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={appointment._id}>
                            <TableCell>
                                {appointment.email}
                            </TableCell>
                            <TableCell>
                                {moment(appointment.time).utcOffset(0).format("YYYY.MM.DD. HH:mm:ss")}
                            </TableCell>
                            <TableCell>
                                {'localId' in table ? table.localId + 1 : 'N.A.' }
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
            </TableContainer>}
            {width <= 768 &&
                <List>
                    {filteredAppointments.map((appointment) => (
                        <ListItem key={appointment._id}>
                            <ListItemAvatar>
                                <Avatar style={{backgroundColor: stringToColor(appointment.email)}}>
                                    { appointment.email.charAt(0) }
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={appointment.email} secondary={moment(appointment.time).utcOffset(0).format("YYYY.MM.DD. HH:mm:ss")} />
                        </ListItem>
                    ))}
                </List>}
            {width <= 768 &&
            <Fab onClick={() => setModalOpen(true)} style={{position: 'fixed', right: '0.5rem', bottom: '0.5rem'}} aria-label={"Add member"} color={"primary"}>
                <Add />
            </Fab>}
            <BookingModal addModalOpen={addModalOpen} setModalOpen={setModalOpen} />
      </div>
  )
}

export default Appointments;
