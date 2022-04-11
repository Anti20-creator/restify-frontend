import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, List, ListItem } from '@material-ui/core';
import { Add, Delete, Remove } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import API from '../../communication/API';
import { getSocket } from '../../communication/socket';
import { isTableInUse } from '../../store/features/liveSlice'
import { getCurrency} from '../../store/features/temporarySlice'
import { addOne, invoiceItems, removeAll, removeOne, setItems } from '../../store/features/invoiceSlice';
import InvoiceGeneratorModal from './InvoiceGeneratorModal';
import useWindowSize from '../../store/useWindowSize'
import { useParams, useNavigate } from 'react-router-dom'

function Invoice({localId, showLabel=true}) {

    const tableId = useParams().id
    const tableInUse = useSelector(isTableInUse(tableId))

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const currentInvoiceItems = useSelector(invoiceItems)
    const [startPayment, setStartPayment] = useState(false)
    const currency = useSelector(getCurrency)
    const { width } = useWindowSize()

    useEffect(() => {
        if(!tableInUse && !startPayment) {
            getSocket().emit('leave-table', {tableId: tableId}); 
            navigate('../..')
        }
    }, [tableInUse])

    const deleteOrder = (rowName) => {
        API.delete('api/tables/remove-order', { data: {tableId, name: rowName, socketId: getSocket().id} }).then((response) => {
            dispatch(removeAll({name: rowName}))
        }).catch(err => {
            toast.error('Hiba a rendelés törlésekor!', {
                autoClose: 1500
            })
        })
    }

    const increaseQuantity = (rowName) => {
        API.post('api/tables/increase-order', {tableId, socketId: getSocket().id, name: rowName}).then(response => {
            dispatch(addOne({name: rowName}))
        }).catch(err => {
            toast.error('Hiba a kérés közben!', {
                autoClose: 1500
            })
        })
    }

    const decreaseQuantity = (rowName) => {
        API.post('api/tables/decrease-order', {tableId, socketId: getSocket().id, name: rowName}).then(response => {
            dispatch(removeOne({name: rowName}))
    }).catch(err => {
        toast.error('Hiba a kérés közben!', {
            autoClose: 1500
        })
    })
}

    useEffect(() => {
        API.get('/api/tables/orders/' + tableId).then(result => {
            dispatch(setItems(result.data.message))
        }).catch(err => {
            toast.error('Hiba a kérés közben!', {
                autoClose: 1500
            })
        })
    }, [tableId]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        getSocket().emit('join-table', {tableId})
    }, [tableId])

    return (
        <>
            {showLabel && <h2 className="text-center pt-2">Számla</h2>}
            {width > 8768 && <TableContainer>
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Név</TableCell>
                            <TableCell align="center">Mennyiség</TableCell>
                            <TableCell align="right">Ár</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {currentInvoiceItems.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                <IconButton className="invoice-remove-button" onClick={() => deleteOrder(row.name)}>
                                    <Delete />
                                </IconButton>
                                {row.name}
                            </TableCell>
                            <TableCell className="invoice-quantity" align="center" style={{whiteSpace: 'nowrap'}}>
                                <IconButton className="invoice-minus-button" onClick={() => decreaseQuantity(row.name)}>
                                    <Remove />
                                </IconButton>
                                {row.quantity}
                                <IconButton className="invoice-plus-button" onClick={() => increaseQuantity(row.name)}>
                                    <Add />
                                </IconButton>
                            </TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>}
            {width <= 8768 && <List>
                {
                    currentInvoiceItems.map(row => (
                        <div key={row.name}>
                            <ListItem className='text-center' style={{display: 'block'}}>
                                <div>
                                    <p className="m-0">{row.name}</p>
                                    <p style={{color: "#808080"}}>{row.price} {currency}</p>
                                </div>
                                <div className="d-flex align-items-center justify-content-center position-relative">
                                    <IconButton style={{left: 0}} className="invoice-remove-button position-absolute" onClick={() => deleteOrder(row.name)}>
                                        <Delete />
                                    </IconButton>
                                    <IconButton className="invoice-minus-button" onClick={() => decreaseQuantity(row.name)}>
                                        <Remove />
                                    </IconButton>
                                    {row.quantity}
                                    <IconButton className="invoice-plus-button" onClick={() => increaseQuantity(row.name)}>
                                        <Add />
                                    </IconButton>
                                </div>
                            </ListItem>
                            <hr />
                        </div>
                    ))
                }
            </List>}
            <div style={{padding: (width > 768) ? '0' : '1rem 0rem'}} className="pay-button-holder text-center">
                <Button color="primary" variant="outlined" onClick={() => setStartPayment(true)}>
                    Fizetés
                </Button>
            </div>
            <InvoiceGeneratorModal tableId={tableId} items={currentInvoiceItems} tableLocalId={localId} open={startPayment} handleClose={() => {
                setStartPayment(false)
                //dispatch(setItems([]))
            }} />
        </>
    )
}

export default Invoice;
