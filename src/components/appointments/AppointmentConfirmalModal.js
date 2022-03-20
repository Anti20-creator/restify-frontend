import React, {useState, useEffect} from 'react'
import Dialog from '@mui/material/Dialog'
import {List, ListItem, ListItemText, Button, CircularProgress} from '@material-ui/core'
import API from '../../communication/API'
import { useDispatch } from 'react-redux'
import { removeAppointment, acceptAppointment } from '../../store/features/appointmentsSlice';
import { toast } from 'react-toastify'
const moment = require('moment-timezone')

function AppointmentConfirmalModal({data, closeConfirmalModal}) {

	const [optionalConflicts, setOptionalConflicts] = useState([])
	const [isLoading, setLoading] = useState(true)
	const [error, setError] = useState(false)
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
                dispatch(acceptAppointment(id))
            }
            closeConfirmalModal()
            toast.update(loadingToast, {render: accept ? 'Foglalás jóváhagyva' : 'Foglalás törölve', autoClose: 1200, isLoading: false, type: "success"})
        }).catch(err => {
            console.warn('Error while updating...')
            toast.update(loadingToast, {render: 'Sikertelen jóváhagyás', autoClose: 1200, isLoading: false, type: "error"})
        })
    }

	useEffect(() => {
		if(data) {
			API.post('/api/appointments/booking-conflicts', {date: data.date, tableId: data.tableId, peopleCount: data.peopleCount}).then((result) => {
				setOptionalConflicts(result.data.message)
				setLoading(false)
				setError(false)
			}).catch(err => {
				setOptionalConflicts([])
				setLoading(false)
				setError(true)
			})
		}
	}, [data])

	return (
		<Dialog disableEnforceFocus open={true} onClose={closeConfirmalModal} className="text-center">
			<div className="p-3">
				<h5>Dátum: {moment(data.date).utcOffset(0).format("YYYY.MM.DD. HH:mm:ss")}</h5>
				<h5>Asztal: {data.tableId} </h5>

				{
				data.accept ?
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

						{optionalConflicts.length === 0 && !isLoading && 
							<p> Nincs a közelben időpont a megadott asztalhoz. </p>}
					</List>
				</>
				:
				<h6>Biztosan törölni kívánja a kiválasztott foglalást?</h6>
				}

				<div className="d-flex justify-content-between">
					<Button variant="contained" color="primary" onClick={() => confirmAppointment(data.id, data.accept, data.tableId)}>Jóváhagyás</Button>
					<Button variant="outlined" color="secondary" onClick={closeConfirmalModal}>Mégsem</Button>
				</div>
			</div>
      	</Dialog>
	)
}

export default AppointmentConfirmalModal