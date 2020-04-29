import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialogUpdateComponent({open, toClose, dialogDescription, dialogTitle, confirmDialog, thirdButton, acceptText, cancelText, noConfirmDialog}) {


    const handleClose = () => {
        toClose()
    }

    const handleConfirm = () => {
        toClose()
        confirmDialog()
    }

    const handleNoConfirm = () => {
        toClose()
        noConfirmDialog()
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
                    {thirdButton ?
                        <Button variant="outlined" onClick={handleClose} color="secondary" className='hover-button'>
                            {thirdButton}
                        </Button> : null}
                    <Button variant="outlined" onClick={handleNoConfirm} color="secondary" className='hover-button'>
                        {cancelText}
                    </Button>
                    <Button variant="outlined" onClick={handleConfirm} color="secondary" className='hover-button'>
                        {acceptText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
