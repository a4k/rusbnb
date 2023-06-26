import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { Dayjs } from 'dayjs';
import axios from 'axios';
import { toast } from 'react-toastify';

const MainBox = styled(Box)({
    width: '72vw', marginLeft: '14vw', marginTop: '5vh', backgroundColor: 'none', marginBottom: '10vh'
}),
TitleBox = styled(Box)({
    display: 'flex', flexDirection: 'row', marginBottom: '2vh', justifyContent: 'space-between'
}),
TitleText = styled(Typography)(
    {fontSize: '2rem'}
),
CarouselBox = styled(Box)({
    display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between'
}),
CarouselBtn = styled(Button)({
    width: '49%', fontSize: '2rem', color: '#556CD6'
}),
CarouselImg = styled('img')({
    width: '49%', height: '30vw', objectFit: 'cover'
}),
ContentBox = styled(Box)({
    display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', bottom: '5vh', marginTop: '4vh'
}),
BookingBox = styled(Box)({
    width: '35%', backgroundColor: 'white', paddingLeft: '1.5vw', paddingRight: '1.5vw', display: 'flex', flexDirection: 'column',
            paddingTop: '2vh', borderRadius: '20px', boxShadow: '0px 14px 47px 15px rgba(34, 60, 80, 0.2)'
}),
BookingText = styled(Typography)({
    fontSize: '1.5rem'
}),
BookingBtn = styled(Button)({
    background: 'linear-gradient(58deg, rgba(230,30,61,1) 0%, rgba(216,5,102,1) 100%)', 
    color: 'white', marginTop: '3vh', marginBottom: '3vh', paddingTop: '1vh', paddingBottom: '1vh'
})

type Photo = {
    id: number,
    room_id: number,
    title: string,
    description: string,
    format: string,
    filename: string
}

const blankImage = '/images/blankPhoto.png';

function numberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function DetailsPage(){
    const {id} = useParams();

    const [listImages, setListImages] = React.useState(Array<Photo>);
    const [srcFirst, srcFirstSet] = React.useState('');
    const [srcSecond, srcSecondSet] = React.useState('');
    const [room, setRoom] = React.useState(
        {description: '', id: 0, price: 0, rate: 0, subtitle: '', title: ''}
    );
    React.useEffect(
        ()=>{
            axios.get('/rooms/'+id)
        .then(res=>{
            setRoom(res.data);
            })
        .catch((error) => {
            if(!error.response) toast.error('Ошибка на сервере. '+error)
            else if (error.response!.status === 404){
                toast.error(`Жилье не найдено`);
            }
            else{
                toast.error('Ошибка на сервере. '+error)
            }
        });
        axios.get('/rooms/'+id+'/photo'
        )
        .then(res=>{
            setListImages(res.data["room-photos"]);
            if(res.data["room-photos"].length > 0)
            srcFirstSet(res.data["room-photos"][0]['filename']);
            srcSecondSet(res.data["room-photos"][1 % res.data["room-photos"].length]['filename']);
            })
        .catch((error) => {
            if(!error.response) toast.error('Ошибка на сервере. '+error)
            else if (error.response!.status === 404){
                toast.error(`Фотографии не найдены`);
            }
            else{
                toast.error('Ошибка на сервере. '+error)
            }
            });
        },
        []
    )
    

    const [indexImg, indexImgSet] = React.useState(0);
    const [countPeople, setCountPeople] = React.useState('');
    const handleChangeCountPeople = (event: SelectChangeEvent) => {
        setCountPeople(event.target.value);
    };
    const [dateArrival, setDateArrival] = React.useState<Dayjs | null>(null);
    const [dateDeparture, setDateDeparture] = React.useState<Dayjs | null>(null);

    const setImages = (index : number)=>{
        if(listImages.length == 0) return
        srcFirstSet(listImages[index].filename);
        srcSecondSet(listImages[(index+1)%listImages.length].filename);
    }

    const loadPrev = ()=>{
        if(listImages.length == 0) return
        indexImgSet(((indexImg-1)<0)?(listImages.length-1):(indexImg-1));
        setImages(((indexImg-1)<0)?(listImages.length-1):(indexImg-1));
    }

    const loadNext = ()=>{
        if(listImages.length == 0) return
        indexImgSet((indexImg+1)%listImages.length);
        setImages((indexImg+1)%listImages.length);
    }

    React.useEffect(()=>{
        setImages(0);
    }, [])

    return (
        <MainBox>

            <TitleBox>
                <TitleText> {room.title}, {room.subtitle}</TitleText>
                <TitleText sx={{fontWeight: 'bold'}}> &#9733; {room.rate}</TitleText>
            </TitleBox>
            <CarouselBox>
                <CarouselImg src={srcFirst==''?blankImage:(axios.defaults.baseURL + srcFirst)}
                alt="" 
                style={{borderTopLeftRadius: '15px'}}/>
                <CarouselImg src={srcSecond==''?blankImage:(axios.defaults.baseURL + srcSecond)} alt="" 
                style={{borderTopRightRadius: '15px'}}/>
            </CarouselBox>
            <CarouselBox>
                <CarouselBtn onClick={loadPrev} style={{borderBottomLeftRadius: '15px'}}>
                    &#9668;
                </CarouselBtn>
                <CarouselBtn onClick={loadNext} style={{borderBottomRightRadius: '15px'}}>
                    &#9658;
                </CarouselBtn>
            </CarouselBox>

            <ContentBox>
                <BookingText sx={{width: '60%'}}>
                    {room.description}
                </BookingText>
                <BookingBox>

                    <BookingText sx={{fontWeight: 'bold', textAlign: 'center'}}>{numberWithSpaces(room.price)} &#8381; ночь</BookingText>

                    <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between', marginTop: '2vh'}}>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} sx={{width: '48%', overflow: 'hidden'}}>
                                <DatePicker value={dateArrival} onChange={(newValue) => {setDateArrival(newValue);}} 
                                label="Прибытие"
                                slotProps={{ textField: { size: 'small'}}}/>
                            </DemoContainer>
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} sx={{width: '48%', overflow: 'hidden'}}>
                                <DatePicker value={dateDeparture} onChange={(newValue) => {setDateDeparture(newValue);}}
                                label="Выезд"
                                slotProps={{ textField: { size: 'small' } }}/>
                            </DemoContainer>
                        </LocalizationProvider>

                    </Box>

                    <FormControl sx={{ width: '100%', height: '5vh', marginTop: '2vh'}}  size="small">
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
                    <BookingBtn onClick={()=>{
                        toast.success('Жилье забранировано')
                    }}>
                        Забронировать
                    </BookingBtn>
                </BookingBox>
            </ContentBox>
        </MainBox>
    )
}