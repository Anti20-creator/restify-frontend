import { TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
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
    const mondayRef = useRef(null)
    const tuesdayRef = useRef(null)
    const wednesdayRef = useRef(null)
    const thursdayRef = useRef(null)
    const fridayRef = useRef(null)
    const saturdayRef = useRef(null)
    const sundayRef = useRef(null)
    const [currency, setCurrency] = useState(null)

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value)
    }

    useEffect(() => {
        API.get('/api/informations').then(({data}) => {
            console.log(data)
            setInfos(data.message)
            cityRef.current.value = data.message.city ?? ''
            postalCodeRef.current.value = data.message.postalCode ?? ''
            addressRef.current.value = data.message.address ?? ''
            taxNumberRef.current.value = data.message.taxNumber ?? ''
            phoneNumberRef.current.value = data.message.phoneNumber ?? ''
            mondayRef.current.value = data.message.openingTimes[0] ?? ''
            tuesdayRef.current.value = data.message.openingTimes[1] ?? ''
            wednesdayRef.current.value = data.message.openingTimes[2] ?? ''
            thursdayRef.current.value = data.message.openingTimes[3] ?? ''
            fridayRef.current.value = data.message.openingTimes[4] ?? ''
            saturdayRef.current.value = data.message.openingTimes[5] ?? ''
            sundayRef.current.value = data.message.openingTimes[6] ?? ''
            setCurrency(data.message.currency ?? 'USD')
        })
    }, [])

    const submitInfos = (e) => {
        e.preventDefault()
        const loadingToast = toast.loading('Adatok frissítése...')
        API.post('/api/informations/update', {
            city: e.target.elements.city.value,
            postalCode: e.target.elements.postalCode.value,
            address: e.target.elements.address.value,
            taxNumber: e.target.elements.taxNumber.value,
            phoneNumber: e.target.elements.phoneNumber.value,
            openingTimes: [
                {open: {hours: mondayRef.current.value.split('-')[0].split(':')[0], minutes: mondayRef.current.value.split('-')[0].split(':')[1]},
                close:  {hours: mondayRef.current.value.split('-')[1].split(':')[0], minutes: mondayRef.current.value.split('-')[1].split(':')[1]} },

                {open: {hours: tuesdayRef.current.value.split('-')[0].split(':')[0], minutes: tuesdayRef.current.value.split('-')[0].split(':')[1]},
                close:  {hours: tuesdayRef.current.value.split('-')[1].split(':')[0], minutes: tuesdayRef.current.value.split('-')[1].split(':')[1]} },

                {open: {hours: wednesdayRef.current.value.split('-')[0].split(':')[0], minutes: wednesdayRef.current.value.split('-')[0].split(':')[1]},
                close:  {hours: wednesdayRef.current.value.split('-')[1].split(':')[0], minutes: wednesdayRef.current.value.split('-')[1].split(':')[1]} },

                {open: {hours: thursdayRef.current.value.split('-')[0].split(':')[0], minutes: thursdayRef.current.value.split('-')[0].split(':')[1]},
                close:  {hours: thursdayRef.current.value.split('-')[1].split(':')[0], minutes: thursdayRef.current.value.split('-')[1].split(':')[1]} },

                {open: {hours: fridayRef.current.value.split('-')[0].split(':')[0], minutes: fridayRef.current.value.split('-')[0].split(':')[1]},
                close:  {hours: fridayRef.current.value.split('-')[1].split(':')[0], minutes: fridayRef.current.value.split('-')[1].split(':')[1]} },

                {open: {hours: saturdayRef.current.value.split('-')[0].split(':')[0], minutes: saturdayRef.current.value.split('-')[0].split(':')[1]},
                close:  {hours: saturdayRef.current.value.split('-')[1].split(':')[0], minutes: saturdayRef.current.value.split('-')[1].split(':')[1]} },

                {open: {hours: sundayRef.current.value.split('-')[0].split(':')[0], minutes: sundayRef.current.value.split('-')[0].split(':')[1]},
                close:  {hours: sundayRef.current.value.split('-')[1].split(':')[0], minutes: sundayRef.current.value.split('-')[1].split(':')[1]} },
            ],
            currency: currency
        }).then(response => {
            toast.update(loadingToast, {render: 'Adatok sikeresen frissítve!', autoClose: 1200, type: "success", isLoading: false})
        }).catch(err => {
            cityRef.current.value = infos.city ?? ''
            postalCodeRef.current.value = infos.postalCode ?? ''
            addressRef.current.value = infos.address ?? ''
            taxNumberRef.current.value = infos.taxNumber ?? ''
            phoneNumberRef.current.value = infos.phoneNumber ?? ''
            mondayRef.current.value = infos.openingTimes[0] ?? ''
            tuesdayRef.current.value = infos.openingTimes[1] ?? ''
            wednesdayRef.current.value = infos.openingTimes[2] ?? ''
            thursdayRef.current.value = infos.openingTimes[3] ?? ''
            fridayRef.current.value = infos.openingTimes[4] ?? ''
            saturdayRef.current.value = infos.openingTimes[5] ?? ''
            sundayRef.current.value = infos.openingTimes[6] ?? ''
            toast.update(loadingToast, {render: 'Hiba a frissítés során!', autoClose: 1200, type: "error", isLoading: false})
        })
    }

    return (
        <div className="container-fluid overflow-auto">
            <div className="col-12 mx-auto">
                <form onSubmit={(e) => submitInfos(e)} className="w-50 text-center mx-auto">
                    <Typography className="text-center" variant="h5">
                        Számlázási adatok
                    </Typography>
                    <TextField inputRef={cityRef} className="w-100" name="city" placeholder='Város' />
                    <TextField inputRef={postalCodeRef} className="w-100" name="postalCode" placeholder='Irányítószám' />
                    <TextField inputRef={addressRef} className="w-100" name="address" placeholder='Cím' />
                    <TextField inputRef={taxNumberRef} className="w-100" name="taxNumber" placeholder='Adószám' />
                    <TextField inputRef={phoneNumberRef} className="w-100" name="phoneNumber" placeholder='Telefonszám' />
                    
                    <Typography className="text-center" variant="h5">
                        Nyitavatartás
                    </Typography>
                    <TextField inputRef={mondayRef} className="w-100" name="monday" placeholder="Hétfői nyitvatartás" />
                    <TextField inputRef={tuesdayRef} className="w-100" name="tuesday" placeholder="Keddi nyitvatartás" />
                    <TextField inputRef={wednesdayRef} className="w-100" name="wednesday" placeholder="Szerdai nyitvatartás" />
                    <TextField inputRef={thursdayRef} className="w-100" name="thursday" placeholder="Csütörtöki nyitvatartás" />
                    <TextField inputRef={fridayRef} className="w-100" name="friday" placeholder="Pénteki nyitvatartás" />
                    <TextField inputRef={saturdayRef} className="w-100" name="saturday" placeholder="Szombati nyitvatartás" />
                    <TextField inputRef={sundayRef} className="w-100" name="sunday" placeholder="Vasárnapi nyitvatartás" />
                    
                    <Typography className="text-center" variant="h5">
                        További beállítások
                    </Typography>
                    <FormControl className="pb-3" fullWidth>
                      <InputLabel id="demo-simple-select-label">Pénznem</InputLabel>
                      <Select
                        value={currency}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Age"
                        onChange={handleCurrencyChange}
                      >
                        <MenuItem value={'HUF'}>HUF</MenuItem>
                        <MenuItem value={'USD'}>USD</MenuItem>
                        <MenuItem value={'EUR'}>EUR</MenuItem>
                      </Select>
                    </FormControl>

                    <Button type="submit" variant="outlined" color="primary">Mentés</Button>
                </form>
            </div>
        </div>
    )
}

export default Settings