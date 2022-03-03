import React, { useEffect, useState } from 'react';
import API from '../../communication/API';
import InvoiceItemSelector from './InvoiceItemSelector';
import { useDispatch } from 'react-redux'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import { getSocket } from '../../communication/socket'
import { useParams, useNavigate } from 'react-router-dom'
import { setItems } from '../../store/features/invoiceSlice';

function InvoiceGeneratorModal({tableId, tableLocalId, open, handleClose, items}) {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [invoiceProcess, setInvoiceProcess] = useState(null)
    const [invoiceName, setInvoiceName] = useState(null)
    const [itemsLeft, setItemsLeft] = useState(items)
    const [itemsToPay, setItemsToPay] = useState([])

    const getInvoice = async() => {
      console.log('invoice')
      console.log(invoiceProcess)
      if(invoiceProcess === 'together') {
        const {data} = await API.get(`/api/tables/${tableId}`)
        setInvoiceName(data.message)
      }else if(invoiceProcess === 'split-equal') {
        const {data} = await API.post(`/api/tables/${tableId}/split-equal`, {peopleCount: 2})
        console.log(data)
        setInvoiceName(data.message)
      }
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

    const download = async() => {
      if(!invoiceName) return

      /*const link = document.createElement("a");
      link.download = 'https://192.168.31.161:4000/public/invoices/' + invoiceName;
      link.href = 'https://192.168.31.161:4000/public/invoices/' + invoiceName;
      link.click();*/
      window.open('https://192.168.31.161:4000/api/invoices/download/' + invoiceName)
      getSocket().emit('guest-leaved', {tableId})
      handleClose()
      if(invoiceProcess !== 'split' || (invoiceProcess === 'split' && itemsLeft.length === 0)) {
        navigate('../..')
      }
      setInvoiceName(null)
    }

    useEffect(() => {
      if(invoiceProcess && invoiceProcess !== 'split') {
        getInvoice()
      }
    }, [invoiceProcess])

    useEffect(() => {
      setItemsLeft(items)
    }, [items])
    
    return (
        <Dialog maxWidth={1000} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Számla - {useParams().id}
        </DialogTitle>
        <DialogContent dividers>
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
                <Typography gutterBottom>
                  Számla generálása folyamatban...
                </Typography>
                :
                <Typography gutterBottom>
                  Számla nyomtatásra kész
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
