import React, { useState } from 'react'
import API from '../../communication/API'
import Dialog from '@mui/material/Dialog';
import { TextField, Button, Checkbox } from '@mui/material';
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux';
import { updateSize } from '../../store/features/layoutSlice';

function EditorSettings({close, initialX, initialY}) {

    const dispatch = useDispatch()
    const [file, setFile] = useState(null)
    const [fileUploadDisabled, setFileUploadDisabled] = useState(false)

    const handleFileChange = (e) => {
        console.log(e.target.files[0])
        setFile(e.target.files[0])
    }

    const save = (e) => {
        e.preventDefault()

        const sizeX = e.target.elements.sizeX.value
        const sizeY = e.target.elements.sizeY.value

        const formData = new FormData()
        formData.append("image", file)
        formData.append("sizeX", Number(sizeX))
        formData.append("sizeY", Number(sizeY))
        formData.append("sentImage", file !== null)
        formData.append("deleteImage", e.target.elements.delete)
        formData.append("extName", file ? file.name.split('.').pop() : null)

        console.log(formData)

        const loadingToast = toast.loading('Beállítások frissítése...', {position: "bottom-center"})
        API.post('/api/layouts/update', formData).then(response => {
            dispatch(updateSize({sizeX: Number(sizeX), sizeY: Number(sizeY)}))
            toast.update(loadingToast, {render: 'Beállítások frissítve!', autoClose: 1200, isLoading: false, type: "success"})
            close()
        }).catch(err => {
            toast.update(loadingToast, {render: 'Hiba a frissítés során!', autoClose: 1200, isLoading: false, type: "error"})
        })

    }
    
    return (
        <Dialog open={true} onClose={close} className="text-center">
            <form onSubmit={(e) => save(e)} className="p-3">
                <TextField defaultValue={initialX} variant="standard" name="sizeX" type="number" min="0" placeholder='Szélesség' />
                <br />
                <TextField defaultValue={initialY} variant="standard" name="sizeY" type="number" min="0" placeholder='Magasság' />
                <br />
                <TextField disabled={fileUploadDisabled} variant="standard" name="image" type="file" min="0" className="mx-5" onChange={handleFileChange} accept="image/jpg" />
                <br />
                <Checkbox name="delete" onChange={(e) => {setFileUploadDisabled(e.target.checked); }} />
                <br />
                <Button variant="outlined" type="submit">
                    Mentés
                </Button>
            </form>
        </Dialog>
    )
}

export default EditorSettings