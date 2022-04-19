import React from 'react'
import Dialog from '@mui/material/Dialog'
import { Typography, Button } from '@material-ui/core'
import {toast} from 'react-toastify'
import API from '../../communication/API'
import {useDispatch} from 'react-redux'
import { removeAppointment } from '../../store/features/appointmentsSlice'
import { getSocket } from '../../communication/socket'
import { useTranslation } from 'react-i18next'

function DeleteConfirmal({close, id, setSelectedAppointment}) {

    const dispatch = useDispatch()
    const { t, i18n } = useTranslation()
    
    const deleteAppointment = () => {
        const loadingToast = toast.loading(t('api.appointment-delete-loading'))
        API.delete('/api/appointments/delete-appointment/' + id, {data: {lang: i18n.language}}).then(response => {
            dispatch(removeAppointment(id))
            setSelectedAppointment(null)
            close()
            toast.update(loadingToast, {render: t(`api.${response.data.message}`), autoClose: 1500, isLoading: false, type: "success"})
            getSocket().emit('new-appointment')
        }).catch(err => {
            toast.update(loadingToast, {render: t(`api.${err.response.data.message}`), autoClose: 1500, isLoading: false, type: "error"})
        })
    }

    return (
        <Dialog onClose={close} open={true}>
            <div className="p-5">
                <Typography>
                    {t('commons.delete-booking-confirmal')}
                </Typography>
                <div className="d-flex justify-content-between mt-4">
                    <Button variant="contained" color="primary" onClick={() => deleteAppointment()}>{t('commons.approve')}</Button>
                    <Button variant="outlined" color="secondary" onClick={close}>{t('commons.cancel')}</Button>
                </div>
            </div>
        </Dialog>
    )
}

export default DeleteConfirmal