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
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import InvoiceGeneratorModal from './InvoiceGeneratorModal';
import useWindowSize from '../../store/useWindowSize'

function Invoice({showLabel=true}) {

    const tableId = useParams().id
    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const tableInUse = useSelector(isTableInUse(tableId))
    const currentInvoiceItems = useSelector(invoiceItems)
    const currency = useSelector(getCurrency)
    const [startPayment, setStartPayment] = useState(false)

    useEffect(() => {
        if(!tableInUse && !startPayment) {
            getSocket().emit('leave-table', {tableId: tableId}); 
            navigate('../..')
        }
    }, [tableInUse])

    useEffect(() => {
        API.get('/api/tables/orders/' + tableId).then(result => {
            dispatch(setItems(result.data.message))
        }).catch(err => {
            toast.error(t(`api.${err.response.data.message}`), {
                autoClose: 1500
            })
        })
    }, [tableId]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        getSocket().emit('join-table', {tableId})
    }, [tableId])

    const deleteOrder = (rowName) => {
        API.delete('api/tables/remove-order', { data: {tableId, name: rowName, socketId: getSocket().id} }).then((response) => {
            dispatch(removeAll({name: rowName}))
        }).catch(err => {
            toast.error(t(`api.${err.response.data.message}`), {
                autoClose: 1500
            })
        })
    }

    const increaseQuantity = (rowName) => {
        API.post('api/tables/increase-order', {tableId, socketId: getSocket().id, name: rowName}).then(response => {
            dispatch(addOne({name: rowName}))
        }).catch(err => {
            toast.error(t(`api.${err.response.data.message}`), {
                autoClose: 1500
            })
        })
    }

    const decreaseQuantity = (rowName) => {
        API.post('api/tables/decrease-order', {tableId, socketId: getSocket().id, name: rowName}).then(response => {
            dispatch(removeOne({name: rowName}))
        }).catch(err => {
            toast.error(t(`api.${err.response.data.message}`), {
                autoClose: 1500
            })
        })
    }

    return (
        <>
            {showLabel && <h2 className="text-center pt-2">{t('commons.invoice')}</h2>}
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
                    {t('commons.pay')}
                </Button>
            </div>
            <InvoiceGeneratorModal tableId={tableId} items={currentInvoiceItems} open={startPayment} handleClose={() => {
                setStartPayment(false)
            }} />
        </>
    )
}

export default Invoice;
