import React from 'react'
import { Button, Card, FormControl, TextField } from '@material-ui/core'
import { toast } from 'react-toastify'
import API from '../../communication/API'

function RegisterAdmin() {
    
    const register = (e) => {
        e.preventDefault()
        const name = e.target.name.value
        const restaurantName = e.target.restaurantName.value
        const email = e.target.email.value
        const password = e.target.password.value
    
        API.post('api/users/register-admin/', {email, password, restaurantName, name}).then(result => {
            if(result.body.success) {
                toast.success('Sikeres regisztráció', {autoClose: 1200})
            }else{
                toast.warning('Sikertelen regisztráció', {autoClose: 1200})
            }
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