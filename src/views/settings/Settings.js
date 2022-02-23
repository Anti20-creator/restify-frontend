import { FormControl, TextField, Button } from '@material-ui/core'
import React from 'react'

function Settings() {
        
    return (
        <div className="container-fluid overflow-auto">
            <div className="col-12 mx-auto">
                <FormControl className="w-50 text-center mx-auto">
                    <TextField className="w-100" name="city" placeholder='Város' />
                    <TextField className="w-100" name="postalCode" placeholder='Irányítószám' />
                    <TextField className="w-100" name="address" placeholder='Cím' />
                    <TextField className="w-100" name="taxNumber" placeholder='Adószám' />
                    <TextField className="w-100" name="phoneNumber" placeholder='Telefonszám' />
                    <Button variant="outlined" color="primary">Mentés</Button>
                </FormControl>
            </div>
        </div>
    )
}

export default Settings