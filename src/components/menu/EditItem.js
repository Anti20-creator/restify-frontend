import React from 'react'
import { Modal, Box, Typography, Button, TextField } from '@material-ui/core'
import { toast } from 'react-toastify'
import API from '../../communication/API'
import { useDispatch, useSelector } from 'react-redux'
import { editItem, getMenuItem } from '../../store/features/menuSlice'

function EditCategory({open, setOpen, itemName, category}) {
    
    const dispatch = useDispatch()
    const item = useSelector(getMenuItem(itemName, category))

    const updateItem = (e) => {
        e.preventDefault()

        const editToast = toast.loading('Elem frissítése...')
        const newName = e.target.elements.food.value
        const price = e.target.elements.price.value
        const amount = e.target.elements.amount.value
        const unit = e.target.elements.unit.value
        API.post('/api/menu/modify-item', {
            name: newName,
            oldName: itemName,
            amount,
            unit,
            price,
            category
        }).then(result => {
            dispatch(editItem({oldName: itemName, newName: newName, price, amount, unit, category}))
            toast.update(editToast, {render: 'Sikeres frissítés', isLoading: false, autoClose: 1200, type: 'success'})
            setOpen('')
        }).catch(err => {
            toast.update(editToast, {render: 'Hiba a frissítés közben...', isLoading: false, autoClose: 1200, type: 'error'})
        })
    }
    
    return (
        <Modal
            open={open}
            onClose={() => setOpen('')}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
                <Box>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Elem szerkesztése
                    </Typography>
                    <form className="text-center" onSubmit={updateItem}>
                        <TextField defaultValue={itemName} name="food" label="Elem neve" variant="standard" type="text" className="my-2" />
                        <TextField defaultValue={item.price} name="price" label="Ár" variant="standard" type="number" className="my-2" />
                        <TextField defaultValue={item.amount} name="amount" label="Mennyiség" variant="standard" type="number" className="my-2" />
                        <TextField defaultValue={item.unit} name="unit" label="Egység" variant="standard" type="text" className="my-2" />
                        <br />
                        <Button variant="contained" color="primary" className="m-auto mt-2" type="submit">
                            Mentés
                        </Button>
                    </form>
                </Box>
            </Modal>
    )
}

export default EditCategory