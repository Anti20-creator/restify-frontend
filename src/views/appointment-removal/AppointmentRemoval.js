import React, { useEffect, useState } from 'react'
import { Button, Card, FormControl, TextField } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../../communication/API'
import { t } from 'i18next'

function AppointmentRemoval() {

    const { restaurantId } = useParams()
    const [posted, setPosted] = useState(false)

    useEffect(() => {
        return () => setPosted(false)
    })

    const removeAppointment = (e) => {
        e.preventDefault()
        const registerToast = toast.loading(t('api.removing-appointment'))
        const appointmentId = e.target.id.valie
        const email = e.target.email.value
        const pin = e.target.pin.value
    
        API.delete('api/appointments/disclaim', {data:{email, pin, restaurantId, id: appointmentId}}).then(result => {
            toast.update(registerToast, {render: t(`api.${result.data.message}`), autoClose: 1200, isLoading: false, type: "success"})
            setPosted(true)
        }).catch(err => {
            toast.update(registerToast, {render: t(`api.${err.response.data.message}`), autoClose: 1200, isLoading: false, type: "error"})
        })
    }

    return (
        <div className="text-center d-flex align-items-center w-100 h-100 justify-content-center">
            <Card className="w-50 p-5 text-center">
                {
                    !posted ? 
                    <form onSubmit={removeAppointment}>
                        <FormControl>
                            <TextField name="id" type="text" placeholder={t('commons.appointment-id')} />
                            <TextField name="email" type="email" placeholder={t('commons.email')} />
                            <TextField name="pin" type="text" placeholder={t('commons.appointment-pin')} />
                            <Button variant="outlined" color="primary" type="submit">{t('commons.remove')}</Button>
                        </FormControl>
                    </form>
                    :
                    <p>{t('commons.appointment-removed')}</p>
                }
            </Card>
        </div>
    )
}

export default AppointmentRemoval