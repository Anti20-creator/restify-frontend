import React, { useState } from 'react'
import { Modal, Box, Typography, Select, FormControl, MenuItem, Button, TextField } from '@material-ui/core'
import { toast } from 'react-toastify'
import API from '../../communication/API'
import { useDispatch } from 'react-redux'
import { editCategory } from '../../store/features/menuSlice'

function EditCategory({open, setOpen, category}) {
    
    const [categoryIcon, setCategoryIcon] = useState('')
    const icons = [
        'Noodles',
        'Bread',
        'Steak',
        'Cupcake',
        'Fish Food'
    ]
    const formIconChange = (e) => {
        setCategoryIcon(e.target.value)
    }
    const dispatch = useDispatch()

    const updateCategory = (e) => {
        e.preventDefault()

        const editToast = toast.loading('Kategória frissítése...')
        const newCategory = e.target.elements.category.value
        API.post('/api/menu/modify-category', {
            oldCategory: category,
            category: newCategory,
            categoryIcon
        }).then(result => {
            dispatch(editCategory({oldCategory: category, newCategory: newCategory, categoryIcon}))
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
                        Kategória szerkesztése
                    </Typography>
                    <form className="text-center" onSubmit={updateCategory}>
                        <TextField name="category" defaultValue={category} label="Kategória neve" variant="standard" type="text" className="my-2" />
                        <FormControl>
                            <Select
                            value={categoryIcon}
                            onChange={formIconChange}
                            displayEmpty
                            name="icon"
                            inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value="">
                                    <em>-</em>
                                </MenuItem>
                                {
                                    icons.map((icon) => (
                                        <MenuItem key={icon} value={icon}>{icon}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
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