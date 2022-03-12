import React, { useRef } from 'react'
import { Modal, Box, Typography, Button, TextField } from '@material-ui/core'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import API from '../../communication/API';
import { getSocket } from '../../communication/socket';
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { addAppointment } from '../../store/features/appointmentsSlice'

function BookingModal({addModalOpen, setModalOpen}) {

    const [value, setValue] = React.useState(null);
    const dispatch = useDispatch()
    const selectedDate = useRef(new Date())

    const bookForDate = (e) => {

        e.preventDefault()

        const searchingToast = toast.loading('Időpont keresése...', {
            position: "bottom-center",
            closeOnClick: true,
            progress: undefined,
            autoClose: 2000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: false,
        });
        console.log(e.target.elements.date.value)
        console.log(new Date().getTimezoneOffset())
        API.post('/api/appointments/find-tables', {
            email: e.target.elements.email.value,
            date: e.target.elements.date.value,
            peopleCount: e.target.elements.peopleCount.value,
            timezoneOffset: new Date().getTimezoneOffset()
        }).then(result => {
            if(!result.data.success) {
                toast.update(searchingToast, { render: "Nincs üres asztal a megadott időpontban!", type: "error", isLoading: false, autoClose: 2000 })
            }else{
                toast.update(searchingToast, { render: "Sikeres foglalás!", type: "success", isLoading: false, autoClose: 2000 })
                dispatch(addAppointment(result.data.message))
                getSocket().emit('new-appointment')
                setModalOpen(false)
            }
        }).catch(err => {
            toast.update(searchingToast, { render: "Nincs üres asztal a megadott időpontban!", type: "error", isLoading: false, autoClose: 2000 })
        })
    }

  return (
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
            <form className="text-center" onSubmit={bookForDate}>
                <TextField name="email" label="E-mail" variant="standard" type="email" className="my-4" />
                <br />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
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
                <TextField name="peopleCount" label="Vendégek száma" variant="standard" type="number" className="my-4" />
                <br />
                <Button variant="contained" color="primary" className="m-auto mx-2" type="submit">
                    Foglalás indítása
                </Button>          
                {/*<Button variant="contained" color="primary" className="m-auto mx-2" type="submit">
                    Foglalás
                </Button>
                <Button variant="contained" color="secondary" className="m-auto error mx-2" type="submit">
                    Mégsem
                </Button>*/}
            </form>
        </Box>
    </Modal>
  )
}

export default BookingModal