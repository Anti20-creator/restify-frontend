import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import API from '../../communication/API';
import { getSocket } from '../../communication/socket';
import { invoiceItems, setItems } from '../../store/features/invoiceSlice';
import InvoiceGeneratorModal from './InvoiceGeneratorModal';

function Invoice({tableId, localId}) {

    const dispatch = useDispatch()
    const currentInvoiceItems = useSelector(invoiceItems)
    const [startPayment, setStartPayment] = useState(false)

    const deleteOrder = (rowName) => {
        API.delete('api/tables/remove-order', { data: {tableId, name: rowName} })
    }

    useEffect(() => {
        API.get('/api/tables/orders/' + tableId).then(result => {
            dispatch(setItems(result.data.message))
        })
    }, [])

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
                            <TableCell align="right">Mennyiség</TableCell>
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
                            <TableCell align="right">{row.quantity}</TableCell>
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
