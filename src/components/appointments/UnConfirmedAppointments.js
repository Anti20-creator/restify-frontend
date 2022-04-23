import React, { useState } from 'react'
import { TableContainer, Table, TableHead, TableRow, TableCell, IconButton, Box,
	List, ListItem, ListItemText, ListItemAvatar, Avatar, TableBody, TablePagination } from '@material-ui/core'
import { Check, Close, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import Modal from '@mui/material/Modal'
import { layout } from '../../store/features/layoutSlice'
import { useSelector } from 'react-redux';
import useWindowSize from '../../store/useWindowSize'
import { t } from 'i18next'
import moment from 'moment-timezone'
import { stringToColor } from '../../utils/stringToColor'

function UnConfirmedAppointments({filteredAppointments, selectedAppointment, showConfirmalModal, setSelectedAppointment}) {
	
	const columns = [
		{ id: 'email', label: t('commons.email') },
		{
			id: 'date',
			label: t('commons.date'),
		},
		{
			id: 'tableId',
			label: t('commons.table-id'),
		},
		{ id: 'peopleCount', label: t('commons.peoplecount')},
		{ id: 'delete', label: ''}
	];

    const { width } = useWindowSize();
	const layoutValue = useSelector(layout)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(25)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const getDisplayableAppointments = () => {
		return (rowsPerPage > 0
	            ? filteredAppointments.sort((a, b) => moment(a.date) < moment(b.date) ? -1 : 1).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
	            : filteredAppointments.sort((a, b) => moment(a.date) < moment(b.date) ? -1 : 1))
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

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
	                                {moment(appointment.date).utcOffset(0).format('L HH:mm')}
	                            </TableCell>
	                            <TableCell>
	                                {table ? table.localId + 1 : t('commons.any-table') }
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
	                </Table>
	                {filteredAppointments.length > rowsPerPage && <TablePagination
					  style={{display: 'inline'}}
	                  rowsPerPageOptions={[25, 40, 55]}
	                  component="div"
	                  count={filteredAppointments.length}
	                  rowsPerPage={rowsPerPage}
	                  page={page}
	                  onPageChange={handleChangePage}
	                  onRowsPerPageChange={handleChangeRowsPerPage}
	                />}
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
		                            <ListItemText primary={appointment.email} secondary={moment(appointment.date).utcOffset(0).format("L HH:mm")} />
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
	                        <h5><span className="fw-bold">{t('commons.email')}:</span> <span>{selectedAppointment.email}</span></h5>
	                        <h5><span className="fw-bold">{t('commons.date')}:</span> <span>{moment(selectedAppointment.date).utcOffset(0).format("L HH:mm")}</span></h5>
	                        <h5><span className="fw-bold">{t('commons.table-id')}:</span> <span>{layoutValue.find(table => table.TableId === selectedAppointment.TableId)?.localId + 1}</span></h5>
	                        <h5><span className="fw-bold">{t('commons.peoplecount')}:</span> <span>{selectedAppointment.peopleCount}</span></h5>

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