import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'

function BookTableModal({open, onClose, bookTable}) {
  return (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle id="alert-dialog-title">{"Ez az asztal jelenleg nincs lefoglalva."}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Szeretné lefoglalni?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { bookTable(); onClose() }} color="primary">
            Ok
          </Button>
          <Button onClick={onClose} color="primary">
            Mégsem
          </Button>
        </DialogActions>
    </Dialog>
  )
}

export default BookTableModal;
