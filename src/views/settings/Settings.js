import { TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import React, { useState, useEffect, useRef } from 'react'
import API from '../../communication/API'
import { toast } from 'react-toastify'
import openingTimesValidator from './validator'
import { useTranslation } from 'react-i18next'
import '../../localization/translations'

function Settings() {

    const { t } = useTranslation();
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

        const openingTimes = [
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
        ]
        
        if(!openingTimesValidator(openingTimes)) {
            toast.error(t('api.invalid-openingtimes-format'))
            return
        }


        const loadingToast = toast.loading(t('api.informations-loading'))
        API.post('/api/informations/update', {
            city: e.target.elements.city.value,
            postalCode: e.target.elements.postalCode.value,
            address: e.target.elements.address.value,
            taxNumber: e.target.elements.taxNumber.value,
            phoneNumber: e.target.elements.phoneNumber.value,
            openingTimes: openingTimes,
            currency: currency
        }).then(response => {
            toast.update(loadingToast, {render: t(`api.${response.data.message}`), autoClose: 1200, type: "success", isLoading: false})
        }).catch(err => {
            toast.update(loadingToast, {render: t('api.update-error'), autoClose: 1200, type: "error", isLoading: false})
        })
    }

    return (
        <div className="container-fluid overflow-auto">
            <div className="col-12 mx-auto">
                <form onSubmit={(e) => submitInfos(e)} className="w-50 text-center mx-auto">
                    <Typography className="text-center" variant="h5">
                        {t('commons.invoice-details')}
                    </Typography>
                    <TextField inputRef={cityRef} className="w-100" name="city" placeholder={t('commons.city')} />
                    <TextField inputRef={postalCodeRef} className="w-100" name="postalCode" placeholder={t('commons.postalcode')} />
                    <TextField inputRef={addressRef} className="w-100" name="address" placeholder={t('commons.address')} />
                    <TextField inputRef={taxNumberRef} className="w-100" name="taxNumber" placeholder={t('commons.taxnumber')} />
                    <TextField inputRef={phoneNumberRef} className="w-100" name="phoneNumber" placeholder={t('commons.phonenumber')} />
                    
                    <Typography className="text-center" variant="h5">
                        {t('commons.opening-hours')}
                    </Typography>
                    <TextField inputRef={mondayRef} className="w-100" name="monday" placeholder={t('commons.opening-monday')} />
                    <TextField inputRef={tuesdayRef} className="w-100" name="tuesday" placeholder={t('commons.opening-tuesday')} />
                    <TextField inputRef={wednesdayRef} className="w-100" name="wednesday" placeholder={t('commons.opening-wednesday')} />
                    <TextField inputRef={thursdayRef} className="w-100" name="thursday" placeholder={t('commons.opening-thursday')} />
                    <TextField inputRef={fridayRef} className="w-100" name="friday" placeholder={t('commons.opening-friday')} />
                    <TextField inputRef={saturdayRef} className="w-100" name="saturday" placeholder={t('commons.opening-saturday')} />
                    <TextField inputRef={sundayRef} className="w-100" name="sunday" placeholder={t('commons.opening-sunday')} />
                    
                    <Typography className="text-center" variant="h5">
                        {t('commons.more-settings')}
                    </Typography>
                    <FormControl className="pb-3" fullWidth>
                      <InputLabel id="demo-simple-select-label">{t('commons.currency')}</InputLabel>
                      <Select
                        value={currency}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label={t('commons.currency')}
                        onChange={handleCurrencyChange}
                      >
                        <MenuItem value={'HUF'}>HUF</MenuItem>
                        <MenuItem value={'USD'}>USD</MenuItem>
                        <MenuItem value={'EUR'}>EUR</MenuItem>
                      </Select>
                    </FormControl>

                    <Button type="submit" variant="outlined" color="primary">{t('commons.save')}</Button>
                </form>
            </div>
        </div>
    )
}

export default Settings