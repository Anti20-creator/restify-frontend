import { TextField, Button } from '@material-ui/core'
import React, { useState, useEffect, useRef } from 'react'
import API from '../../communication/API'
import { toast } from 'react-toastify'

function Settings() {

    const [infos, setInfos] = useState({})
    const cityRef = useRef(null)
    const postalCodeRef = useRef(null)
    const addressRef = useRef(null)
    const taxNumberRef = useRef(null)
    const phoneNumberRef = useRef(null)

    useEffect(() => {
        API.get('/api/informations').then(({data}) => {
            console.log(data)
            setInfos(data.message)
            cityRef.current.value = data.message.city
            postalCodeRef.current.value = data.message.postalCode
            addressRef.current.value = data.message.address
            taxNumberRef.current.value = data.message.taxNumber
            phoneNumberRef.current.value = data.message.phoneNumber
        })
    }, [])

    const submitInfos = (e) => {
        e.preventDefault()
        const loadingToast = toast.loading('Adatok frissítése...')
        API.post('/api/informations/update', {
            city: e.target.elements.city.value === '' ? infos.city : e.target.elements.city.value,
            postalCode: e.target.elements.postalCode.value === '' ? infos.postalCode : e.target.elements.postalCode.value,
            address: e.target.elements.address.value === '' ? infos.address : e.target.elements.address.value,
            taxNumber: e.target.elements.taxNumber.value === '' ? infos.taxNumber : e.target.elements.taxNumber.value,
            phoneNumber: e.target.elements.phoneNumber.value === '' ? infos.phoneNumber : e.target.elements.phoneNumber.value
        }).then(response => {
            toast.update(loadingToast, {render: 'Adatok sikeresen frissítve!', autoClose: 1200, type: "success", isLoading: false})
        }).catch(err => {
            cityRef.current.value = infos.city
            postalCodeRef.current.value = infos.postalCode
            addressRef.current.value = infos.address
            taxNumberRef.current.value = infos.taxNumber
            phoneNumberRef.current.value = infos.phoneNumber
            toast.update(loadingToast, {render: 'Hiba a frissítés során!', autoClose: 1200, type: "error", isLoading: false})
        })
    }

    return (
        <div className="container-fluid overflow-auto">
            <div className="col-12 mx-auto">
                <form onSubmit={(e) => submitInfos(e)} className="w-50 text-center mx-auto">
                    <TextField inputRef={cityRef} className="w-100" name="city" placeholder='Város' />
                    <TextField inputRef={postalCodeRef} className="w-100" name="postalCode" placeholder='Irányítószám' />
                    <TextField inputRef={addressRef} className="w-100" name="address" placeholder='Cím' />
                    <TextField inputRef={taxNumberRef} className="w-100" name="taxNumber" placeholder='Adószám' />
                    <TextField inputRef={phoneNumberRef} className="w-100" name="phoneNumber" placeholder='Telefonszám' />
                    <Button type="submit" variant="outlined" color="primary">Mentés</Button>
                </form>
            </div>
        </div>
    )
}

export default Settings