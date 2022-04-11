import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import { List, ListItem, ListItemText, Button, CircularProgress, Select, MenuItem } from '@material-ui/core'
import API from '../../communication/API'
import { useDispatch, useSelector } from 'react-redux'
import { removeAppointment, acceptAppointment, updateAppointmentTable } from '../../store/features/appointmentsSlice';
import { toast } from 'react-toastify'
import { layout } from '../../store/features/layoutSlice'
import { getSocket } from '../../communication/socket'
const moment = require('moment-timezone')

function AppointmentConfirmalModal({data, closeConfirmalModal, setData}) {

	const [optionalConflicts, setOptionalConflicts] = useState([])
	const [isLoading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [newTable, setNewTable] = useState(null)
	const [tableData, setTableData] = useState(data)
	const layoutValue = useSelector(layout)
	const dispatch = useDispatch()

	const confirmAppointment = (id, accept, tableId) => {
		if(error) {
			toast.error('A foglalás nem hagyható jóvá', {autoClose: 1200})
			return
		}

		const loadingToast = toast.loading('Foglalás jóváhagyása...')
        API.put('/api/appointments/accept-appointment', {accept: accept, appointmentId: id, tableId: tableId}).then(() => {
            if(!accept) {
                dispatch(removeAppointment(id))
            }else{
				dispatch(updateAppointmentTable({id: id, tableId: tableId}))
                dispatch(acceptAppointment(id))
            }
            closeConfirmalModal()
            toast.update(loadingToast, {render: accept ? 'Foglalás jóváhagyva' : 'Foglalás törölve', autoClose: 1200, isLoading: false, type: "success"})
			getSocket().emit('new-appointment')
        }).catch(err => {
            console.warn('Error while updating...')
            toast.update(loadingToast, {render: 'Sikertelen jóváhagyás', autoClose: 1200, isLoading: false, type: "error"})
        })
    }

    const continueForm = () => {
    	setTableData({
    		...tableData,
    		tableId: layoutValue.find(table => table.localId === (newTable - 1))?.TableId
    	})
    	setData({
    		...data,
    		tableId: layoutValue.find(table => table.localId === (newTable - 1))?.TableId	
    	})
    }

    useEffect(() => {
    	setTableData(data)
    }, [data])

	useEffect(() => {
		console.log(tableData)
		if(tableData && tableData.tableId !== 'any') {
			API.post('/api/appointments/booking-conflicts', {date: tableData.date.toString(), tableId: tableData.tableId, peopleCount: Number(tableData.peopleCount)}).then((result) => {
				setOptionalConflicts(result.data.message)
				setLoading(false)
				setError(false)
			}).catch(err => {
				setOptionalConflicts([])
				setLoading(false)
				setError(true)
			})
		}
	}, [tableData])

	return (
		<Dialog disableEnforceFocus open={true} onClose={closeConfirmalModal} className="text-center">
				<div className="p-3">
					<h5>Dátum: {moment(data.date).utcOffset(0).format("YYYY.MM.DD. HH:mm:ss")}</h5>
					<h5>Asztal: {data.tableId === 'any' ? 'tetsz' : data.tableId} </h5>

					{
						tableData.tableId !== 'any' ?
						tableData.accept ?
						<>
							<h6 className="mt-4 text-decoration-underline">Esedékes ütközések</h6>
							<List className="mb-3 px-3">
								{
									isLoading ?
									<CircularProgress />
									:
									!error ?
									optionalConflicts.map((appointment, idx) => (
										<ListItem key={idx}>
											<ListItemText>
												{moment(appointment.date).utcOffset(0).format("YYYY.MM.DD. HH:mm:ss")}
											</ListItemText>
										</ListItem>
									))
									:
									<ListItem>
										<ListItemText>
											Valamely paraméter nem volt megfelelő a keresés során!
										</ListItemText>
									</ListItem>
								}

								{optionalConflicts.length === 0 && !isLoading && !error &&
									<p> Nincs a közelben időpont a megadott asztalhoz. </p>}
							</List>
						</>
						:
						<h6>Biztosan törölni kívánja a kiválasztott foglalást?</h6>
						:
						<div className="text-center p-3">
							<Select
			                    labelId="demo-simple-select-label"
			                    id="demo-simple-select"
			                    value={newTable}
			                    className="w-50"
			                    onChange={(e) => setNewTable(e.target.value)}
			                    >
			                    {layoutValue.map((table) => 
			                        (<MenuItem key={table.localId+1} value={table.localId+1}>Asztal #{table.localId+1}</MenuItem>)
			                    )}
			                </Select>
						</div>
					}

					{
						tableData.tableId !== 'any' ?
						<div className="d-flex justify-content-between">
							<Button variant="contained" color="primary" onClick={() => confirmAppointment(data.id, data.accept, data.tableId)}>Jóváhagyás</Button>
							<Button variant="outlined" color="secondary" onClick={closeConfirmalModal}>Mégsem</Button>
						</div>
						:
						<div className="d-flex justify-content-between">
							<Button variant="contained" color="primary" onClick={continueForm}>Tovább</Button>
							<Button variant="outlined" color="secondary" onClick={closeConfirmalModal}>Mégsem</Button>
						</div>
					}
				</div>
      	</Dialog>
	)
}

export default AppointmentConfirmalModal