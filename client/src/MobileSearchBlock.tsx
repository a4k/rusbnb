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
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';

const MainBox = styled(Box)({
    display: 'flex', backgroundColor: '#D9D9D9', width: '90vw', margin: '0 auto', marginTop: '2vh',
    borderRadius: '50px', 
    justifyContent: 'space-between', padding: '0 1em', alignItems: 'center', minHeight: '4rem'
}),
Typo = styled(Typography)({
    fontSize: '0.9rem'
});
export default function SearchBlock(){
    const navigate = useNavigate(), location = useLocation();
    const state = location.state;
    const place : string = state?.place || 'Искать везде',
    dateDeparture : Dayjs = state?.dateDeparture || dayjs().add(1, 'day'), //пока не используется
    dateArrival : Dayjs = state?.dateArrival || dayjs(), //пока не используется : Dayjs = state?.dateArrival || dayjs()
    interval : number = state?.interval || 7,
    adults = state?.adults || 0,
    children = state?.children || 0,
    guests = adults + children;
    return (
        <MainBox>
            <SearchIcon sx={{backgroundColor: '#C4C4C4', fontSize: '2.8rem', borderRadius: '50%', padding: '5px'}}/>
            <Box onClick={()=>{navigate('/search')}}>
                <Typo sx={{fontWeight: '600'}}>{place}</Typo>
                <Typo sx={{fontWeight: '300'}}>{interval} дней &#183; {adults+children==0?'Кто едет?':
                `${guests} гост${guests==1?'ь':(guests%10==2 ||guests%10==3 || guests%10==4 ? "я" : "ей")}`}</Typo>
            </Box>
            <FilterAltIcon sx={{backgroundColor: 'white', fontSize: '2.8rem', borderRadius: '50%', padding: '5px'}}
            onClick={()=>{navigate('/filter')}}/>
        </MainBox>
    );
}
