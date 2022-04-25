import React, { useEffect, useState } from 'react';
import API from '../../communication/API';
import InvoiceItemSelector from './InvoiceItemSelector';
import { Button, DialogActions, DialogContent, DialogTitle, Typography, TextField } from '@material-ui/core';
import Dialog from '@mui/material/Dialog';
import { getSocket } from '../../communication/socket'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { setInvoiceViewOpen } from '../../store/features/temporarySlice'
import { useTranslation } from 'react-i18next'
import './InvoiceGeneratorModal.css'

function InvoiceGeneratorModal({tableId, open, handleClose, items}) {

    const navigate = useNavigate()
    const [invoiceProcess, setInvoiceProcess] = useState(null)
    const [invoiceName, setInvoiceName] = useState(null)
    const [itemsLeft, setItemsLeft] = useState(items)
    const [itemsToPay, setItemsToPay] = useState([])
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()

    const getInvoice = async() => {
      if(invoiceProcess === 'together') {
        const {data} = await API.post(`/api/tables/${tableId}`, {lang: i18n.language})
          .catch(err => {
            toast.error(t('api.invoice-generating-error'))
            handleClose()
          })
        setInvoiceName(data.message)
      }
    }

    const getSplittedInvoice = () => {
      API.post(`/api/tables/${tableId}/split`, {items: itemsToPay, lang: i18n.language}).then(({data}) => {
        setInvoiceName(data.message)
        setItemsToPay([])
      }).catch(err => {
        toast.error(t('api.invoice-generating-error'))
        handleClose()
      })
    }

    const getSplittedEqualInvoice = async(e) => {
      e.preventDefault()

      const peopleCount = Number(e.target.elements.peopleCount.value)
      if(peopleCount < 1) {
        toast.error(t('api.too-few-people'))
        return
      }

      const {data} = await API.post(`/api/tables/${tableId}/split-equal`, {peopleCount: peopleCount, lang: i18n.language})
        .catch(err => {
          toast.error(t('api.invoice-generating-error'))
          handleClose()
        })
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
          {t('commons.invoice')} {/* - {useParams().id} */}
        </DialogTitle>
        <DialogContent dividers className='invoice-dialog-content'>
          {
            !invoiceProcess &&
            <>
              <Button onClick={() => setInvoiceProcess('together') } variant="outlined" className="mx-1">
                {t('commons.pay-all')}
              </Button>
              <Button onClick={() => setInvoiceProcess('split-equal') } variant="outlined" className="mx-1">
                {t('commons.pay-equal')}
              </Button>
              <Button onClick={() => setInvoiceProcess('split')} variant="outlined" className="mx-1">
                {t('commons.pay-splitted')}
              </Button>
            </>
          }
          {
            invoiceProcess === 'together' &&
              (!invoiceName ?
              <Typography gutterBottom>
                {t('commons.invoice-generating-progress')}
              </Typography>
              :
              <Typography gutterBottom>
                {t('commons.invoice-ready')}
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
                    {t('commons.invoice-ready')}
                  </Typography>

              )}
            {invoiceProcess === 'split' &&
              <>
                <InvoiceItemSelector itemsLeft={itemsLeft} itemsToPay={itemsToPay} setItemsLeft={setItemsLeft} setItemsToPay={setItemsToPay} />
                <div className="text-center">
                  <Button disabled={itemsToPay.length === 0} onClick={() => getSplittedInvoice()}>
                    {t('commons.generate-invoice')}
                  </Button>
                </div>
              </>
              }
        </DialogContent>
        <DialogActions>
          <Button disabled={!invoiceName} autoFocus onClick={download} color="primary">
            {t('commons.save-invoice')}
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default InvoiceGeneratorModal;
