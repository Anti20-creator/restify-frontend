import React from 'react'
import { TableContainer, Table, TableHead, TableRow, TableCell, IconButton, Box,
	List, ListItem, ListItemText, ListItemAvatar, Avatar, TableBody, TablePagination } from '@material-ui/core'
import { Check, Close, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import Modal from '@mui/material/Modal'
import { layout } from '../../store/features/layoutSlice'
import { useSelector } from 'react-redux';
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

function UnConfirmedAppointments({filteredAppointments, selectedAppointment, showConfirmalModal, setSelectedAppointment}) {

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

	const layoutValue = useSelector(layout)
    const { width } = useWindowSize();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const getDisplayableAppointments = () => {
		return (rowsPerPage > 0
	            ? filteredAppointments.sort((a, b) => moment(a.date) < moment(b.date) ? -1 : 1).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
	            : filteredAppointments.sort((a, b) => moment(a.date) < moment(b.date) ? -1 : 1))
    }


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

	return(
		<div>
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
	                    {getDisplayableAppointments()
	                    .map((appointment) => {
	                        const table = layoutValue.find(table => table.TableId === appointment.TableId)
	                        return (
	                        <TableRow hover role="checkbox" tabIndex={-1} key={appointment._id}>
	                            <TableCell>
	                                {appointment.email}
	                            </TableCell>
	                            <TableCell>
	                                {moment(appointment.date).utcOffset(0).format("YYYY.MM.DD. HH:mm:ss")}
	                            </TableCell>
	                            <TableCell>
	                                {table ? table.localId + 1 : 'tetsz.' }
	                            </TableCell>
	                            <TableCell>
	                                {appointment.peopleCount}
	                            </TableCell>
	                            <TableCell>
	                                <IconButton onClick={() => showConfirmalModal(appointment._id, true, appointment.TableId, appointment.date, appointment.peopleCount)}>
	                                    <Check style={{color: 'green'}} />
	                                </IconButton>
	                                <IconButton onClick={() => showConfirmalModal(appointment._id, false, appointment.TableId, appointment.date, appointment.peopleCount)}>
	                                    <Close style={{color: 'red'}} />
	                                </IconButton>
	                            </TableCell>
	                        </TableRow>
	                        );
	                    })}
	                </TableBody>
	                <TablePagination
	                  rowsPerPageOptions={[25, 40, 55]}
	                  component="div"
	                  count={filteredAppointments.length}
	                  rowsPerPage={rowsPerPage}
	                  page={page}
	                  onPageChange={handleChangePage}
	                  onRowsPerPageChange={handleChangeRowsPerPage}
	                />
	                </Table>
	            </TableContainer>}
	            {width <= 768 &&
	                <>
		                <List>
		                    {
		                    	getDisplayableAppointments()
		                    	.map((appointment) => (
		                        <ListItem onClick={() => setSelectedAppointment(appointment)} key={appointment._id}>
		                            <ListItemAvatar>
		                                <Avatar style={{backgroundColor: stringToColor(appointment.email)}}>
		                                    { appointment.email.charAt(0) }
		                                </Avatar>
		                            </ListItemAvatar>
		                            <ListItemText primary={appointment.email} secondary={moment(appointment.date).utcOffset(0).format("YYYY.MM.DD. HH:mm:ss")} />
		                        </ListItem>
		                    ))}
		                </List>
		                {getDisplayableAppointments().length > 25 && <div className="d-flex w-100 justify-content-between">
		                	<IconButton disabled={page === 0} onClick={() => setPage(Math.max(page - 1, 0))}>
		                		<KeyboardArrowLeft />
		                	</IconButton>
		                	<IconButton disabled={page === Math.ceil(filteredAppointments.length / rowsPerPage) - 1} onClick={() => setPage(Math.min(page + 1, Math.ceil(filteredAppointments.length/rowsPerPage))) }>
		                		<KeyboardArrowRight />
		                	</IconButton>
		                </div>}
	                </>
	            }
	            {width <= 768 && selectedAppointment !== null && 
	                <Modal
	                disableEnforceFocus
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

	                        <div className="text-center d-flex justify-content-between pt-3">
	                            <IconButton onClick={() => showConfirmalModal(selectedAppointment._id, true, selectedAppointment.TableId, selectedAppointment.date, selectedAppointment.peopleCount)}>
	                                <Check style={{color: 'green'}} />
	                            </IconButton>
	                            <IconButton onClick={() => showConfirmalModal(selectedAppointment._id, false, selectedAppointment.TableId, selectedAppointment.date, selectedAppointment.peopleCount)}>
	                                <Close style={{color: 'red'}} />
	                            </IconButton>
	                        </div>
	                    </Box>
                </Modal>}
        </div>
	)
}

export default UnConfirmedAppointments