import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialogComponent({open, toClose, dialogDescription, dialogTitle, confirmDialog}) {


    const handleClose = () => {
        toClose()
    }

    const handleConfirm = () => {
        toClose()
        confirmDialog()
    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogDescription}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose} color="secondary" className='hover-button'>
                        Нет
                    </Button>
                    <Button variant="outlined" onClick={handleConfirm} color="secondary" className='hover-button'>
                        Да
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
