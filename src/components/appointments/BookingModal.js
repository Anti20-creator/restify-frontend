import React, { useRef, useState, useEffect } from 'react'
import { Box, Typography, Button, TextField, Select, FormControl, InputLabel, MenuItem, ListItem, ListItemText, List, CircularProgress } from '@material-ui/core'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import API from '../../communication/API';
import { getSocket } from '../../communication/socket';
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { addAppointment } from '../../store/features/appointmentsSlice'
import Dialog from '@mui/material/Dialog'
import { useTranslation } from 'react-i18next';
import Modal from '@mui/material/Modal'
import moment from 'moment-timezone'

function BookingModal({addModalOpen, setModalOpen, tableIds}) {

    const dispatch = useDispatch()
    const { t, i18n } = useTranslation()
    const peopleCountRef = useRef(null)
    const [value, setValue] = useState(null)
    const [localId, setLocalId] = useState(-1)
    const [openConfirmal, setOpenConfirmal] = useState(false)
    const [conflictingData, setConflictingData] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [formData, setFormData] = useState(null)

    useEffect(() => {
        if(openConfirmal) {
            setLoading(true)
            API.post('/api/appointments/booking-conflicts', {
                peopleCount: Number(formData.peopleCount),
                tableId: tableIds.find(table => table.localId === localId - 1).id,
                date: formData.date.toString()
            }).then(result => {
                setConflictingData(result.data.message)
                setError(false)
                setLoading(false)
            }).catch(err => {
                setError(true)
                setLoading(false)
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openConfirmal])

    const saveFormData = (e) => {
        e.preventDefault()

        const peopleCount = parseInt(e.target.elements.peopleCount.value)
        const email = e.target.elements.email.value

        setFormData({
            email: email,
            date: e.target.elements.date.value,
            peopleCount: peopleCount,
            timezoneOffset: new Date().getTimezoneOffset(),
            tableId: tableIds.find(ids => ids.localId === (localId - 1)).id
        })
    }

    const bookForDate = () => {
        if(error) {
            toast.error(t('api.appointment-error'), {autoClose: 1200})
            return
        }

        const searchingToast = toast.loading(t('api.appointment-lookup'), {autoClose: 2000});
        API.post('/api/appointments/book-for-guest', {...formData, lang: i18n.language}).then(result => {
            toast.update(searchingToast, { render: t('api.appointment-booked'), type: "success", isLoading: false, autoClose: 2000 })
            dispatch(addAppointment(result.data.message))
            closeModal()
            setOpenConfirmal(false)
            getSocket().emit('new-appointment')
        }).catch(err => {
            toast.update(searchingToast, { render: t(`api.${err.response.data.message}`), type: "error", isLoading: false, autoClose: 2000 })
        })
    }

    const submitForm = (e) => {
        e.preventDefault()

        if(!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(e.target.elements.email.value))){
            toast.error(t('api.email-format-error'))
            return
        }
        
        if(isNaN(Date.parse(e.target.elements.date.value))) {
            toast.error(t('api.date-format-error'))
            return    
        }
        
        if(parseInt(e.target.elements.peopleCount.value) < 1) {
            toast.error(t('api.peoplecount-error'))
            return
        }
        
        if(localId < 0) {
            toast.error(t('api.no-table-selected'))
            return
        }

        setOpenConfirmal(true);
        saveFormData(e)
    }

    const closeModal = () => {
        setValue(null)
        setLocalId(-1)
        setModalOpen(false)
        setFormData(null)
    }

  return (
    <>
        <Modal
            open={addModalOpen}
            onClose={() => closeModal()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t('commons.search-appointment')}
                </Typography>
                <form className="text-center" onSubmit={submitForm}>
                    <TextField name="email" label="E-mail" variant="standard" type="email" className="my-4" />
                    <br />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        minDate={new Date()}
                        renderInput={(props) => <TextField name="date" {...props} />}
                        label={t('commons.choose-date')}
                        ampm={false}
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue)
                        }}
                    />
                    </LocalizationProvider>
                    <br />
                    <TextField ref={peopleCountRef} name="peopleCount" label={t('commons.peoplecount')} variant="standard" type="number" className="my-4" />
                    <br />
                    <FormControl className="w-75 my-4">
                        <InputLabel id="demo-controlled-open-select-label">{t('commons.table')}</InputLabel>
                        <Select value={localId === -1 ? '' : localId} onChange={(e) => setLocalId(e.target.value)}>
                            {
                                tableIds.map((ids) => (
                                    <MenuItem key={ids.localId + 1} value={ids.localId + 1}>{t('commons.table')} #{ids.localId + 1}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <br />
                    <Button variant="contained" color="primary" className="m-auto mx-2" type="submit">
                        {t('commons.start-booking')}
                    </Button>          
                </form>
            </Box>
        </Modal>

        <Dialog disableEnforceFocus open={openConfirmal}>
            <div className="p-3">
                <h5>{t('commons.date')}: {moment(value).format("L HH:mm")}</h5>
                <h5>{t('commons.table')}: {localId} </h5>

                <h6 className="mt-4 text-decoration-underline">{t('commons.optional-conflicts')}</h6>
                <List className="mb-3 px-3">
                    {
                        isLoading ?
                        <CircularProgress />
                        :
                        !error ?
                            conflictingData.map((appointment, idx) => (
                                <ListItem key={idx}>
                                    <ListItemText>
                                        {moment(appointment.date).utcOffset(0).format("L HH:mm")}
                                    </ListItemText>
                                </ListItem>
                            ))
                        :
                            <ListItem>
                                <ListItemText>
                                    {
                                        error === 'too-many-people' ? 
                                        t('api.too-many-people')
                                        :
                                        t('commons.error-while-searching')
                                    }
                                </ListItemText>
                            </ListItem>
                    }

                    {conflictingData.length === 0 && !isLoading && 
                        <p> {t('commons.no-appointment-conflicts')} </p>}
                </List>

                <div className="d-flex justify-content-between">
                    <Button variant="contained" color="primary" onClick={bookForDate}>{t('commons.approve')}</Button>
                    <Button variant="outlined" color="secondary" onClick={() => setOpenConfirmal(false)}>{t('commons.cancel')}</Button>
                </div>
            </div>
        </Dialog>
    </>
  )
}

export default BookingModal