import React, { useEffect, useState } from 'react';
import { 
    Button, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    Table, 
    TableHead,TableRow, TableCell, TableBody, TableContainer, Typography, Modal, Box, TextField 
} from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import './Appointments.css'

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
];

function Appointments() {

    // mock data
    const mockTables = [
        'bfada45648a12',
        'bfada45648a13',
        'bfada45648a11',
        'bfada45648a10',
    ]
    const mockAppoinments = [
        {
            'RestaurantId': 'asdasdsa4652acd12',
            'date': new Date(),
            'peopleCount': Math.floor(Math.random()*10),
            'TableId': mockTables[Math.floor(Math.random()*mockTables.length)],
            'email': 'john@gmail.com'
        },
        {
            'RestaurantId': 'asdasdsa4652acd12',
            'date': new Date(),
            'peopleCount': Math.floor(Math.random()*10),
            'TableId': mockTables[Math.floor(Math.random()*mockTables.length)],
            'email': 'jane@gmail.com'
        },
        {
            'RestaurantId': 'asdasdsa4652acd12',
            'date': new Date(),
            'peopleCount': Math.floor(Math.random()*10),
            'TableId': mockTables[Math.floor(Math.random()*mockTables.length)],
            'email': 'gary@gmail.com'
        },
        {
            'RestaurantId': 'asdasdsa4652acd12',
            'date': new Date(),
            'peopleCount': Math.floor(Math.random()*10),
            'TableId': mockTables[Math.floor(Math.random()*mockTables.length)],
            'email': 'kelly@gmail.com'
        },
        {
            'RestaurantId': 'asdasdsa4652acd12',
            'date': new Date(),
            'peopleCount': Math.floor(Math.random()*10),
            'TableId': mockTables[Math.floor(Math.random()*mockTables.length)],
            'email': 'john@gmail.com'
        },
        {
            'RestaurantId': 'asdasdsa4652acd12',
            'date': new Date(),
            'peopleCount': Math.floor(Math.random()*10),
            'TableId': mockTables[Math.floor(Math.random()*mockTables.length)],
            'email': 'jane@gmail.com'
        },
        {
            'RestaurantId': 'asdasdsa4652acd12',
            'date': new Date(),
            'peopleCount': Math.floor(Math.random()*10),
            'TableId': mockTables[Math.floor(Math.random()*mockTables.length)],
            'email': 'gary@gmail.com'
        },
        {
            'RestaurantId': 'asdasdsa4652acd12',
            'date': new Date(),
            'peopleCount': Math.floor(Math.random()*10),
            'TableId': mockTables[Math.floor(Math.random()*mockTables.length)],
            'email': 'kelly@gmail.com'
        },
        {
            'RestaurantId': 'asdasdsa4652acd12',
            'date': new Date(),
            'peopleCount': Math.floor(Math.random()*10),
            'TableId': mockTables[Math.floor(Math.random()*mockTables.length)],
            'email': 'john@gmail.com'
        },
        {
            'RestaurantId': 'asdasdsa4652acd12',
            'date': new Date(),
            'peopleCount': Math.floor(Math.random()*10),
            'TableId': mockTables[Math.floor(Math.random()*mockTables.length)],
            'email': 'jane@gmail.com'
        },
        {
            'RestaurantId': 'asdasdsa4652acd12',
            'date': new Date(),
            'peopleCount': Math.floor(Math.random()*10),
            'TableId': mockTables[Math.floor(Math.random()*mockTables.length)],
            'email': 'gary@gmail.com'
        },
        {
            'RestaurantId': 'asdasdsa4652acd12',
            'date': new Date(),
            'peopleCount': Math.floor(Math.random()*10),
            'TableId': mockTables[Math.floor(Math.random()*mockTables.length)],
            'email': 'kelly@gmail.com'
        },
        {
            'RestaurantId': 'asdasdsa4652acd12',
            'date': new Date(),
            'peopleCount': Math.floor(Math.random()*10),
            'TableId': mockTables[Math.floor(Math.random()*mockTables.length)],
            'email': 'john@gmail.com'
        },
        {
            'RestaurantId': 'asdasdsa4652acd12',
            'date': new Date(),
            'peopleCount': Math.floor(Math.random()*10),
            'TableId': mockTables[Math.floor(Math.random()*mockTables.length)],
            'email': 'jane@gmail.com'
        },
        {
            'RestaurantId': 'asdasdsa4652acd12',
            'date': new Date(),
            'peopleCount': Math.floor(Math.random()*10),
            'TableId': mockTables[Math.floor(Math.random()*mockTables.length)],
            'email': 'gary@gmail.com'
        },
        {
            'RestaurantId': 'asdasdsa4652acd12',
            'date': new Date(),
            'peopleCount': Math.floor(Math.random()*10),
            'TableId': mockTables[Math.floor(Math.random()*mockTables.length)],
            'email': 'kelly@gmail.com'
        },
    ]

    // state variables
    const [table, setTable] = useState('');
    const [tables, setTables] = useState([])
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([])
    const [addModalOpen, setModalOpen] = useState(false)
    
    // event handlers
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const handleChange = (event) => {
        setTable(event.target.value);
    };

    const filterAppoinments = (e) => {
        setAppointments(mockAppoinments.filter(appointment => appointment.email.toLowerCase().includes(e.target.value.toLowerCase())))
    }
    
    // useEffect hook
    useEffect(() => {
        console.log('effect')
        setTables(mockTables)
        setAppointments(mockAppoinments)
    }, [])
    

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
                            value={table}
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
                                value={selectedDate}
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
                    {appointments
                    .map((appointment) => {
                        return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={Math.random() * 100000}>
                            <TableCell>
                                {appointment.email}
                            </TableCell>
                            <TableCell>
                                {appointment.date.toISOString().slice(0, 10)}
                            </TableCell>
                            <TableCell>
                                {appointment.TableId}
                            </TableCell>
                            <TableCell>
                                {appointment.peopleCount}
                            </TableCell>

                        </TableRow>
                        );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
            <Modal
            open={addModalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <Box>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Időpont keresése
                    </Typography>
                    <form className="text-center">
                        <TextField name="email" label="E-mail" variant="standard" type="email" className="my-4" />
                        <br />
                        <Button variant="contained" color="primary" className="m-auto" type="submit">
                            Foglalás
                        </Button>
                        <Button variant="contained" color="secondary" className="m-auto error" type="submit">
                            Mégsem
                        </Button>
                    </form>
                </Box>
            </Modal>
      </div>
  )
}

export default Appointments;
