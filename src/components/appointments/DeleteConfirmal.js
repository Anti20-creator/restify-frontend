import React from 'react'
import Dialog from '@mui/material/Dialog'
import { Typography, Button } from '@material-ui/core'
import {toast} from 'react-toastify'
import API from '../../communication/API'
import {useDispatch} from 'react-redux'
import { removeAppointment } from '../../store/features/appointmentsSlice'
import { getSocket } from '../../communication/socket'

function DeleteConfirmal({close, id, setSelectedAppointment}) {

    const dispatch = useDispatch()
    const deleteAppointment = () => {
        const loadingToast = toast.loading('Foglalás törlése...')
        API.delete('/api/appointments/delete-appointment/' + id).then(response => {
            dispatch(removeAppointment(id))
            setSelectedAppointment(null)
            close()
            toast.update(loadingToast, {render: 'Foglalás törölve!', autoClose: 1500, isLoading: false, type: "success"})
            getSocket().emit('new-appointment')
        }).catch(err => {
            toast.update(loadingToast, {render: 'Hiba a törlés során!', autoClose: 1500, isLoading: false, type: "error"})
        })
    }

    return (
        <Dialog onClose={close} open={true}>
            <div className="p-5">
                <Typography>
                    Valóban törölni szeretné a kiválasztott időpontot?
                </Typography>
                <div className="d-flex justify-content-between mt-4">
                    <Button variant="contained" color="primary" onClick={() => deleteAppointment()}>Jóváhagyás</Button>
                    <Button variant="outlined" color="secondary" onClick={close}>Mégsem</Button>
                </div>
            </div>
        </Dialog>
    )
}

export default DeleteConfirmal