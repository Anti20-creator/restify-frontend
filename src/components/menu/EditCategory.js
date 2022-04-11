import React, { useState, useEffect } from 'react'
import { Modal, Box, Typography, Select, FormControl, MenuItem, Button, TextField } from '@material-ui/core'
import { toast } from 'react-toastify'
import API from '../../communication/API'
import { useDispatch } from 'react-redux'
import { editCategory, deleteCategory } from '../../store/features/menuSlice'
import icons from '../../components/menu/icons.json'

function EditCategory({open, setOpen, category}) {
    
    const [categoryIcon, setCategoryIcon] = useState(category.icon)

    useEffect(() => {
        setCategoryIcon(category.icon)
    }, [category])

    const formIconChange = (e) => {
        setCategoryIcon(e.target.value)
    }

    const dispatch = useDispatch()

    const updateCategory = (e) => {
        e.preventDefault()

        const editToast = toast.loading('Kategória frissítése...')
        const newCategory = e.target.elements.category.value
        API.post('/api/menu/modify-category', {
            oldCategory: category.category,
            category: newCategory,
            categoryIcon
        }).then(result => {
            dispatch(editCategory({oldCategory: category.category, newCategory: newCategory, categoryIcon}))
            toast.update(editToast, {render: 'Sikeres frissítés', isLoading: false, autoClose: 1200, type: 'success'})
            setOpen({category: '', icon: ''})
        }).catch(err => {
            toast.update(editToast, {render: 'Hiba a frissítés közben...', isLoading: false, autoClose: 1200, type: 'error'})
        })
    }

    const removeCategory = (e) => {
        e.preventDefault()

        const editToast = toast.loading('Kategória törlése...')
        API.delete('/api/menu/delete-category', {data: {
            category: category.category
        }}).then(result => {
            dispatch(deleteCategory(category.category))
            toast.update(editToast, {render: 'Sikeres törlés!', isLoading: false, autoClose: 1200, type: 'success'})
            setOpen({category: '', icon: ''})
        }).catch(err => {
            toast.update(editToast, {render: 'Hiba a törlés közben...', isLoading: false, autoClose: 1200, type: 'error'})
        })
    }
    
    return (
        <Modal
            open={open}
            onClose={() => setOpen({category: '', icon: ''})}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
                <Box>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Kategória szerkesztése
                    </Typography>
                    <form className="text-center" onSubmit={updateCategory}>
                        <TextField name="category" defaultValue={category.category} label="Kategória neve" variant="standard" type="text" className="my-2" />
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
                                    Object.keys(icons).map((icon) => (
                                        <MenuItem key={icon} value={icon}>{icons[icon].hu}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <br />
                        <div className="d-flex justify-content-between pt-3">
                            <Button variant="contained" color="primary" className="m-auto mt-2" type="submit">
                                Mentés
                            </Button>
                            <Button onClick={removeCategory} variant="contained" color="secondary" className="m-auto mt-2" type="submit">
                                Törlés
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
    )
}

export default EditCategory