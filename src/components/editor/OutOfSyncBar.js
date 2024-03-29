import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch } from 'react-redux';
import { refreshLayout, refreshLayoutSize } from '../../store/features/layoutSlice';
import { t } from 'i18next';

function OutOfSyncBar({open, setOpen}) {

    const dispatch = useDispatch()

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    const update = () => {
        dispatch(refreshLayout())
        dispatch(refreshLayoutSize())
        setOpen(false)
    }

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={t('commons.layout-changed')}
                action={
                <React.Fragment>
                    <Button color="secondary" size="small" onClick={update}>
                        {t('commons.update')}
                    </Button>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
                }
            />
        </div>
    );
}

export default OutOfSyncBar