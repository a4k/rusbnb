import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import {Typography} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/system';
import { places } from './CitiesData';
import { useNavigate, useLocation } from "react-router-dom";
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Popup, {PopupItem} from './Popup';

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

/**
 * Блок поиска
 */
export default function SearchBlock(){
    const [dateArrival, setDateArrival] = React.useState<Dayjs | null>(null);
    const [dateDeparture, setDateDeparture] = React.useState<Dayjs | null>(null);
    const [place, setPlace] = React.useState('');
    const [showErrors, setShowErrors] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [adults, setAdults] = React.useState(0);
    const [children, setChildren] = React.useState(0);

    /**
     * Проверяет введённые данные на корректность.
     * Применяет значения для поиска,
     * переадресовывает на главную страницу
     */
    const handleSearch = ()=>{
        setShowErrors(true);
        if(!place || !dateArrival || !dateDeparture) return;
        if(dateDeparture.diff(dateArrival, 'day') <= 0) return
        if(dateArrival.diff(dayjs(), 'day') < 0 ) return
        if(adults + children == 0) return
        const navState : any = location.state || {};
        navState.place = place;
        navState.dateArrival = dateArrival;
        navState.dateDeparture = dateDeparture;
        navigate('/search', {state: navState});
    }

    /**
     * Выключает даты для начальной даты
     * @param date дата
     * @returns выключать дату или нет
     */
    const disableArriveDates = (date : Dayjs) : boolean =>{
        return date.diff(dayjs(), 'day') < 0;
    };

    /**
     * Выключает даты для конечной даты
     * @param date дата
     * @returns выключать дату или нет
     */
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
                error={(place==''||place==String(null))&&showErrors}
                sx={{ width: '100%', height: '100%'}} size="small"/>}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDatePicker']} sx={{width: '15%', height: '4em', overflow: 'hidden', minWidth: '50px'}}>
                    <MobileDatePicker value={dateArrival} onChange={(newValue) => {setDateArrival(newValue);}} 
                        label="Прибытие"
                        slotProps={{ textField: { size: 'small', variant: 'filled',
                        error: (dateArrival?(dateArrival.diff(dayjs(), 'day') < 0):showErrors)}}} sx={{width: '100%'}}
                        shouldDisableDate={disableArriveDates}/>
                </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDatePicker']} sx={{width: '15%', height: '4em', overflow: 'hidden', minWidth: '50px'}}>
                    <MobileDatePicker value={dateDeparture} onChange={(newValue) => {setDateDeparture(newValue);}}
                        label="Выезд"
                        slotProps={{ textField: { size: 'small', variant: 'filled',
                        error: (dateDeparture?(dateDeparture.diff(dateArrival, 'day') <= 0):showErrors)}}}
                        shouldDisableDate={disableDepartureDates}/>
                </DemoContainer>
            </LocalizationProvider>

            <Popup
                    title={(adults+children==0?'Кто едет': '') + (adults>0?`Взрослые ${adults} `:'') + (children>0?`Дети ${children}`:'')}
                    error={showErrors&&adults+children==0}
                    primary={adults+children===0}
                    width='15%'
                    variant='filled'
                    height='3em'
                    >
                        <PopupItem onChange={setAdults}
                        min={0}
                        title={"Взрослые"}
                        />
                        <PopupItem onChange={setChildren}
                        min={0}
                        title={"Дети"}
                        />
                    </Popup>

            <SearchButton variant="text" onClick={handleSearch}>
                <span style={{width: '15%', aspectRatio: 1, background: '#D9D9D9'}}></span>Искать</SearchButton>
        </MainBox>
    );
}
