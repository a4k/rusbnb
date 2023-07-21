import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/system';
import { places } from './CitiesData';
import { useNavigate, useLocation } from "react-router-dom";

const SearchButton = styled(Button)({
    backgroundColor: '#79747E', height: '3.5em', width: '15%', borderRadius: '100px', color: 'white', display: 'flex',
    padding: '0 1em',
        justifyContent: 'space-around', ":hover":{
            backgroundColor: '#5F5C63'
        }
}),
MainBox = styled(Box)({
    display: 'flex', flexDirection: 'row', backgroundColor: '#D9D9D9', width: '85vw', margin: '0 auto', marginTop: '2vh',
    borderRadius: '50px', 
    justifyContent: 'space-between', padding: '0 2em', alignItems: 'center', minHeight: '60px',
    paddingRight: '1em'
});

export default function SearchBlock(){
    const [countPeople, setCountPeople] = React.useState('');
    const handleChangeCountPeople = (event: SelectChangeEvent) => {
        setCountPeople(event.target.value);
    };
    const [dateArrival, setDateArrival] = React.useState<Dayjs | null>(null);
    const [dateDeparture, setDateDeparture] = React.useState<Dayjs | null>(null);
    const [place, setPlace] = React.useState('');
    const [showErrors, setShowErrors] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = ()=>{
        setShowErrors(true);
        if(!place || !dateArrival || !dateDeparture) return;
        if(dateDeparture.diff(dateArrival, 'day') <= 0) return
        if(dateArrival.diff(dayjs(), 'day') < 0 ) return
        const navState : any = location.state || {};
        navState.place = place;
        navState.dateArrival = dateArrival;
        navState.dateDeparture = dateDeparture;
        navigate('/search', {state: navState});
    }

    const disableArriveDates = (date : Dayjs) : boolean =>{
        return date.diff(dayjs(), 'day') < 0;
    };

    const disableDepartureDates = (date : Dayjs) : boolean =>{
        return date.diff(dateArrival || dayjs().add(-1, 'day'), 'day') <= 0;
    };


    return (
        <MainBox>
            
            <Autocomplete
                onChange={(e, v)=>{setPlace(String(v))}}
                disablePortal
                id="combo-box-demo"
                options={places}
                sx={{ width: '15%', height: '3em', minWidth: '50px' }}
                renderInput={(params) => <TextField {...params} label="Куда" variant='filled'
                error={place==''&&showErrors}
                sx={{ width: '100%', height: '100%'}} size="small"/>}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']} sx={{width: '15%', height: '4em', overflow: 'hidden', minWidth: '50px'}}>
                    <DatePicker value={dateArrival} onChange={(newValue) => {setDateArrival(newValue);}} 
                        label="Прибытие"
                        slotProps={{ textField: { size: 'small', variant: 'filled',
                        error: (dateArrival?(dateArrival.diff(dayjs(), 'day') < 0):showErrors)}}} sx={{width: '100%'}}
                        shouldDisableDate={disableArriveDates}/>
                </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']} sx={{width: '15%', height: '4em', overflow: 'hidden', minWidth: '50px'}}>
                    <DatePicker value={dateDeparture} onChange={(newValue) => {setDateDeparture(newValue);}}
                        label="Выезд"
                        slotProps={{ textField: { size: 'small', variant: 'filled',
                        error: (dateDeparture?(dateDeparture.diff(dateArrival, 'day') <= 0):showErrors)}}}
                        shouldDisableDate={disableDepartureDates}/>
                </DemoContainer>
            </LocalizationProvider>

            <FormControl sx={{ width: '15%', height: '3em'}}  variant="filled" size="small">
            <InputLabel id="demo-simple-select-autowidth-label">Кто едет</InputLabel>
            <Select sx={{height: '100%'}}
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={countPeople}
            onChange={handleChangeCountPeople}
            autoWidth
            label="CountPeople"
            >
            {
                [1,2,3,4,5,6,7,8,9,10].map((it) => (
                    <MenuItem value={it} key={it}>{it} гост{it==1?'ь':(it%10==2 ||it%10==3 || it%10==4 ? "я" : "ей")}</MenuItem>
                ))
            }
            </Select>
            </FormControl>

            <SearchButton variant="text" onClick={handleSearch}>
                <span style={{width: '15%', aspectRatio: 1, background: '#D9D9D9'}}></span>Искать</SearchButton>
        </MainBox>
    );
}
