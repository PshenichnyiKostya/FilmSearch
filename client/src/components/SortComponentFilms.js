import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export default function SortComponentFilms({parentCallback, filter}) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const handleChange = (event) => {
        event.preventDefault()
        parentCallback(event.target.value)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <div>
            {/*<Button className={classes.button} onClick={handleOpen}>*/}
            {/*    Сортировать по:*/}
            {/*</Button>*/}
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-controlled-open-select-label">Фильтр</InputLabel>
                <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={filter}
                    onChange={handleChange}
                >
                    <MenuItem value="">
                        <em>-</em>
                    </MenuItem>
                    <MenuItem value='rating'>По рейтингу</MenuItem>
                    <MenuItem value='name'>По имени</MenuItem>
                    <MenuItem value='date'>По дате</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}
