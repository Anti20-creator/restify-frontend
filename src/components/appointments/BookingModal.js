import React, { useRef, useState, useEffect } from 'react'
import { Modal, Box, Typography, Button, TextField, Select, FormControl, InputLabel, MenuItem, ListItem, ListItemText, List, CircularProgress } from '@material-ui/core'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import API from '../../communication/API';
import { getSocket } from '../../communication/socket';
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { addAppointment } from '../../store/features/appointmentsSlice'
import Dialog from '@mui/material/Dialog'
const moment = require('moment-timezone')

function BookingModal({addModalOpen, setModalOpen, tableIds}) {

    const [value, setValue] = React.useState(null)
    const [localId, setLocalId] = useState(-1)
    const [openConfirmal, setOpenConfirmal] = useState(false)
    const [conflictingData, setConflictingData] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const peopleCountRef = useRef(null)
    const [formData, setFormData] = useState(null)
    const dispatch = useDispatch()

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
            toast.error('A foglalás nem hagyható jóvá', {autoClose: 1200})
            return
        }

        const searchingToast = toast.loading('Időpont keresése...', {
            position: "bottom-center",
            closeOnClick: true,
            progress: undefined,
            autoClose: 2000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: false,
        });
        API.post('/api/appointments/book-for-guest', formData).then(result => {
            toast.update(searchingToast, { render: "Sikeres foglalás!", type: "success", isLoading: false, autoClose: 2000 })
            dispatch(addAppointment(result.data.message))
            setModalOpen(false)
            setOpenConfirmal(false)
            getSocket().emit('new-appointment')
        }).catch(err => {
            toast.update(searchingToast, { render: "Nincs üres asztal a megadott időpontban!", type: "error", isLoading: false, autoClose: 2000 })
        })
    }

    const submitForm = (e) => {
        e.preventDefault()

        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.elements.email.value)) || e.target.elements.email.value.trim() === ''){
            toast.error('Az e-mail formátuma nem megfelelő!')
            return
        }
        
        if(isNaN(Date.parse(e.target.elements.date.value))) {
            toast.error('A dátum formátuma nem megfelelő!')
            return    
        }
        
        if(parseInt(e.target.elements.peopleCount.value) < 1) {
            toast.error('Legalább 1 vendégnek érkeznie kell!')
            return
        }
        
        if(localId < 0) {
            toast.error('Válasszon ki egy asztalt!')
            return
        }

        setOpenConfirmal(true);
        saveFormData(e)
    }

  return (
    <>
        <Modal
            open={addModalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Időpont keresése
                </Typography>
                <form className="text-center" onSubmit={submitForm}>
                    <TextField name="email" label="E-mail" variant="standard" type="email" className="my-4" />
                    <br />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        minDate={new Date()}
                        renderInput={(props) => <TextField name="date" {...props} />}
                        label="Válassz dátumot"
                        ampm={false}
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue)
                        }}
                    />
                    </LocalizationProvider>
                    <br />
                    <TextField ref={peopleCountRef} name="peopleCount" label="Vendégek száma" variant="standard" type="number" className="my-4" />
                    <br />
                    <FormControl className="w-75 my-4">
                        <InputLabel id="demo-controlled-open-select-label">Asztal</InputLabel>
                        <Select value={localId} onChange={(e) => setLocalId(e.target.value)}>
                            {tableIds.map((ids) => (
                                <MenuItem key={ids.localId + 1} value={ids.localId + 1}>Asztal #{ids.localId + 1}</MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>
                    <br />
                    <Button variant="contained" color="primary" className="m-auto mx-2" type="submit">
                        Foglalás indítása
                    </Button>          
                </form>
            </Box>
        </Modal>

        <Dialog disableEnforceFocus open={openConfirmal}>
            <div className="p-3">
                <h5>Dátum: {moment(value).utcOffset(0).format("YYYY.MM.DD. HH:mm:ss")}</h5>
                <h5>Asztal: {localId} </h5>

                <h6 className="mt-4 text-decoration-underline">Esedékes ütközések</h6>
                <List className="mb-3 px-3">
                    {
                        isLoading ?
                        <CircularProgress />
                        :
                        conflictingData.map((appointment, idx) => (
                            <ListItem key={idx}>
                                <ListItemText>
                                    {moment(appointment.date).utcOffset(0).format("YYYY.MM.DD. HH:mm:ss")}
                                </ListItemText>
                            </ListItem>
                        ))
                    }

                    {conflictingData.length === 0 && !isLoading && 
                        <p> Nincs a közelben időpont a megadott asztalhoz. </p>}
                </List>

                <div className="d-flex justify-content-between">
                    <Button variant="contained" color="primary" onClick={bookForDate}>Jóváhagyás</Button>
                    <Button variant="outlined" color="secondary" onClick={() => setOpenConfirmal(false)}>Mégsem</Button>
                </div>
            </div>
        </Dialog>
    </>
  )
}

export default BookingModal