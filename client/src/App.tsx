import * as React from 'react';
import { Dayjs } from 'dayjs';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
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
import Header from './Header';

const places = [
    'Сочи', 'Анадырь', 'Саратов', 'Челябинск'
]

function SearchBlock(){
    const [place, setPlace] = React.useState('');
    const handleChangePlace = (event: SelectChangeEvent) => {
        setPlace(event.target.value);
    };
    const [countPeople, setCountPeople] = React.useState('');
    const handleChangeCountPeople = (event: SelectChangeEvent) => {
        setCountPeople(event.target.value);
    };
    const [dateArrival, setDateArrival] = React.useState<Dayjs | null>(null);
    const [dateDeparture, setDateDeparture] = React.useState<Dayjs | null>(null);

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', backgroundColor: '#D9D9D9', width: '76vw', marginLeft: '12vw', marginTop: '2vh',
        borderRadius: '50px', paddingLeft: '1.5vw',
        justifyContent: 'space-between', paddingRight: '0.3vw', height: '6.5vh', alignItems: 'center'}}>
            
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={places}
                sx={{ width: '15%' }}
                renderInput={(params) => <TextField {...params} label="Куда" variant='filled'
                sx={{ width: '100%', height: '5vh'}} size="small"/>}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']} sx={{width: '15%', height: '6vh', overflow: 'hidden'}}>
                    <DatePicker value={dateArrival} onChange={(newValue) => {setDateArrival(newValue);}} 
                    label="Когда прибытие"
                    slotProps={{ textField: { size: 'small', variant: 'filled'}}}/>
                </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']} sx={{width: '15%', height: '6vh', overflow: 'hidden'}}>
                <DatePicker value={dateDeparture} onChange={(newValue) => {setDateDeparture(newValue);}}
                label="Когда выезд"
                slotProps={{ textField: { size: 'small', variant: 'filled' } }}/>
                </DemoContainer>
            </LocalizationProvider>

            <FormControl sx={{ width: '15%', height: '5vh'}}  variant="filled" size="small">
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
                    <MenuItem value={it}>{it} гост{it==1?'ь':(it%10==2 ||it%10==3 || it%10==4 ? "я" : "ей")}</MenuItem>
                ))
            }
            </Select>
        </FormControl>
        <Button variant="text" sx={{backgroundColor: '#79747E', height: '80%', width: '15%', borderRadius: '50px', color: 'white', display: 'flex',
    justifyContent: 'space-around', ":hover":{
        backgroundColor: '#5F5C63'
    }}}>
            <span style={{width: '15%', aspectRatio: 1, background: '#D9D9D9'}}></span>Искать</Button>
        </Box>
    );
}

export default function App() {
    return (
        <>
        <Header />
        <SearchBlock />
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Material UI Create React App example in TypeScript
                </Typography>
            </Box>
        </Container>
        </>
    );
}