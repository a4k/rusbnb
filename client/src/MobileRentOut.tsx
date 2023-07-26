import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FormHelperText } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {places} from './CitiesData';
import { useNavigate, useLocation } from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import Footer from './MobileFooter';

const MainBox = styled(Box)({
    width: '90vw', margin: 'auto', marginTop: '2rem', backgroundColor: 'white', marginBottom: '10vh',
    display: 'flex', flexDirection: 'column',
    gap: '2vh',
    padding: '5vh 2vw', borderRadius: '20px',
    boxShadow: '0px 14px 47px 15px rgba(85, 108, 214, 0.2)',
    minWidth: '250px'
}),
SelectBox = styled(Box)({
    display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between'
})

const types = ['Дом','Квартира', 'Вилла', 'Отель'];

type Dates = {
    dateBegin: Dayjs | null,
    dateEnd: Dayjs | null
}

export default function MobileRentOutPage(){
    const navigate = useNavigate(), location = useLocation();
    const isLogin = localStorage.getItem('isLogin') || '';
    const [photoList, setPL] = React.useState<Array<File>>([new File([""], ''), new File([""], ''), new File([""], '')]);
    const [type, setType] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [subtitle, setSubTitle] = React.useState('');
    const [desc, setDesc] = React.useState('');
    const [price, setPrice] = React.useState(NaN);
    const [countRooms, setcountR] = React.useState(NaN);
    const [place, setPlace] = React.useState('');
    const [showErrors, setShowErrors] = React.useState(false);
    const [dates, setDates] = React.useState<Array<Dates>>([{dateBegin: null, dateEnd: null}]);
    const handleType = (event: SelectChangeEvent) => {
        setType(event.target.value);
    };
    const stringDataError = (str: String) : boolean =>{
        return str.replace(/\s+/g, ' ').trim().length === 0;
    }
    const intDataError = (value : number, max = 20) : boolean =>{
        if(isNaN(value)) return true;
        return value <= 0 || value > max;
    }

    const handleCancel = ()=>{
        navigate(-1);
    }
    const disableArriveDates = (date : Dayjs) : boolean =>{
        return date.diff(dayjs(), 'day') < 0;
    };

    const handleCreateRoom = ()=>{ 
        setShowErrors(true);
        let realLength = Array.from(new Set(photoList.filter(p=>p.name!='').map(p=>p.name))).length;
        if(title.replace(/\s+/g, ' ').trim().length > 25){
            toast.error('Максимальная длина названия - 25'); return
        }
        else
        if(subtitle.replace(/\s+/g, ' ').trim().length > 50){
            toast.error('Максимальная длина краткого описания - 50'); return
        }
        else
        if(desc.replace(/\s+/g, ' ').trim().length > 500){
            toast.error('Максимальная длина описания - 500'); return
        }
        else
        if(isNaN(countRooms)) {toast.error('Введите количество комнат!');
         return
        }
        else
        if(intDataError(countRooms)){
            toast.error('Некорректное количество комнат! Максимум - 20')
            return
        }
        else
        if(isNaN(price)) {toast.error('Введите цену!'); return}
        else
        if(price <= 0) {toast.error('Цена должна быть больше нуля'); return}
        else if(price > 100000){ toast.error('Максимальная цена - 100.000'); return}
        else if(realLength < 3) {
            toast.error('Минимум 3 разных фотографии!'); 
            return
        }
        else if(realLength < photoList.length) {
            toast.error('Уберите одинаковые фотографии'); 
            return
        }
        else if(type=='') {
            toast.error('Необходимо выбрать тип жилья'); 
            return
        }
        else if(place=='') {
            toast.error('Необходимо выбрать место'); 
            return
        }
        else if(dates.filter(date=>(date.dateBegin==null || date.dateEnd == null)).length > 0) {
            toast.error('Заполните даты!'); 
            return
        }
        else if(dates.filter(date=>(date.dateEnd!.diff(date.dateBegin, 'day') <= 0)).length > 0){
            toast.error('Дата конца должна быть позже даты начала!')
        }
        else
        handlePostRoom();
    }

    const handlePostPhotos = (roomId: number)=>{
        photoList.filter(p=>p.name!='').forEach(p=>{
            const bodyFormData = new FormData();
            bodyFormData.append('photo', p);
            bodyFormData.append('title', 'none');
            bodyFormData.append('description', 'none');
        axios.post(`/rooms/${roomId}/photo`,bodyFormData, {

            headers: {'Content-Type': 'multipart/form-data'}
            })
        .then(res=>{
            toast.success('Фотографии загружены');
            navigate('/');
            })
        .catch((error) => {
            toast.error(`Ошибка на сервере. `+error);
        });
        })
    }
    const handlePostRoom = ()=>{
        let room_dates = [dates.map(
            date=>(
                {
                    date_from: date.dateBegin?.format('DD/MM/YYYY'),
                    date_to: date.dateEnd?.format('DD/MM/YYYY')
                }
            )
        )];
        axios.post('/rooms',{
            title: title,
            subtitle: subtitle,
            description: desc,
            price: price,
            location: place,
            type: type,
            rooms_count: countRooms,
            host_id: localStorage.getItem('userId'),
            room_dates: room_dates
        })
        .then(res=>{
            toast.success('Жилье создано');
            handlePostPhotos(res.data.room_id);
            })
        .catch((error) => {
            if(!error.response) toast.error('Ошибка на сервере. '+error)
            else if (error.response!.status === 400){
                toast.error(`Одно или несколько полей не заданы`);
            }
            else{
                toast.error('Ошибка на сервере. '+error)
            }
            });
    }
    return (
        <>
    <MainBox>
            {!(isLogin==='true')?

            (
                <Typography sx={{color: 'red', fontSize: '2rem'}}>Необходимо войти в аккаунт!</Typography>
            ):

            (<>
            <SelectBox>
                <FormControl sx={{ width: '47%', minHeight: '3rem'}} size="medium">
                    <InputLabel id="demo-simple-select-autowidth-label"
                    error={type=='' && showErrors} color="secondary">Тип жилья</InputLabel>
                    <Select sx={{height: '100%'}}
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    color="secondary"
                    value={type}
                    onChange={handleType}
                    autoWidth
                    label="Тип жилья"
                    error={type=='' && showErrors}
                    >
                    {
                        types.map((it) => (
                            <MenuItem value={it} key={it}>{it}</MenuItem>
                        ))
                    }
                    </Select>
                    <FormHelperText sx={{color: 'red'}}>{type=='' && showErrors?'Это поле обязательно':''}</FormHelperText>
                    </FormControl>
                <Autocomplete
                    color="secondary"
                    onChange={(e, v)=>{setPlace(String(v));}}
                    id="combo-box-demo"
                    options={places}
                    sx={{ width: '47%', minHeight: '3rem'}}
                    renderInput={(params) => <TextField {...params} label="Место" color="secondary"
                    sx={{ width: '100%', height: '100%'}} size="medium"
                    error={(place=='' || place == 'null') && showErrors}
                    helperText={(place=='' || place == 'null') && showErrors?'Это поле обязательно': ''}
                    />}
                />
            </SelectBox>
            <TextField placeholder='Название' onChange={(e)=>{setTitle(e.target.value);}} multiline
            value={title}
            color="secondary"
            error={stringDataError(title) && showErrors || title.length > 25}
            helperText={stringDataError(title) && showErrors?'Поле должно быть заполнено':'До 25 символов'}/>
            <TextField placeholder='Краткое описание' onChange={(e)=>{setSubTitle(e.target.value);}} multiline
            value={subtitle}
            color="secondary"
            error={stringDataError(subtitle) && showErrors || subtitle.length > 50}
            helperText={stringDataError(subtitle) && showErrors?'Поле должно быть заполнено':'Отображается на карточке, до 50 символов'}></TextField>
            <TextField placeholder='Описание' onChange={(e)=>{setDesc(e.target.value)}} multiline
            value={desc}
            color="secondary"
            error={stringDataError(desc) && showErrors || desc.length > 500}
            helperText={stringDataError(desc) && showErrors?'Поле должно быть заполнено': 'Отображается на странице жилья, до 500 символов'}
            ></TextField>
            <TextField placeholder='Цена за ночь, &#8381;'
            color="secondary"
            type="number" onChange={(e)=>{setPrice(parseInt(e.target.value))}} inputProps={{min: 1, max: 100000}}
            value={isNaN(price)?'':price}
            error={intDataError(price, 100_000) && showErrors}
            helperText={intDataError(price, 100_000) && showErrors?'Цена должна быть больше нуля и не больше 100000':''}
            ></TextField>
            <TextField placeholder='Количество комнат'
            color="secondary"
            type="number" onChange={(e)=>{setcountR(parseInt(e.target.value));}} inputProps={{min: 1, max: 20}}
            value={isNaN(countRooms)?'':countRooms}
            error={intDataError(countRooms) && showErrors}
            helperText={intDataError(countRooms) && showErrors?'Цена должна быть больше нуля и не больше 20':''}
            ></TextField>
            <Typography sx={{fontWeight: 'bold'}}>Фотографии (минимум 3)</Typography>
        {
            photoList.map((file, i) =>
        (
            <Box>
                <Button
                    variant="contained"
                    component="label"
                    color="secondary"
                    key={i}
                    >
                    {file?(!file.name?"Файл не выбран":file.name):'Файл не выбран'}
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e)=>{
                                if(!e.target.files || e.target.files.length === 0) return
                                if(['jpg', 'png'].indexOf(e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length - 1]) !== -1)
                                setPL(photoList.map((item, index)=>(
                                index == i?(e.target.files?e.target.files[0]:(new File([""], ''))):item
                            )));
                        }}
                        />
                </Button>
                <Button onClick={()=>{
                    if(photoList.length > 3)
                    setPL(photoList.filter((_, index)=>index!=i));
                }} color="secondary">&#10006;</Button>
        </Box>))
        }
        <Button sx={{width: '50%'}} onClick={()=>{setPL([...photoList, (new File([""], ''))]);}} color="secondary">Добавить ещё</Button><Typography sx={{fontWeight: 'bold'}}>Даты сдачи</Typography>
        {
            dates.map(
                (date, i)=>(
                    <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                        <Box sx={{flexGrow: '1'}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['MobileDatePicker']} sx={{width: '100%', height: '4em', overflow: 'hidden', minWidth: '50px'}}>
                                    <MobileDatePicker value={date.dateBegin} onChange={(newValue) => {setDates(dates.map((d, index)=>(
                                        index===i?{...d, dateBegin: newValue}:d
                                    )));}} 
                                        label="Начало"
                                        slotProps={{ textField: { size: 'small', color:"secondary",
                                        error: (date.dateBegin?(date.dateBegin.diff(dayjs(), 'day') < 0):showErrors)}}} sx={{width: '100%'}}
                                        shouldDisableDate={disableArriveDates}/>
                                </DemoContainer>
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['MobileDatePicker']} sx={{width: '100%', height: '4em', overflow: 'hidden', minWidth: '50px'}}>
                                    <MobileDatePicker value={date.dateEnd} onChange={(newValue) => {setDates(dates.map((d, index)=>(
                                        index===i?{...d, dateEnd: newValue}:d
                                    )));}}
                                        label="Конец"
                                        slotProps={{ textField: { size: 'small', color:"secondary",
                                        error: (date.dateEnd?(date.dateEnd.diff(date.dateBegin || dayjs(), 'day') <= 0):showErrors)}}} sx={{width: '100%'}}
                                        shouldDisableDate={(d)=>(d.diff(date.dateBegin || dayjs()) <= 0)}/>
                                </DemoContainer>
                            </LocalizationProvider>
                        </Box>
                        <Button onClick={()=>{
                            if(dates.length > 1)
                            setDates(dates.filter((_, index)=>index!=i));
                        }}>&#10006;</Button>
                    </Box>
                )
                )
            }
        <Button sx={{width: '50%'}} onClick={()=>{setDates([...dates, {dateBegin: null, dateEnd: null}]);}} color="secondary">Добавить ещё</Button>
        <Button onClick={handleCreateRoom} variant="contained" color="secondary">Сдать</Button>
        <Button onClick={handleCancel} sx={{color: `#606060`}}>Назад</Button>
        </>
        )
}
    </MainBox>
    <Footer/>
    </>
    )
}