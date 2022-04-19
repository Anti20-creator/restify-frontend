import React from 'react'
import { Modal, Box, Typography, Button, TextField } from '@material-ui/core'
import { toast } from 'react-toastify'
import API from '../../communication/API'
import { useDispatch, useSelector } from 'react-redux'
import { editItem, getMenuItem, deleteItem } from '../../store/features/menuSlice'
import { useTranslation } from 'react-i18next'

function EditCategory({open, setOpen, itemName, category}) {
    
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const item = useSelector(getMenuItem(itemName, category))

    const updateItem = (e) => {
        e.preventDefault()

        const editToast = toast.loading(t('api.updating-menuitem'))
        const newName = e.target.elements.food.value
        const price = Number(e.target.elements.price.value)
        const amount = Number(e.target.elements.amount.value)
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
            toast.update(editToast, {render: t(`api.${result.data.message}`), isLoading: false, autoClose: 1200, type: 'success'})
            setOpen('')
        }).catch(err => {
            toast.update(editToast, {render: t(`api.${err.response.data.message}`), isLoading: false, autoClose: 1200, type: 'error'})
        })
    }

    const removeItem = (e) => {
        e.preventDefault()

        const editToast = toast.loading(t('api.deleting-menuitem'))
        API.delete('/api/menu/delete-item', {data: {
            name: itemName,
            category: category
        }}).then(result => {
            setOpen('')
            dispatch(deleteItem({name: itemName, category: category}))
            toast.update(editToast, {render: t(`api.${result.data.message}`), isLoading: false, autoClose: 1200, type: 'success'})
        }).catch(err => {
            toast.update(editToast, {render: t(`api.${err.response.data.message}`), isLoading: false, autoClose: 1200, type: 'error'})
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
                        {t('commons.modify-item')}
                    </Typography>
                    <form className="text-center" onSubmit={updateItem}>
                        <TextField defaultValue={itemName} name="food" label={t('commons.food-name')} variant="standard" type="text" className="my-2" />
                        <TextField defaultValue={item.price} name="price" label={t('commons.price')} variant="standard" type="number" className="my-2" />
                        <TextField defaultValue={item.amount} name="amount" label={t('commons.amount')} variant="standard" type="number" className="my-2" />
                        <TextField defaultValue={item.unit} name="unit" label={t('commons.unit')} variant="standard" type="text" className="my-2" />
                        <br />
                        <div className="d-flex justify-content-between">
                            <Button variant="contained" color="primary" className="m-auto mt-2" type="submit">
                                {t('commons.save')}
                            </Button>
                            <Button onClick={removeItem} variant="contained" color="secondary" className="m-auto mt-2">
                                {t('commons.remove')}
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
    )
}

export default EditCategory