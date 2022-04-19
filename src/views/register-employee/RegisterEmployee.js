import React from 'react'
import { Button, Card, FormControl, TextField } from '@material-ui/core'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../../communication/API'
import { useTranslation } from 'react-i18next'

function RegisterEmployee() {
    
    const { restaurantId } = useParams()
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()

    const register = (e) => {
        e.preventDefault()
        const registerToast = toast.loading(t('api.registration-in-progress'))
        const name = e.target.name.value
        const email = e.target.email.value
        const password = e.target.password.value
        const secretPin = e.target.pin.value
    
        API.post('api/users/register-employee/' + restaurantId, {email, password, secretPin, name, lang: i18n.language}).then(result => {
            toast.update(registerToast, {render: t(`api.${result.data.message}`), autoClose: 1200, isLoading: false, type: "success"})
            navigate('../')
        }).catch(err => {
            toast.update(registerToast, {render: t(`api.${err.response.data.message}`), autoClose: 1200, isLoading: false, type: "error"})
        })
    }
    
    return (
        <div className="text-center d-flex align-items-center w-100 h-100 justify-content-center">
            <Card className="w-50 p-5 text-center">
                <form onSubmit={register}>
                    <FormControl>
                    <TextField name="name" type="text" placeholder={t('commons.full-name')} />
                        <TextField name="email" type="email" placeholder={t('commons.email')} />
                        <TextField name="password" type="password" placeholder={t('commons.password')} />
                        <TextField name="pin" type="text" placeholder={t('commons.restaurant-pin')} />
                        <Button variant="outlined" color="primary" type="submit">{t('sidebar.register')}</Button>
                    </FormControl>
                </form>
            </Card>
        </div>
    )
}

export default RegisterEmployee