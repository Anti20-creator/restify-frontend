import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import { List, ListItem, ListItemText, Button, CircularProgress, Select, MenuItem } from '@material-ui/core'
import API from '../../communication/API'
import { useDispatch, useSelector } from 'react-redux'
import { removeAppointment, acceptAppointment, updateAppointmentTable } from '../../store/features/appointmentsSlice';
import { toast } from 'react-toastify'
import { layout } from '../../store/features/layoutSlice'
import { getSocket } from '../../communication/socket'
import { useTranslation } from 'react-i18next'
import moment from 'moment-timezone'

function AppointmentConfirmalModal({data, closeConfirmalModal, setData}) {
	
	const dispatch = useDispatch()
	const layoutValue = useSelector(layout)
	const { t, i18n } = useTranslation()
	const [optionalConflicts, setOptionalConflicts] = useState([])
	const [isLoading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [newTable, setNewTable] = useState(null)
	const [tableData, setTableData] = useState(data)

	useEffect(() => {
		if(tableData && tableData.tableId !== 'any') {
			API.post('/api/appointments/booking-conflicts', {date: tableData.date.toString(), tableId: tableData.tableId, peopleCount: Number(tableData.peopleCount)}).then((result) => {
				setOptionalConflicts(result.data.message)
				setLoading(false)
				setError(null)
			}).catch(err => {
				setOptionalConflicts([])
				setLoading(false)
				setError(err.response.data.message)
			})
		}
	}, [tableData])

	const confirmAppointment = (id, accept, tableId) => {
		if(error) {
			toast.error(t('api.appointment-error'), {autoClose: 1200})
			return
		}

		const loadingToast = toast.loading(t('api.appointment-loading'))
        API.put('/api/appointments/accept-appointment', {accept: accept, appointmentId: id, tableId: tableId, lang: i18n.language}).then((response) => {
            if(!accept) {
                dispatch(removeAppointment(id))
            }else{
				dispatch(updateAppointmentTable({id: id, tableId: tableId}))
                dispatch(acceptAppointment(id))
            }
            closeConfirmalModal()
            toast.update(loadingToast, {render: t(`api.${response.data.message}`), autoClose: 1200, isLoading: false, type: "success"})
			getSocket().emit('new-appointment')
        }).catch(err => {
            toast.update(loadingToast, {render: t(`api.${err.response.data.message}`), autoClose: 1200, isLoading: false, type: "error"})
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

	return (
		<Dialog disableEnforceFocus open={true} onClose={closeConfirmalModal} className="text-center">
				<div className="p-3">
					<h5>{t('commons.date')}: {moment(data.date).utcOffset(0).format("L HH:mm")}</h5>
					<h5>{t('commons.table')}: {data.tableId === 'any' ? t('commons.any-table') : (layoutValue.find(table => table.TableId === data.tableId)?.localId + 1) } </h5>

					{
						tableData.tableId !== 'any' ?
						tableData.accept ?
						<>
							<h6 className="mt-4 text-decoration-underline">{t('commons.optional-conflicts')}</h6>
							<List className="mb-3 px-3">
								{
									isLoading ?
									<CircularProgress />
									:
									!error ?
										optionalConflicts.map((appointment, idx) => (
											<ListItem key={idx}>
												<ListItemText>
													{moment(appointment.date).utcOffset(0).format("L HH:mm")}
												</ListItemText>
											</ListItem>
										))
									:
										<ListItem>
											<ListItemText>
												{
													error === 'too-many-people' ? 
													t('api.too-many-people')
													:
													t('commons.error-while-searching')
												}
											</ListItemText>
										</ListItem>
								}

								{optionalConflicts.length === 0 && !isLoading && !error &&
									<p> {t('commons.no-appointment-conflicts')} </p>}
							</List>
						</>
						:
						<h6 className="py-4">{t('commons.delete-booking-confirmal')}</h6>
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
			                        (<MenuItem key={table.localId+1} value={table.localId+1}>{t('commons.table')} #{table.localId+1}</MenuItem>)
			                    )}
			                </Select>
						</div>
					}

					{
						tableData.tableId !== 'any' ?
						<div className="d-flex justify-content-between">
							<Button disabled={error} variant="contained" color="primary" onClick={() => confirmAppointment(data.id, data.accept, data.tableId)}>{t('commons.approve')}</Button>
							<Button variant="outlined" color="secondary" onClick={closeConfirmalModal}>{t('commons.cancel')}</Button>
						</div>
						:
						<div className="d-flex justify-content-between">
							<Button variant="contained" color="primary" onClick={continueForm}>{t('commons.next')}</Button>
							<Button variant="outlined" color="secondary" onClick={closeConfirmalModal}>{t('commons.cancel')}</Button>
						</div>
					}
				</div>
      	</Dialog>
	)
}

export default AppointmentConfirmalModal