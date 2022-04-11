import React, { useState } from 'react';
import { 
    Button, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    Table, IconButton,
    TableHead,TableRow, TableCell, TableBody, TableContainer, List, ListItem, ListItemAvatar,
    ListItemText, Avatar, Fab, Modal, Box,
} from '@material-ui/core';
import { SearchOutlined, Delete, Add } from '@material-ui/icons';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { useSelector, useDispatch } from 'react-redux';
import { tableIds } from '../../store/features/liveSlice';
import useWindowSize from '../../store/useWindowSize'
import DeleteConfirmal from './DeleteConfirmal';
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

function ConfirmedAppointments({filterAppoinments, selectedAppointment, filteredAppointments, handleChange, layoutValue, selectedDate, handleDateChange, setModalOpen, setSelectedAppointment, stringToColor, table, colors}) {

    const dispatch = useDispatch()
    const [deleteId, setDeleteId] = useState(null)

    const openDeleteConfirmal = (id) => {
        console.log(id)
        setDeleteId(id)
    }

	const {width} = useWindowSize()
	const tables = useSelector(tableIds)

	return (
		<>
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
                                            <MenuItem value="">-</MenuItem>
                                            {layoutValue.map((table) => 
                                                (<MenuItem key={table.localId+1} value={table.localId+1}>{table.localId+1}</MenuItem>)
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
            {width <= 768 && 
                <div className="text-center">
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
            }
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
                    {filteredAppointments.sort((a, b) => moment(a.date) < moment(b.date) ? -1 : 1)
                    .map((appointment, idx) => {

                        const table = layoutValue.find(table => table.TableId === appointment.TableId)
                        return (
                        <TableRow style={{backgroundColor: colors[idx]}} hover role="checkbox" tabIndex={-1} key={appointment._id}>
                            <TableCell>
                                {appointment.email}
                            </TableCell>
                            <TableCell>
                                {moment(appointment.date).utcOffset(0).format("YYYY.MM.DD. HH:mm:ss")}
                            </TableCell>
                            <TableCell>
                                {table ? table.localId + 1 : appointment.TableId }
                            </TableCell>
                            <TableCell>
                                {appointment.peopleCount}
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => openDeleteConfirmal(appointment._id)}>
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
                    {filteredAppointments.sort((a, b) => moment(a.date) < moment(b.date) ? -1 : 1)
                        .map((appointment, idx) => (
                        <ListItem style={{backgroundColor: colors[idx]}} onClick={() => setSelectedAppointment(appointment)} key={appointment._id}>
                            <ListItemAvatar>
                                <Avatar style={{backgroundColor: stringToColor(appointment.email)}}>
                                    { appointment.email.charAt(0) }
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={appointment.email} secondary={moment(appointment.date).utcOffset(0).format("YYYY.MM.DD. HH:mm:ss")} />
                        </ListItem>
                    ))}
                </List>}
            {width <= 768 &&
            <Fab onClick={() => setModalOpen(true)} style={{position: 'fixed', right: '0.5rem', bottom: '0.5rem'}} aria-label={"Add member"} color={"primary"}>
                <Add />
            </Fab>}

            {selectedAppointment && 
                <Modal
                    open={true}
                    onClose={() => setSelectedAppointment(null)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="team-dialog">
                    <Box>
                        <h5><span className="fw-bold">Email:</span> <span>{selectedAppointment.email}</span></h5>
                        <h5><span className="fw-bold">Dátum:</span> <span>{moment(selectedAppointment.date).utcOffset(0).format("YYYY.MM.DD. HH:mm:ss")}</span></h5>
                        <h5><span className="fw-bold">Asztal ID:</span> <span>{layoutValue.find(table => table.TableId === selectedAppointment.TableId)?.localId + 1}</span></h5>
                        <h5><span className="fw-bold">Vendégek száma:</span> <span>{selectedAppointment.peopleCount}</span></h5>

                        <div className="text-center pt-3">
                            <Button onClick={() => openDeleteConfirmal(selectedAppointment._id)} variant="outlined" color="secondary">
                                Eltávolítás
                            </Button>
                        </div>
                    </Box>
                </Modal>
            }

            {deleteId && <DeleteConfirmal id={deleteId} setSelectedAppointment={setSelectedAppointment} close={() => setDeleteId(null)} />}
        </>
	)

}

export default ConfirmedAppointments