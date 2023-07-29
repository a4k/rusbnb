import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
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
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {PopupItem} from './Popup';
import {setTitle, titles} from './Functions';

const Footer = styled(Box)({
    backgroundColor: '#F5F5F5', height: '4rem', width: '100%', position: 'fixed', bottom: '0',
    borderTop: '1px solid gray', display: 'flex', justifyContent: 'space-between',
    padding: '0.5rem 5%'

}),
SearchElement = styled(Box)({
    backgroundColor: 'white',
    width: '90%',
    margin: '0.3rem auto',
    padding: '1.2rem 5%'
}),
FooterBtn = styled(Button)({
    fontSize: '1.2rem',
    textTransform: 'none',
    minWidth: '40%'
});

/**
 * Страница поиска для мобильных устройств
 */
export default function MobileSearch (){
    
    const [dateArrival, setDateArrival] = React.useState<Dayjs | null>(null);
    const [dateDeparture, setDateDeparture] = React.useState<Dayjs | null>(null);
    const [place, setPlace] = React.useState('');
    const [showErrors, setShowErrors] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [adults, setAdults] = React.useState(0);
    const [children, setChildren] = React.useState(0);

    React.useEffect(()=>{setTitle(titles.search)}, []);

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
        navState.interval = dateDeparture.diff(dateArrival, 'day')
        navState.adults = adults;
        navState.children = children;
        navigate('/', {state: navState});
    }

    /**
     * Возвращает на предыдущую страницу
     */
    const handleCancel = ()=>{
        navigate('/');
    }

    return (
        <>
        <SearchElement sx={{borderRadius: '25px 25px 0 0', marginTop: '2rem'}}>
            <Autocomplete
                onChange={(e, v)=>{setPlace(String(v))}}
                disablePortal
                id="combo-box-demo"
                options={places}
                sx={{ width: '100%'}}
                renderInput={(params) => <TextField {...params} label="Куда"
                error={(place==''||place==String(null))&&showErrors}
                sx={{ width: '100%'}} size="medium"
                color="secondary"/>}
            />
        </SearchElement>

        <SearchElement>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDatePicker']} sx={{width: '100%'}}>
                    <MobileDatePicker value={dateArrival} onChange={(newValue) => {setDateArrival(newValue);}} 
                        label="Прибытие"
                        slotProps={{ textField: { size: 'medium',
                        color:'secondary',
                        error: (dateArrival?(dateArrival.diff(dayjs(), 'day') < 0):showErrors)}}} sx={{width: '100%'}}
                        shouldDisableDate={disableArriveDates}/>
                </DemoContainer>
            </LocalizationProvider>
        </SearchElement>

        <SearchElement>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDatePicker']} sx={{width: '100%'}}>
                    <MobileDatePicker value={dateDeparture} onChange={(newValue) => {setDateDeparture(newValue);}}
                        label="Выезд"
                        slotProps={{ textField: { size: 'medium',
                        color:'secondary',
                        error: (dateDeparture?(dateDeparture.diff(dateArrival, 'day') <= 0):showErrors)}}} sx={{width: '100%'}}
                        shouldDisableDate={disableDepartureDates}/>
                </DemoContainer>
            </LocalizationProvider>
        </SearchElement>

        <SearchElement  sx={{borderRadius: '0 0 25px 25px', minHeight: '10rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
            <PopupItem
            onChange={setAdults}
            title="Взрослые"
            min={0}
            color="secondary"
            error={children+adults==0&&showErrors}
            />
            <PopupItem
            onChange={setChildren}
            title="Дети"
            min={0}
            color="secondary"
            error={children+adults==0&&showErrors}
            />
        </SearchElement>
        <Footer>
            <FooterBtn
            sx={{color: `#606060`, border: '1px solid #606060'}}
            onClick={handleCancel}
            >
                <CloseIcon/>Отмена
            </FooterBtn>
            <FooterBtn
            variant="contained"
            onClick={handleSearch}
            sx={{background: `linear-gradient(33deg, #A16BFE, #BC3D2F)`}}>
                <SearchIcon/>Поиск
            </FooterBtn>
        </Footer>
        </>
    )
}