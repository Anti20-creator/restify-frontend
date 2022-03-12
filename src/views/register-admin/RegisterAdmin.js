import React from 'react'
import { Button, Card, FormControl, TextField } from '@material-ui/core'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import API from '../../communication/API'

function RegisterAdmin() {

    const navigate = useNavigate()
    
    const register = (e) => {
        e.preventDefault()
        const name = e.target.name.value
        const restaurantName = e.target.restaurantName.value
        const email = e.target.email.value
        const password = e.target.password.value

        const loadingToast = toast.loading('Regisztráció folyamatban...')
        API.post('api/users/register-admin/', {email, password, restaurantName, name}).then(result => {
            toast.update(loadingToast, {render: 'Sikeres regisztráció', autoClose: 1200, isLoading: false, type: "success"})
            navigate('../')
        }).catch(err => {    
            toast.update(loadingToast, {render: 'Sikertelen regisztráció', autoClose: 1200, isLoading: false, type: "error"})
        })
    }

    return (
        <div className="text-center d-flex align-items-center w-100 h-100 justify-content-center">
            <Card className="w-50 p-5 text-center">
                <form onSubmit={register}>
                    <FormControl>
                        <TextField name="name" type="text" placeholder="Teljes név" />
                        <TextField name="restaurantName" type="text" placeholder="Étterem neve" />
                        <TextField name="email" type="email" placeholder="E-mail" />
                        <TextField name="password" type="password" placeholder="Jelszó" />
                        <Button variant="outlined" color="primary" type="submit">Regisztráció</Button>
                    </FormControl>
                </form>
            </Card>
        </div>
    )
}

export default RegisterAdmin