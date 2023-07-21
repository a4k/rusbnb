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
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Avatar } from '@mui/material';
import {ReviewsBlock} from './ReviewsBlock';
import Review from './Review';
import { OutlinedInput } from '@mui/material';
import BgAvatar from './BgAvatar';
import { blankImage } from './Images';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';

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
    display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between',
    overflow: 'visible'
}),
CarouselBtn = styled(Button)({
    width: '50%', fontSize: '2rem', color: '#556CD6'
}),
CarouselImg = styled('img')({
    minWidth: '50%',maxWidth: '50%', height: '100%', objectFit: 'cover',
                    transition: '0.5s'
}),
ContentBox = styled(Box)({
    display: 'flex', width: '100%', justifyContent: 'space-between', bottom: '5vh', marginTop: '4vh',
    minHeight: '45vh',
    flexFlow: 'row wrap'
}),
BookingBox = styled(Box)({
    flexBasis: '250px',
    flexGrow: '1',
    paddingTop: '1em'
}),
BookingInterBox = styled(Box)({
    backgroundColor: 'white',
    boxShadow: '0px 14px 47px 15px rgba(34, 60, 80, 0.2)',
    width: '100%', display: 'flex', flexDirection: 'column', borderRadius: '20px',
    padding: '2vh 2vw 3vh'
}),
BookingText = styled(Typography)({
    fontSize: '1.5rem'
}),
BookingBtn = styled(Button)({
    background: 'linear-gradient(58deg, rgba(230,30,61,1) 0%, rgba(216,5,102,1) 100%)', 
    color: 'white', marginTop: '1em', fontSize: '.9em',
    height: '3em'
}),
InputsFormControl = styled(FormControl)({
    width: '50%' 
}),
Line = styled(Box)({
    width: '100%', height: '0.1vh', backgroundColor: 'gray', marginTop: '5vh', marginBottom: '3vh'
})

type Photo = {
    id: number,
    room_id: number,
    title: string,
    description: string,
    format: string,
    filename: string
}

type Review = {
    user_id: number,
    review: string,
    rate: number
}

function numberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function DetailsPage(){
    const navigate = useNavigate();
    const isLogin = localStorage.getItem('isLogin') || '';
    const username = localStorage.getItem('username') || '';
    const userId = localStorage.getItem('userId') || '';

    const {id} = useParams();
    const [reviewText, setReviewText] = React.useState('');
    const [reviewRate, setReviewRate] = React.useState(1);
    const [showErrorsBooking, setShowErrorsBooking] = React.useState(false);
    const [host, setHost] = React.useState({
        id: -1,
        username: ''
    });

    const [listImages, setListImages] = React.useState(Array<string>);
    const [reviewsList, setRList] = React.useState(Array<Review>);
    const [hrate, setHR] = React.useState(0);
    const [offsetCarousel, setOffCar] = React.useState(0);
    const [room, setRoom] = React.useState({description: '', id: -1, price: 0, rate: 0, subtitle: '', title: '', type: '', location: '', host_id: -1, rooms_count: 0});
    React.useEffect(
        ()=>{
            axios.get('/rooms/'+id)
        .then(res=>{
            setRoom(res.data);
            axios.get(`/user/${res.data.host_id}`)
            .then(res=>{
                setHost(res.data)
            })
            .catch(error=>{
                toast.error('Владелец не найден')
            })
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
            setListImages(res.data["room-photos"].map((p : Photo)=>p.filename));
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

        axios.get('/reviews/'+id
        )
            .then(res=>{
                setRList(res.data.reviews);
                })
            .catch((error) => {
                if(!error.response) toast.error('Ошибка на сервере. '+error)
                else if (error.response!.status === 404){
                }
                else{
                    toast.error('Ошибка на сервере. '+error)
                }
        });
        },
        []
    )
    const [countPeople, setCountPeople] = React.useState('');
    const handleChangeCountPeople = (event: SelectChangeEvent) => {
        setCountPeople(event.target.value);
    };
    const [dateArrival, setDateArrival] = React.useState<Dayjs | null>(null);
    const [dateDeparture, setDateDeparture] = React.useState<Dayjs | null>(null);

    const handleBooking = ()=>{
        if(isLogin != 'true') {toast.error('Нужно войти в аккаунт!'); return}
        setShowErrorsBooking(true);
        if(!countPeople || !dateArrival || !dateDeparture) return
        if(dateDeparture.diff(dateArrival, 'day') <= 0) return
        if(dateArrival.diff(dayjs(), 'day') < 0) return
        axios.post(`/book/${id}`,{
            user_id: userId,
            date_from: dateArrival.format('DD/MM/YYYY'),
            date_to: dateDeparture.format('DD/MM/YYYY')
        })
        .then(res=>{
            toast.success('Жилье забронировано')
        })
        .catch(err=>toast.error('Ошибка на сервере'))
    }

    const CreateReview = ()=>{
        let str = reviewText.replace(/\s+/g, ' ').trim();
        if(str.length <= 10) toast.error('Длина отзыва должна быть больше 10 символов');
        else {
            axios.post(`/reviews/${id}`,{
                user_id: parseInt(userId),
                review_text: str,
                rate: reviewRate,
            })
            .then(res=>{    
                window.location.reload();
            })
            .catch((error) => {
                if(!error.response) toast.error('Ошибка на сервере. '+error)
                else if (error.response!.status === 404){
                    toast.error(`Ошибка!!!`);
                }
                else{
                    toast.error('Ошибка на сервере. '+error)
                }
              });
        }
    }

    const loadPrev = ()=>{
        if(offsetCarousel+1 > 0)
        setOffCar(-(listImages.length-2));
        else
        setOffCar((offsetCarousel+1));
    }

    const loadNext = ()=>{
        setOffCar((offsetCarousel-1)%(listImages.length-1));
    }

    const disableArriveDates = (date : Dayjs) : boolean =>{
        return date.diff(dayjs(), 'day') < 0;
    };

    const disableDepartureDates = (date : Dayjs) : boolean =>{
        return date.diff(dateArrival || dayjs().add(-1, 'day'), 'day') <= 0;
    };


    return (
        <MainBox>

            <TitleBox>
                <TitleText sx={{fontWeight: '500'}}> {room.title}</TitleText>
                <TitleText sx={{fontWeight: 'bold'}}> &#9733; {room.rate.toFixed(1)}</TitleText>
            </TitleBox>
            <Typography sx={{color: '#353535', fontSize: '1.3rem'}}>
                {room.type}, {room.location}
            </Typography>
            <Box sx={{height: '30vw', display: 'flex', width: '72vw', overflowX: 'hidden', borderRadius: '30px'}}>
                {
                    listImages.map((p, index)=>(
                        <CarouselImg src={p}
                        key={index}
                        alt="" 
                        onError={() => {
                            setListImages(listImages.map((ph, i)=>(i==index?blankImage:ph)));
                        }}
                        style={{transform: `translateX(${offsetCarousel*36}vw)`}} 
                        loading="lazy"
                        />
                    ))
                }
            </Box>
            <CarouselBox>
                <CarouselBtn onClick={loadPrev} style={{borderBottomLeftRadius: '15px', borderTopLeftRadius: '15px'}}>
                    &#9668;
                </CarouselBtn>
                <CarouselBtn onClick={loadNext} style={{borderBottomRightRadius: '15px', borderTopRightRadius: '15px'}}>
                    &#9658;
                </CarouselBtn>
            </CarouselBox>
            <ContentBox>
                <Box sx={{display: 'flex', flexFlow: 'column nowrap', flexBasis: '60%', width: '60%', flexGrow: '1'}}>

                <Box sx={{display: 'flex', width: '90%', justifyContent: 'space-between', padding: '2em 1em', borderBottom: '1px solid #DDDDDD', minHeight: '4rem'}}>
                    <Box>
                    <Typography sx={{fontSize: '2rem', fontWeight: '500'}}>Сдаёт {host.username || 'Не найдено'}
                    </Typography>
                    <Typography sx={{fontSize: '1.3rem', fontWeight: '300'}}>{room.rooms_count} комнат{room.rooms_count==1?'а':(room.rooms_count>1&&room.rooms_count<5?'ы':'')}</Typography>
                    </Box>
                    <Avatar alt={host.username}  sx={{width: '5rem', height: '5rem', background: BgAvatar(host.username), fontSize: '2rem', cursor: 'pointer'}}
                    onClick={()=>{if(host.id !== -1) navigate(`/profile/${host.id}`)}}>{(host.username[0] || ' ').toUpperCase()}</Avatar>
                </Box>
                <BookingText sx={{width: '100%',padding: '1em'}}>
                    {room.description}
                </BookingText> 
                </Box>
                    
                <BookingBox>
                    <BookingInterBox>
                    <BookingText sx={{fontWeight: 'bold', textAlign: 'center'}}>{numberWithSpaces(room.price)} &#8381; ночь</BookingText>

                    <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between', marginTop: '1em', flexFlow: 'column nowrap'}}>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} sx={{width: '100%'}}>
                                <DatePicker value={dateArrival} onChange={(newValue) => {setDateArrival(newValue);}} 
                                label="Прибытие"
                                slotProps={{ textField: { size: 'small',
                                error: (dateArrival?(dateArrival.diff(dayjs(), 'day') < 0):showErrorsBooking)}}} sx={{width: '100%'}}
                                shouldDisableDate={disableArriveDates}/>
                            </DemoContainer>
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} sx={{width: '100%'}}>
                                <DatePicker value={dateDeparture} onChange={(newValue) => {setDateDeparture(newValue);}}
                                label="Выезд"
                                slotProps={{ textField: { size: 'small',
                            error: (dateDeparture?(dateDeparture.diff(dateArrival, 'day') <= 0):showErrorsBooking)}}} sx={{width: '100%'}}
                            shouldDisableDate={disableDepartureDates}
                                />
                            </DemoContainer>
                        </LocalizationProvider>

                    </Box>

                    <FormControl sx={{ width: '100%', height: '2.5em', marginTop: '0.5em'}}  size="small">
                        <InputLabel id="demo-simple-select-autowidth-label">Кто едет</InputLabel>
                        <Select sx={{height: '100%'}}
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={countPeople}
                        onChange={handleChangeCountPeople}
                        autoWidth
                        label="CountPeople"
                        error={countPeople=='' && showErrorsBooking}
                        >
                        {
                            [1,2,3,4,5,6,7,8,9,10].map((it) => (
                                <MenuItem value={it} key={it}>{it} гост{it==1?'ь':(it%10==2 ||it%10==3 || it%10==4 ? "я" : "ей")}</MenuItem>
                            ))
                        }
                        </Select>
                    </FormControl>
                    <Typography sx={{textAlign: 'center', marginTop: '1em', fontWeight: 'bold'}}>
                        Итого: {numberWithSpaces(room.price * (dateDeparture&&dateArrival?(dateDeparture.diff(dateArrival, 'day') <= 0?1:dateDeparture.diff(dateArrival, 'day')):1))} &#8381;
                    </Typography>
                    <BookingBtn onClick={handleBooking}>
                        Забронировать
                    </BookingBtn>
                    </BookingInterBox>
                </BookingBox>
            </ContentBox>
            {
                        (isLogin==='true')?
                        (
                        <>
                        <Line></Line>
                        <Box sx={{width: '100%'}}>
                            <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold', textAlign: 'center'}}>Оставить отзыв</Typography>
                            <Typography sx={{fontSize: '2rem', textAlign: 'center', marginBottom: '2vh'}}>
                                {
                                    [1,2,3,4,5].map(v=>(
                                        <a onClick={()=>{setReviewRate(v)}} style={{cursor: 'pointer', userSelect: 'none'}}
                                        onMouseOver={()=>{setHR(v)}}
                                        onMouseLeave={()=>{setHR(0)}}
                                        >{(v<=reviewRate && hrate==0) || v <= hrate?(<>&#9733;</>):(<>&#9734;</>)}</a>
                                    ))
                                }
                            </Typography>
                            <Box sx={{display: 'flex', flexDirection: 'row'}}>
                            <a href={'/profile/'+userId} style={{textDecoration: 'none', marginRight: '1vw'}}>
                                <Avatar alt={username}  sx={{width: '5vh', height: '5vh', background: BgAvatar(username), maxWidth: '10vw'}}>{(username[0] || ' ').toUpperCase()}</Avatar>
                            </a>
                            <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'flex-end'}}>
                            <InputsFormControl sx={{width: '100%'}}>
                                <OutlinedInput
                                    onChange={(e)=>{setReviewText(e.target.value)}}
                                    id="standard-adornment-login"
                                    type='text'
                                    placeholder="Оставьте отзыв о жилье"
                                    multiline
                                />
                            </InputsFormControl>
                            <Button sx={{padding: '1vh 1vw'}} onClick={CreateReview}>Оставить отзыв</Button>
                            </Box>
                            </Box>
                        </Box></>):
                        (<></>)
                    }
            
            <Line></Line>
            <Typography sx={{fontSize: '2rem'}}>&#9733; {room.rate.toFixed(1)} отзыв{(reviewsList.length%100>=10&&reviewsList.length%100<=20)||[0,5,6,7,8,9].includes(reviewsList.length%10)?"ов":([2,3,4].includes(reviewsList.length%10)?"а":"")}</Typography>
            <ReviewsBlock container>
                {
                    reviewsList.slice(-6).map(r=>(
                        <Review
                        userId={r.user_id}
                        rate={r.rate}
                        text={r.review}
                        short = {true}
                        key={r.user_id}
                        />
                    ))
                }
            </ReviewsBlock>
            <Button sx={{color: 'black'}} href={"/details/"+String(id) + "/reviews"}>Посмотреть все отзывы</Button>
        </MainBox>
    )
}