import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import Dialog from '@mui/material/Dialog';
import { Close, SearchOutlined } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSocket } from '../../communication/socket';
import API from '../../communication/API';
import Invoice from './Invoice';
import MenuItems from './MenuItems';
import { invoiceItems } from '../../store/features/invoiceSlice';
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { isTableInUse } from '../../store/features/liveSlice';

function TableDialog() {

    const navigate = useNavigate()
    const tableId = useParams().id
    const currentInvoiceItems = useSelector(invoiceItems)
    const isInUse = useSelector(isTableInUse(tableId))
    const [foodText, setFoodText] = useState('')

    const cancelTable = () => {
        if(currentInvoiceItems.length > 0) {
            toast.error('Ez az asztal jelenleg nem mondható le!', {
                autoClose: 1500
            })
        }else{
            API.post('/api/tables/free-table', {tableId}).then(result => {
                if(result.data.success) {
                    getSocket().emit('leave-table', {tableId: tableId}); 
                    navigate('../../')
                }else{
                    toast.error('Ez az asztal jelenleg nem mondható le!', {
                        autoClose: 1500
                    })
                }
            })
        }
    }

    return (
        <Dialog fullScreen open={true} onClose={() => { getSocket().emit('leave-table', {tableId: tableId}); navigate('../../') }}>
            <AppBar style={{position: 'relative'}}>
                {console.log(useParams())}
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => { getSocket().emit('leave-table', {tableId: tableId}); navigate('../../') }} aria-label="close">
                        <Close />
                    </IconButton>
                    <Typography variant="h6">
                        Asztal #{tableId}
                    </Typography>
                    <Button color="inherit" onClick={() => { getSocket().emit('leave-table', {tableId: tableId}); navigate('../../') }}>
                        Bezárás
                    </Button>
                    <Button color="inherit" onClick={() => cancelTable()}>
                        Asztal lemondása
                    </Button>
                </Toolbar>
            </AppBar>
            
            <div className="col-12 d-flex table-view">
                <div className="col-8 items text-center">
                    <div className="searchbox">
                        <div className="d-flex align-items-center flex-grow-1">
                            <SearchOutlined />
                            <input onInput={(e) => {setFoodText(e.target.value)}} type="text" className="search-input w-100" placeholder="Ételek keresése" />
                        </div>
                    </div>
                    <div className="col-12 items-holder">
                        <div className="row mx-auto">
                            <MenuItems searchText={foodText} />
                        </div>
                    </div>
                </div>
                <div className="col-4 checkout">
                    <Invoice />
                </div>
            </div>
        </Dialog>
    )
}

export default TableDialog;
