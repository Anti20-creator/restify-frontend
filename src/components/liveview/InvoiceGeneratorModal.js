import React, { useEffect, useState } from 'react';
import API from '../../communication/API';
import InvoiceItemSelector from './InvoiceItemSelector';
import { Button, DialogActions, DialogContent, DialogTitle, Typography, TextField } from '@material-ui/core';
import Dialog from '@mui/material/Dialog';
import { getSocket } from '../../communication/socket'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setInvoiceViewOpen } from '../../store/features/temporarySlice'
import './InvoiceGeneratorModal.css'

function InvoiceGeneratorModal({tableId, tableLocalId, open, handleClose, items}) {

    const navigate = useNavigate()
    const [invoiceProcess, setInvoiceProcess] = useState(null)
    const [invoiceName, setInvoiceName] = useState(null)
    const [itemsLeft, setItemsLeft] = useState(items)
    const [itemsToPay, setItemsToPay] = useState([])
    const dispatch = useDispatch()

    const getInvoice = async() => {
      console.log('invoice')
      console.log(invoiceProcess)
      if(invoiceProcess === 'together') {
        const {data} = await API.get(`/api/tables/${tableId}`)
        setInvoiceName(data.message)
      }/*else if(invoiceProcess === 'split-equal') {
        const {data} = await API.post(`/api/tables/${tableId}/split-equal`, {peopleCount: 2})
        console.log(data)
        setInvoiceName(data.message)
      }*/
    }

    const getSplittedInvoice = () => {
      API.post(`/api/tables/${tableId}/split`, {items: itemsToPay}).then(({data}) => {
        if(data.success) {
          setInvoiceName(data.message)
          //dispatch(setItems(itemsLeft))
          setItemsToPay([])
        }
      })
    }

    const getSplittedEqualInvoice = async(e) => {
      e.preventDefault()

      const {data} = await API.post(`/api/tables/${tableId}/split-equal`, {peopleCount: Number(e.target.elements.peopleCount.value)})
      setInvoiceName(data.message)
    }

    const download = async() => {
      if(!invoiceName) return

      window.open('https://192.168.31.214:4000/api/invoices/download/' + invoiceName)
      getSocket().emit('guest-leaved', {tableId})
      handleClose()
      if(invoiceProcess !== 'split' || (invoiceProcess === 'split' && itemsLeft.length === 0)) {
        navigate('../..')
      }
      setInvoiceName(null)
      setInvoiceProcess(null)
    }

    useEffect(() => {
      if(invoiceProcess && invoiceProcess !== 'split') {
        getInvoice()
      }
    }, [invoiceProcess])

    const closeDialog = () => {
      setInvoiceName(null)
      setInvoiceProcess(null)
      dispatch(setInvoiceViewOpen(false))
      handleClose()
    }

    useEffect(() => {
      setItemsLeft(items)
    }, [items])
    
    return (
        <Dialog maxWidth={'1000'} onClose={closeDialog} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={closeDialog}>
          Számla - {useParams().id}
        </DialogTitle>
        <DialogContent dividers className='invoice-dialog-content'>
          {
            !invoiceProcess &&
            <>
              <Button onClick={() => setInvoiceProcess('together') } variant="outlined" className="mx-1">
                Fizetés egyben
              </Button>
              <Button onClick={() => setInvoiceProcess('split-equal') } variant="outlined" className="mx-1">
                Fizetés arányosan
              </Button>
              <Button onClick={() => setInvoiceProcess('split')} variant="outlined" className="mx-1">
                Részfizetés
              </Button>
            </>
          }
          {
            invoiceProcess === 'together' &&
              (!invoiceName ?
              <Typography gutterBottom>
                Számla generálása folyamatban...
              </Typography>
              :
              <Typography gutterBottom>
                Számla nyomtatásra kész
              </Typography>)
          }
          {invoiceProcess === 'split-equal' && 
              (
                !invoiceName ? 
                  <form className="text-center" onSubmit={getSplittedEqualInvoice}>
                    <TextField name="peopleCount" type="number" />
                    <br />
                    <Button variant="outlined" color="primary" type="submit">Küldés</Button>
                  </form>
                :
                  <Typography gutterBottom>
                    Számla előállítva
                  </Typography>

              )}
            {invoiceProcess === 'split' &&
              <>
                <InvoiceItemSelector itemsLeft={itemsLeft} itemsToPay={itemsToPay} setItemsLeft={setItemsLeft} setItemsToPay={setItemsToPay} />
                <div className="text-center">
                  <Button disabled={itemsToPay.length === 0} onClick={() => getSplittedInvoice()}>
                    Számla előállítása
                  </Button>
                </div>
              </>
              }
        </DialogContent>
        <DialogActions>
          <Button disabled={!invoiceName} autoFocus onClick={download} color="primary">
            Számla mentése
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default InvoiceGeneratorModal;
