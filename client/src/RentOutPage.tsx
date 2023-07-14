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
import { OutlinedInput } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {places} from './CitiesData';

const MainBox = styled(Box)({
    width: '60vw', margin: 'auto', marginTop: '5vh', backgroundColor: 'white', marginBottom: '10vh',
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

export default function RentOutPage(){
    const isLogin = localStorage.getItem('isLogin') || '';
    const [photoList, setPL] = React.useState<Array<File>>([new File([""], ''), new File([""], ''), new File([""], '')]);
    const [type, setType] = React.useState('');
    const [subtitle, setSubTitle] = React.useState('');
    const [desc, setDesc] = React.useState('');
    const [price, setPrice] = React.useState(1);
    const [countRooms, setcountR] = React.useState(1);
    const [place, setPlace] = React.useState('');
    const handleType = (event: SelectChangeEvent) => {
        setType(event.target.value);
    };

    const handleCreateRoom = ()=>{
        let realLength = Array.from(new Set(photoList.filter(p=>p.name!='').map(p=>p.name))).length;
        if(countRooms < 1 || countRooms > 20){
            toast.error('Некорректное количество комнат! Максимум - 20');
            return
        }
        else
        if(price <= 0) toast.error('Цена должна быть больше нуля');
        else if(price > 100000) toast.error('Максимальная цена - 100.000');
        else if(realLength < 3) {
            toast.error('Минимум 3 разных фотографии!')
            return
        }
        else if(realLength < photoList.length) {
            toast.error('Уберите одинаковые фотографии')
            return
        }
        else if(type=='') {
            toast.error('Необходимо выбрать тип жилья')
            return
        }
        else if(place=='') {
            toast.error('Необходимо выбрать место')
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
                    window.location.href="/";
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
            title: `${type}, ${place}`,
            subtitle: subtitle,
            description: desc,
            price: price,
            rate: 0
        })
        .then(res=>{
            toast.success('Жилье создано');
            handlePostPhotos();
            })
        .catch((error) => {
            if(!error.response) toast.error('Ошибка на сервере. '+error)
            else if (error.response!.status === 400){
                toast.error(`Один или несколько полей не заданы`);
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
                <FormControl sx={{ width: '45%', height: '3em'}}  variant="filled" size="small">
                    <InputLabel id="demo-simple-select-autowidth-label">Тип жилья</InputLabel>
                    <Select sx={{height: '100%'}}
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={type}
                    onChange={handleType}
                    autoWidth
                    label="Тип жилья"
                    >
                    {
                        types.map((it) => (
                            <MenuItem value={it} key={it}>{it}</MenuItem>
                        ))
                    }
                    </Select>
                    </FormControl>
                <Autocomplete
                    
                    onChange={(e, v)=>{setPlace(String(v))}}
                    id="combo-box-demo"
                    options={places}
                    sx={{ width: '45%'}}
                    renderInput={(params) => <TextField {...params} label="Место" variant='filled'
                    sx={{ width: '100%', height: '100%'}} size="small"/>}
                />
            </SelectBox>
            <OutlinedInput placeholder='Краткое описание' onChange={(e)=>{setSubTitle(e.target.value)}} multiline></OutlinedInput>
            <OutlinedInput placeholder='Описание' onChange={(e)=>{setDesc(e.target.value)}} multiline></OutlinedInput>
            <OutlinedInput placeholder='Цена за ночь, &#8381;'
            type="number" onChange={(e)=>{setPrice(parseInt(e.target.value))}} inputProps={{min: 1, max: 100000}}></OutlinedInput>
            <OutlinedInput placeholder='Количество комнат'
            type="number" onChange={(e)=>{setcountR(parseInt(e.target.value))}} inputProps={{min: 1, max: 20}}></OutlinedInput>
            <Typography sx={{fontWeight: 'bold'}}>Фотографии (минимум 3)</Typography>
        {
            photoList.map((file, i) =>
        (
            <Box>
                <Button
                    variant="contained"
                    component="label"
                    key={i}
                    >
                    {file?(!file.name?"Файл не выбран":file.name):'Файл не выбран'}
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e)=>{
                                if(!e.target.files || e.target.files.length === 0) return
                                console.log(e.target.files)
                                let l = e.target.files.length;
                                setPL(photoList.map((item, index)=>(
                                index == i?(e.target.files?e.target.files[0]:(new File([""], ''))):item
                            )));
                        }}
                        />
                </Button>
                <Button onClick={()=>{
                    if(photoList.length > 3)
                    setPL(photoList.filter((_, index)=>index!=i));
                }}>&#10006;</Button>
        </Box>))
        }
        <Button sx={{width: '50%'}} onClick={()=>{setPL([...photoList, (new File([""], ''))]);}}>Добавить ещё</Button>
        <Button onClick={handleCreateRoom} variant="contained">Сдать</Button>
        </>
        )
}
    </MainBox>
    )
}