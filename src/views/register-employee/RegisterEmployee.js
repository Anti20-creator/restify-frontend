import React from 'react'
import { Button, Card, FormControl, TextField } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../../communication/API'

function RegisterEmployee() {
    
    const {restaurantId} = useParams()
    const register = (e) => {
        e.preventDefault()
        const registerToast = toast.loading('Regisztráció folyamatban...')
        const name = e.target.name.value
        const email = e.target.email.value
        const password = e.target.password.value
        const secretPin = e.target.pin.value
    
        API.post('api/users/register-employee/' + restaurantId, {email, password, secretPin, name}).then(result => {
            if(result.body.success) {
                toast.update(registerToast, {render: 'Sikeres regisztráció!', autoClose: 1200, isLoading: false, type: "success"})
            }
        }).catch(err => {
            toast.update(registerToast, {render: 'Sikertelen regisztráció!', autoClose: 1200, isLoading: false, type: "error"})

        })
    }
    
    return (
        <div className="text-center d-flex align-items-center w-100 h-100 justify-content-center">
            <Card className="w-50 p-5 text-center">
                <form onSubmit={register}>
                    <FormControl>
                        <TextField name="name" type="text" placeholder="Teljes név" />
                        <TextField name="email" type="email" placeholder="E-mail" />
                        <TextField name="password" type="password" placeholder="Jelszó" />
                        <TextField name="pin" type="text" placeholder="Étterem PIN" />
                        <Button variant="outlined" color="primary" type="submit">Regisztráció</Button>
                    </FormControl>
                </form>
            </Card>
        </div>
    )
}

export default RegisterEmployee