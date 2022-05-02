import React, { useEffect, useState } from 'react'
import { Button, Card, FormControl, TextField } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../../communication/API'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'

function AppointmentRemoval() {

    const { appointmentId } = useParams()
    const [posted, setPosted] = useState(false)
    const { i18n } = useTranslation()

    useEffect(() => {
        return () => setPosted(false)
    })

    const removeAppointment = (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const pin = e.target.pin.value

        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.elements.email.value))){
            toast.error(t('api.email-format-error'))
            return
        }

        if(pin.trim().length !== 6) {
            toast.error(t('api.invalid-appointment-pin-length'))
            return
        }
        
        const registerToast = toast.loading(t('api.removing-appointment'))
        API.delete('api/appointments/disclaim', {data:{email, pin, id: appointmentId, lang: i18n.language}}).then(result => {
            toast.update(registerToast, {render: t(`api.${result.data.message}`), autoClose: 1200, isLoading: false, type: "success"})
            setPosted(true)
        }).catch(err => {
            toast.update(registerToast, {render: t(`api.${err.response.data.message}`), autoClose: 1200, isLoading: false, type: "error"})
        })
    }

    return (
        <div className="text-center d-flex align-items-center w-100 h-100 justify-content-center">
            <Card className="w-50 p-5 text-center appointment-removal-card">
                {
                    !posted ? 
                    <form onSubmit={removeAppointment}>
                        <FormControl>
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