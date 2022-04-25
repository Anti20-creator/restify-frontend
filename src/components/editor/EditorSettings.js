import React, { useState } from 'react'
import API from '../../communication/API'
import Dialog from '@mui/material/Dialog';
import { TextField, Button, Checkbox } from '@mui/material';
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux';
import { updateSize } from '../../store/features/layoutSlice';
import { useTranslation } from 'react-i18next'
import { getSocket } from '../../communication/socket';

function EditorSettings({close, initialX, initialY}) {

    const dispatch = useDispatch()
    const { t } = useTranslation()
    const [file, setFile] = useState(null)
    const [fileUploadDisabled, setFileUploadDisabled] = useState(false)

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const save = (e) => {
        e.preventDefault()

        const sizeX = e.target.elements.sizeX.value
        const sizeY = e.target.elements.sizeY.value

        if(sizeX < 0 || sizeY < 0) {
            //TODO
            return;
        }

        const formData = new FormData()
        formData.append("image", file)
        formData.append("sizeX", Number(sizeX))
        formData.append("sizeY", Number(sizeY))
        formData.append("sentImage", file !== null)
        formData.append("deleteImage", e.target.elements.delete.checked)
        formData.append("extName", file ? file.name.split('.').pop() : null)

        const loadingToast = toast.loading(t(`api.layout-settings-loading`), {position: "bottom-center"})
        API.post('/api/layouts/update', formData).then(response => {
            dispatch(updateSize({sizeX: Number(sizeX), sizeY: Number(sizeY)}))
            getSocket().emit('layout-size-modified', {sizeX: Number(sizeX), sizeY: Number(sizeY)})
            toast.update(loadingToast, {render: t(`api.${response.data.message}`), autoClose: 1200, isLoading: false, type: "success"})
            close()
        }).catch(err => {
            toast.update(loadingToast, {render: t(`api.${err.response.data.message}`), autoClose: 1200, isLoading: false, type: "error"})
        })

    }
    
    return (
        <Dialog disableEnforceFocus open={true} onClose={close} className="text-center">
            <form onSubmit={(e) => save(e)} className="p-3">
                <TextField defaultValue={initialX} variant="standard" name="sizeX" type="number" min="0" placeholder={t('commons.width')} />
                <br />
                <TextField defaultValue={initialY} variant="standard" name="sizeY" type="number" min="0" placeholder={t('commons.height')} />
                <br />
                <TextField disabled={fileUploadDisabled} variant="standard" name="image" type="file" min="0" className="mx-5" onChange={handleFileChange} accept="image/jpg" />
                <br />
                {t('commons.delete-photo')}: <Checkbox name="delete" onChange={(e) => {setFileUploadDisabled(e.target.checked); }} />
                <br />
                <Button variant="outlined" type="submit">
                    {t('commons.save')}
                </Button>
            </form>
        </Dialog>
    )
}

export default EditorSettings