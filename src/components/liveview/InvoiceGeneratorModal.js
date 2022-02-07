import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import API from '../../communication/API';
import { setItems } from '../../store/features/invoiceSlice';
import { useDispatch } from 'react-redux'
import { getSocket } from '../../communication/socket'

function InvoiceGeneratorModal({tableId, tableLocalId, open, handleClose}) {
    
    const dispatch = useDispatch()
    const [invoiceName, setInvoiceName] = useState('')
    const getInvoice = () => {
        API.get(`/api/tables/${tableId}`).then(result => {
          setInvoiceName(result.data.message)
        })
    }

    const download = () => {
      if(!invoiceName) return

      const link = document.createElement("a");
      link.download = 'https://192.168.31.216:4000/public/invoices/' + invoiceName;
      link.href = 'https://192.168.31.216:4000/public/invoices/' + invoiceName;
      link.click();
      getSocket().emit('guest-leaved', {tableId})
      handleClose()
    }

    useEffect(() => {
      if(open) {
        setInvoiceName('')
        getInvoice()
      }
    }, [open])
    
    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Számla - {tableLocalId}
        </DialogTitle>
        <DialogContent dividers>
          {
            invoiceName === '' ?
            <Typography gutterBottom>
              Számla generálása folyamatban...
            </Typography>
            :
            <Typography gutterBottom>
              Számla nyomtatásra kész
            </Typography>
          }
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={download} color="primary">
            Számla mentése
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default InvoiceGeneratorModal;
