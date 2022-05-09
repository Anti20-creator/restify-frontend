import { Card, FormControl, TextField, Button } from '@material-ui/core'
import React from 'react'
import { toast } from 'react-toastify'
import API from '../../communication/API'
import { t } from 'i18next'

function Login({setAuthenticated, setUserLoading}) {

    const login = async (e) => {
        e.preventDefault()

        const email = e.target.email.value
        const password = e.target.password.value

        if(!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(e.target.elements.email.value))){
            toast.error(t('api.email-format-error'))
            return
        }

        if(password.trim().length < 5) {
            toast.error(t('api.short-password'), {autoClose: 1200})
            return false
        }
    
        await API
            .post('api/users/login', {email, password})
            .then(result => {
                setAuthenticated(true)
                setUserLoading(true)
            })
            .catch(err => {
                console.warn(err)
                toast.error(t(`api.${err.response.data.message}`), {autoClose: 1200, position: 'bottom-center'})
                setAuthenticated(false)
            })
    }

    return (
        <div className="text-center d-flex align-items-center w-100 h-100 justify-content-center">
            <Card className="w-50 p-5 text-center login-card">
                <form onSubmit={login}>
                    <FormControl>
                        <TextField name="email" type="email" placeholder={t('commons.email')} />
                        <TextField name="password" type="password" placeholder={t('commons.password')} />
                        <Button variant="outlined" color="primary" type="submit">{t('sidebar.login')}</Button>
                    </FormControl>
                </form>
            </Card>
        </div>
    )
}

export default Login