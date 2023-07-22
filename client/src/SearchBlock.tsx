import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import {Typography} from '@mui/material';
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
import { keyframes } from '@mui/system';

const appear = keyframes`
    from {
        height: 0px;
    }
    to{
        height: 10rem;
    }
`;

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
}),
DDMenuItem = styled(Box)({
    display: 'flex', width: '100%', flexWrap: 'wrap',
                    justifyContent: 'space-between'
}),
DDMainTypo = styled(Typography)({
    userSelect: 'none', fontWeight: '500', flexBasis: '40%'
}),
DDValue = styled(Typography)({
    width: '3rem', textAlign: 'center', userSelect: 'none',
    fontWeight: '500'
}),
DDLine = styled(Box)({
    backgroundColor: '#EBEBEB', width: '100%', height: '2px'
}),
DDBtn = styled(Button)({
    fontSize: '1rem', height: '1.6rem', maxWidth: '2rem !imporant', padding: '0', minWidth: '2rem'
});;

export default function SearchBlock(){
    const [dateArrival, setDateArrival] = React.useState<Dayjs | null>(null);
    const [dateDeparture, setDateDeparture] = React.useState<Dayjs | null>(null);
    const [place, setPlace] = React.useState('');
    const [showErrors, setShowErrors] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [adults, setAdults] = React.useState(0);
    const [children, setChildren] = React.useState(0);

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

    const disableArriveDates = (date : Dayjs) : boolean =>{
        return date.diff(dayjs(), 'day') < 0;
    };

    const disableDepartureDates = (date : Dayjs) : boolean =>{
        return date.diff(dateArrival || dayjs().add(-1, 'day'), 'day') <= 0;
    };

    const [openDropDown, setOpenDD] = React.useState(false);

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

            <Box sx={{width: '15%', minHeight: '3em', position: 'relative'}}>
                <Typography sx={{height: '3em', width: '100%', background: '#CCC', userSelect: 'none', display: 'flex', alignItems: 'center',
                borderBottom: `1px ${adults+children==0&&showErrors?'red':'#767676'} solid`,
            borderTopRightRadius: '5px',
            borderTopLeftRadius: '5px', paddingLeft: '1rem', cursor: 'pointer',
        color: showErrors&&adults+children==0?'red':(adults+children==0?'#525252':'black')}}
                onClick={()=>{setOpenDD(!openDropDown)}}> {adults+children==0?'Кто едет':''} {adults>0?`Взрослые ${adults}`:''} {children>0?`Дети ${children}`:''}</Typography>
                <Box sx={{display: openDropDown?'flex':'none', flexDirection: 'column', backgroundColor: 'white', height: '10rem',  position: 'absolute', width: '100%',
             borderRadius: '20px', padding: '20px 1rem', justifyContent: 'space-around', marginTop: '0.5rem', overflow: 'hidden',
             minWidth: '140px', transition: 'top 3s linear', zIndex: '1',
             animation: `${appear} 0.5s ease-out`,
             animationFillMode: 'forwards'
             }}>

                        <DDMenuItem>
                            <DDMainTypo>Взрослые</DDMainTypo>
                            <Box sx={{display: 'flex'}}>
                                <DDBtn
                                size='small'
                                variant="contained"
                                color="info"
                                disabled={adults==0}
                                onClick={()=>{if(adults > 0) setAdults(adults-1)}}>
                                &mdash;
                                </DDBtn>
                                <DDValue>
                                    {adults}
                                </DDValue>
                                <DDBtn 
                                size='small'
                                variant="contained"
                                color="info"
                                onClick={()=>{setAdults(adults+1)}}>
                                    +
                                </DDBtn>
                            </Box>
                        </DDMenuItem>
                        <DDLine/>
                        <DDMenuItem>
                            <DDMainTypo>Дети</DDMainTypo>
                            <Box sx={{display: 'flex'}}>
                                <DDBtn 
                                size='small'
                                variant="contained"
                                color="info"
                                disabled={children==0}
                            onClick={()=>{if(children > 0) setChildren(children-1)}}>
                                &mdash;
                                </DDBtn>
                                <DDValue>
                                    {children}
                                </DDValue>
                                <DDBtn
                                size='small'
                                variant="contained"
                                color="info"
                                 onClick={()=>{setChildren(children+1)}}>
                                    +
                                </DDBtn>
                            </Box>
                        </DDMenuItem>
                </Box>
            </Box>

            <SearchButton variant="text" onClick={handleSearch}>
                <span style={{width: '15%', aspectRatio: 1, background: '#D9D9D9'}}></span>Искать</SearchButton>
        </MainBox>
    );
}
