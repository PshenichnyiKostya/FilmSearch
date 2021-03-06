import React, {useState} from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {useHttp} from "../hooks/http.hook";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

// function sleep(delay = 0) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, delay);
//     });
// }

const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;

const ArtistsAutocompleteComponent = ({callback,artists}) => {

    const [options, setOptions] = useState([])
    const {request} = useHttp()
    const [open, setOpen] = useState(false);
    const loading = open && options.length === 0;

    React.useEffect(() => {
        if (!loading) {
            return undefined;
        }

        (async () => {
            try {
                const data = await request('/api/artists/all', 'GET')
                // await sleep(1e3); // For demo purposes.
                setOptions(data.artists)
            } catch (e) {

            }
        })();

    }, [loading, request]);

    const handleArtists = (value) => {
        callback(value)
    }

    return (
        <Autocomplete
            multiple
            options={options}
            value={artists}
            onChange={(event, value) => handleArtists(value)}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            getOptionSelected={(option, value) => option._id === value._id}
            disableCloseOnSelect
            noOptionsText='Нет актеров'
            loading={loading}
            loadingText='Загрузка...'
            onClose={() => {
                setOpen(false);
            }}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Выберите актеров"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
            renderOption={(option, {selected}) => (
                <React.Fragment>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        checked={selected}
                    />
                    {option.name}
                </React.Fragment>
            )}
        />
    )
}

export default ArtistsAutocompleteComponent