import * as React from 'react';
import { Dayjs } from 'dayjs';
import Typography from '@mui/material/Typography';
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
import Header from './Header';
import Slider from '@mui/material/Slider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


const places = [
    'Сочи', 'Анадырь', 'Саратов', 'Челябинск'
] //Доступные места при выборе "Куда"

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
                    <MenuItem value={it} key={it}>{it} гост{it==1?'ь':(it%10==2 ||it%10==3 || it%10==4 ? "я" : "ей")}</MenuItem>
                ))
            }
            </Select>
            </FormControl>

            <Button variant="text" sx={{backgroundColor: '#79747E', height: '80%', width: '15%', borderRadius: '50px', color: 'white', display: 'flex',
        justifyContent: 'space-around', ":hover":{
            backgroundColor: '#5F5C63'
        }}} href="/search">
                <span style={{width: '15%', aspectRatio: 1, background: '#D9D9D9'}}></span>Искать</Button>
        </Box>
    );
}

function Filter(){

    const [value, setValue] = React.useState('1');

    const roomsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
      };

    const [typesOfHousing, setTOH] = React.useState({
        house: false,
        flat: false,
        villa: false,
        hotel: false
      });
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTOH({
            ...typesOfHousing,
            [event.target.name]: event.target.checked,
    });
    };

    const { house, flat, villa, hotel } = typesOfHousing;

    return (
        <Box sx={{width: '20%', backgroundColor: 'white', borderRadius: '14px'}}>
            <Box sx={{width: '80%', marginLeft: '1vw', marginBottom: '3.6vh', height: '12vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '.5vh'}}>
                <Typography sx={{marginBottom: '2.5vh', fontWeight: 'bold'}}>Стоимость</Typography>
                <Slider defaultValue={12} max={80} min={5} aria-label="Default" valueLabelDisplay="auto"
                onChangeCommitted={(e, val)=>{console.log('NEW: ', val)}} sx={{marginLeft: '0.5vw'}}/>
            </Box>
            <Box sx={{borderTop: '3px #EEEEEE solid', minHeight: '20vh'}}>
            <FormControl sx={{marginLeft: '1vw', marginTop: '3.8vh', marginBottom: '3.6vh'}}>
                <FormLabel id="demo-controlled-radio-buttons-group" sx={{fontWeight: 'bold', color: 'black', marginBottom: '1vh'}}>Количество комнат</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={roomsChange}
                >
                    <FormControlLabel value="1" control={<Radio />} label={<Typography sx={{fontWeight: 'bold'}}>1 комната</Typography>} />
                    <FormControlLabel value="2" control={<Radio />} label={<Typography sx={{fontWeight: 'bold'}}>2 комнаты</Typography>} />
                    <FormControlLabel value="3" control={<Radio />} label={<Typography sx={{fontWeight: 'bold'}}>3 комнаты</Typography>} />
                    <FormControlLabel value="4" control={<Radio />} label={<Typography sx={{fontWeight: 'bold'}}>4+ комнаты</Typography>} />
                </RadioGroup>
            </FormControl>
            </Box>
            <Box sx={{borderTop: '3px #EEEEEE solid'}}>
                <FormControl sx={{ m: 3, marginTop: '3vh' }} component="fieldset" variant="standard">
                    <FormLabel component="legend" sx={{fontWeight: 'bold', color: 'black', marginBottom: '1vh'}}>Тип жилья</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={
                            <Checkbox checked={house} onChange={(e)=>{handleChange(e); console.log(!house)}} name="house" />
                            }
                            label={<Typography sx={{fontWeight: 'bold'}}>Дом</Typography>}
                        />
                        <FormControlLabel
                            control={
                            <Checkbox checked={flat} onChange={(e)=>{handleChange(e); console.log(!flat)}} name="flat" />
                            }
                            label={<Typography sx={{fontWeight: 'bold'}}>Квартира</Typography>}
                        />
                        <FormControlLabel
                            control={
                            <Checkbox checked={villa} onChange={(e)=>{handleChange(e); console.log(!villa)}} name="villa" />
                            }
                            label={<Typography sx={{fontWeight: 'bold'}}>Вилла</Typography>}
                        />
                        <FormControlLabel
                            control={
                            <Checkbox checked={hotel} onChange={(e)=>{handleChange(e); console.log(!hotel)}} name="hotel" />
                            }
                            label={<Typography sx={{fontWeight: 'bold'}}>Отель</Typography>}
                        />
                    </FormGroup>
                </FormControl>
            </Box>
        </Box>
    )
}

function MainPage (){
    return (
        <>
            <Header />
            <SearchBlock />
            <Box sx={{display: 'flex', flexDirection: 'row', width: '76vw', marginLeft: '12vw', marginTop: '5vh'}}>
                <Box sx={{ width: '50%'}}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Material UI Create React App example in TypeScript
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

function SearchPage (){
    return (
        <>
            <Header />
            <SearchBlock />
            <Box sx={{display: 'flex', flexDirection: 'row', width: '76vw', marginLeft: '12vw', marginTop: '5vh'}}>
                <Filter />
                <Box sx={{ width: '50%'}}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Material UI Create React App example in TypeScript
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

export default function App() {
    return (
        <BrowserRouter>
      <Routes>
        <Route path="*" element={<MainPage />} />
        <Route path="search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
    );
}