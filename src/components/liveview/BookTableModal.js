import React from 'react'
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import Dialog from '@mui/material/Dialog';
import { t } from 'i18next'

function BookTableModal({open, onClose, bookTable}) {
  return (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle id="alert-dialog-title">{t('commons.table-not-booked')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('commons.want-to-book')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { bookTable(); onClose() }} color="primary">
            {t('commons.ok')}
          </Button>
          <Button onClick={onClose} color="primary">
            {t('commons.cancel')}
          </Button>
        </DialogActions>
    </Dialog>
  )
}

export default BookTableModal;
