import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Add, Delete, Remove } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import API from '../../communication/API';
import { getSocket } from '../../communication/socket';
import { addOne, invoiceItems, removeAll, removeOne, setItems } from '../../store/features/invoiceSlice';
import InvoiceGeneratorModal from './InvoiceGeneratorModal';
import { useParams } from 'react-router-dom'

function Invoice({localId}) {

    const tableId = useParams().id

    const dispatch = useDispatch()
    const currentInvoiceItems = useSelector(invoiceItems)
    const [startPayment, setStartPayment] = useState(false)

    const deleteOrder = (rowName) => {
        API.delete('api/tables/remove-order', { data: {tableId, name: rowName, socketId: getSocket().id} }).then((response) => {
            if (response.data.success) {
                dispatch(removeAll({name: rowName}))
            }else{
                toast.error('Hiba a rendelés törlésekor!', {
                    autoClose: 1500
                })
            }
        })
    }

    const increaseQuantity = (rowName) => {
        API.post('api/tables/increase-order', {tableId, socketId: getSocket().id, name: rowName}).then(response => {
            if(response.data.success) {
                dispatch(addOne({name: rowName}))
            }else{
                toast.error('Hiba a kérés közben!', {
                    autoClose: 1500
                })
            }
        })
    }

    const decreaseQuantity = (rowName) => {
        API.post('api/tables/decrease-order', {tableId, socketId: getSocket().id, name: rowName}).then(response => {
            if(response.data.success) {
                dispatch(removeOne({name: rowName}))
            }else{
                toast.error('Hiba a kérés közben!', {
                    autoClose: 1500
                })
            }
        })
    }

    useEffect(() => {
        API.get('/api/tables/orders/' + tableId).then(result => {
            dispatch(setItems(result.data.message))
        })
    }, [tableId]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        getSocket().emit('join-table', {tableId})
    }, [tableId])

    return (
        <>
            <h2 className="text-center pt-2">Számla</h2>
            <TableContainer>
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Név</TableCell>
                            <TableCell align="center">Mennyiség</TableCell>
                            <TableCell align="right">Ár</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {console.log(currentInvoiceItems)}
                    {currentInvoiceItems.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                <IconButton onClick={() => deleteOrder(row.name)}>
                                    <Delete />
                                </IconButton>
                                {row.name}
                            </TableCell>
                            <TableCell align="center" style={{whiteSpace: 'nowrap'}}>
                                <IconButton onClick={() => decreaseQuantity(row.name)}>
                                    <Remove />
                                </IconButton>
                                {row.quantity}
                                <IconButton onClick={() => increaseQuantity(row.name)}>
                                    <Add />
                                </IconButton>
                            </TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="pay-button-holder text-center">
                <Button color="primary" variant="outlined" onClick={() => setStartPayment(true)}>
                    Fizetés
                </Button>
            </div>
            <InvoiceGeneratorModal tableId={tableId} tableLocalId={localId} open={startPayment} handleClose={() => {
                setStartPayment(false)
                //dispatch(setItems([]))
                }} />
        </>
    )
}

export default Invoice;
