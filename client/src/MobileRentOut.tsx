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
        else
        handlePostRoom();
    }

    const handlePostPhotos = ()=>{
        axios.get('/rooms'
        )
        .then(res=>{
                const rooms = res.data.rooms;
                let roomId = rooms[rooms.length - 1].id;
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
                    navigate('/', {state: location.state || {}});
                    })
                .catch((error) => {
                    toast.error(`Ошибка на сервере. `+error);
                });
                })
            })
        .catch((error) => {
            toast.error(`Ошибка на сервере. `+error);
            });
    }
    const handlePostRoom = ()=>{
        axios.post('/rooms',{
            title: title,
            subtitle: subtitle,
            description: desc,
            price: price,
            location: place,
            type: type,
            rooms_count: countRooms,
            host_id: localStorage.getItem('userId')
        })
        .then(res=>{
            toast.success('Жилье создано');
            handlePostPhotos();
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
    <MainBox>
            {!(isLogin==='true')?

            (
                <Typography sx={{color: 'red', fontSize: '2rem'}}>Необходимо войти в аккаунт!</Typography>
            ):

            (<>
            <SelectBox>
                <FormControl sx={{ width: '47%', minHeight: '3rem'}} size="medium">
                    <InputLabel id="demo-simple-select-autowidth-label"
                    error={type=='' && showErrors} color="info">Тип жилья</InputLabel>
                    <Select sx={{height: '100%'}}
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    color="info"
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
                    color="info"
                    onChange={(e, v)=>{setPlace(String(v));}}
                    id="combo-box-demo"
                    options={places}
                    sx={{ width: '47%', minHeight: '3rem'}}
                    renderInput={(params) => <TextField {...params} label="Место" color="info"
                    sx={{ width: '100%', height: '100%'}} size="medium"
                    error={(place=='' || place == 'null') && showErrors}
                    helperText={(place=='' || place == 'null') && showErrors?'Это поле обязательно': ''}
                    />}
                />
            </SelectBox>
            <TextField placeholder='Название' onChange={(e)=>{setTitle(e.target.value);}} multiline
            value={title}
            color="info"
            error={stringDataError(title) && showErrors || title.length > 25}
            helperText={stringDataError(title) && showErrors?'Поле должно быть заполнено':'До 25 символов'}/>
            <TextField placeholder='Краткое описание' onChange={(e)=>{setSubTitle(e.target.value);}} multiline
            value={subtitle}
            color="info"
            error={stringDataError(subtitle) && showErrors || subtitle.length > 50}
            helperText={stringDataError(subtitle) && showErrors?'Поле должно быть заполнено':'Отображается на карточке, до 50 символов'}></TextField>
            <TextField placeholder='Описание' onChange={(e)=>{setDesc(e.target.value)}} multiline
            value={desc}
            color="info"
            error={stringDataError(desc) && showErrors || desc.length > 500}
            helperText={stringDataError(desc) && showErrors?'Поле должно быть заполнено': 'Отображается на странице жилья, до 500 символов'}
            ></TextField>
            <TextField placeholder='Цена за ночь, &#8381;'
            color="info"
            type="number" onChange={(e)=>{setPrice(parseInt(e.target.value))}} inputProps={{min: 1, max: 100000}}
            value={isNaN(price)?'':price}
            error={intDataError(price, 100_000) && showErrors}
            helperText={intDataError(price, 100_000) && showErrors?'Цена должна быть больше нуля и не больше 100000':''}
            ></TextField>
            <TextField placeholder='Количество комнат'
             color="info"
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
                    color="info"
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
                }} color="info">&#10006;</Button>
        </Box>))
        }
        <Button sx={{width: '50%'}} onClick={()=>{setPL([...photoList, (new File([""], ''))]);}} color="info">Добавить ещё</Button>
        <Button onClick={handleCreateRoom} variant="contained" color="info">Сдать</Button>
        <Button onClick={handleCancel} sx={{color: `#606060`}}>Назад</Button>
        </>
        )
}
    </MainBox>
    )
}