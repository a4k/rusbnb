import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/system';
import FormControl from '@mui/material/FormControl';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {  LocalizationProvider } from '@mui/x-date-pickers';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Avatar } from '@mui/material';
import Review from './MobileReview';
import { OutlinedInput } from '@mui/material';
import BgAvatar from './BgAvatar';
import { blankImage } from './Images';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { keyframes } from '@mui/system';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const appear = keyframes`
    from {
        height: 0px;
    }
    to{
        height: 10rem;
    }
`;

const MainBox = styled(Box)({
    width: '90vw', margin: '0 auto', marginTop: '2ch', backgroundColor: 'none', marginBottom: '10vh'
}),
TitleText = styled(Typography)(
    {fontSize: '1.8rem'}
),
CarouselBox = styled(Box)({
    display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between',
    overflow: 'visible'
}),
CarouselBtn = styled(Button)({
    width: '50%', fontSize: '2rem', color: '#556CD6'
}),
CarouselImg = styled('img')({
    minWidth: '100%',maxWidth: '100%', height: '100%', objectFit: 'cover',
    transition: '0.5s'
}),
ContentBox = styled(Box)({
    display: 'flex', width: '100%', justifyContent: 'space-between',
    height: 'auto',
    flexDirection: 'column'
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
});

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

export default function MobileDetailsPage(){
    const navigate = useNavigate();
    const isLogin = localStorage.getItem('isLogin') || '';
    const username = localStorage.getItem('username') || '';
    const userId = localStorage.getItem('userId') || '';

    const {id} = useParams();
    const [reviewText, setReviewText] = React.useState('');
    const [reviewRate, setReviewRate] = React.useState(1);
    const [showErrorsBooking, setShowErrorsBooking] = React.useState(false);;
    const [host, setHost] = React.useState({
        id: -1,
        username: ''
    });

    const [listImages, setListImages] = React.useState(Array<string>);
    const [reviewsList, setRList] = React.useState(Array<Review>);
    const [hrate, setHR] = React.useState(0);
    const [room, setRoom] = React.useState({description: '', id: -1, price: 0, rate: 0, subtitle: '', title: '', type: '', location: '', host_id: -1, rooms_count: 0});
    const [adults, setAdults] = React.useState(0);
    const [children, setChildren] = React.useState(0);
    const [openDropDown, setOpenDD] = React.useState(false);
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
    const [dateArrival, setDateArrival] = React.useState<Dayjs | null>(null);
    const [dateDeparture, setDateDeparture] = React.useState<Dayjs | null>(null);
    const [curImage, setCurImage] = React.useState(1);
    const [readFull, setReadFull] = React.useState(false);
    const FULL_WIDTH = window.outerWidth;

    const handleBooking = ()=>{
        if(isLogin != 'true') {toast.error('Нужно войти в аккаунт!'); return}
        setShowErrorsBooking(true);
        if(adults + children === 0) return
        if(!dateArrival || !dateDeparture) return
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
        .catch(error=>{
            if(!error.response) toast.error('Ошибка на сервере. '+error)
            else if (error.response!.status === 400){
                toast.error(`Жилье занято на выбранные даты!`);
            }
            else{
                toast.error('Ошибка на сервере. '+error)
            }
        })
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

    const disableArriveDates = (date : Dayjs) : boolean =>{
        return date.diff(dayjs(), 'day') < 0;
    };

    const disableDepartureDates = (date : Dayjs) : boolean =>{
        return date.diff(dateArrival || dayjs().add(-1, 'day'), 'day') <= 0;
    };

    return (
        <>
        <Box sx={{height: '3rem', display: 'flex', alignItems: 'center', backgroundColor: 'white'}}>
            <Button sx={{color: 'black'}} onClick={()=>{navigate(-1); window.scrollTo(0,0);}}>
            <ArrowBackIcon sx={{fontSize: '1.5rem'}}/>
            Назад
            </Button>
        </Box>
        <Box sx={{height: '30vh', display: 'flex', width: '100vw', overflowX: 'scroll', scrollSnapType: 'x mandatory', position: 'relative'}}
        onScroll={(e)=>setCurImage(Math.floor((e.currentTarget.scrollLeft+FULL_WIDTH/2)/FULL_WIDTH) + 1)}>
            {
                listImages.map((p, index)=>(
                    <CarouselImg src={p}
                    key={index}
                    alt="" 
                    onError={() => {
                        setListImages(listImages.map((ph, i)=>(i==index?blankImage:ph)));
                    }}
                    style={{scrollSnapAlign: 'start'}} 
                    loading="lazy"
                    />
                ))
            }
        </Box>
        <Typography sx={{position: 'absolute', top: 'calc(30vh - 4ch)', right: '2ch', color: 'white',
    backgroundColor: 'rgba(0,0,0,.4)', padding: '0 1ch', borderRadius: '5px'}}>{curImage}/{listImages.length}</Typography>
        <MainBox>

            <TitleText sx={{fontWeight: '500', width: '100%', lineHeight: '2ch', marginBottom: '1ch'}}> {room.title}</TitleText>
            <Typography sx={{fontWeight: '500', fontSize: '1.3rem', display: 'flex', alignItems: 'center', marginBottom: '1ch'}}> <StarIcon sx={{fontSize: '1.6rem'}}/> {room.rate.toFixed(1)}</Typography>
            <Typography sx={{color: '#353535', fontSize: '1.3rem', marginBottom: '1rem'}}>
                {room.type}, {room.location}
            </Typography>
            <ContentBox>

                <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between', padding: '2em 1em', borderBottom: '2px solid #DDDDDD', borderTop: '2px solid #DDDDDD', minHeight: '4rem'}}>
                    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                    <Typography sx={{fontSize: '1.5rem', fontWeight: '500'}}>Сдаёт {host.username || 'Не найдено'}
                    </Typography>
                    <Typography sx={{fontSize: '1.2rem', fontWeight: '300'}}>{room.rooms_count} комнат{room.rooms_count==1?'а':(room.rooms_count>1&&room.rooms_count<5?'ы':'')}</Typography>
                    </Box>
                    <Avatar alt={host.username}  sx={{width: '4rem', height: '4rem', background: BgAvatar(host.username), fontSize: '1.6rem', cursor: 'pointer'}}
                    onClick={()=>{if(host.id !== -1) navigate(`/profile/${host.id}`)}}>{(host.username[0] || ' ').toUpperCase()}</Avatar>
                </Box>
                <BookingText sx={{fontWeight: '300', padding: '1em', fontSize: '1.1rem', maxHeight: '30dvh',overflow: 'hidden'}}>
                    {room.description}
                </BookingText> 
                <SwipeableDrawer
                anchor={'bottom'}
                open={readFull}
                onClose={()=>setReadFull(false)}
                onOpen={()=>{}}
            >
                <Box sx={{height: '90dvh', padding: '1rem 5%', overflow: 'scroll', fontWeight: '400', fontSize: '1.2rem'}}>
                {room.description}
                </Box>
          </SwipeableDrawer>
                <Button onClick = {()=>{setReadFull(true);}}>
                    Читать полностью
                </Button>
                
                <BookingInterBox>
                <BookingText sx={{fontWeight: 'bold', textAlign: 'center'}}>{numberWithSpaces(room.price)} &#8381; ночь</BookingText>

                <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between', marginTop: '1em', flexFlow: 'column nowrap'}}>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['MobileDatePicker']} sx={{width: '100%'}}>
                            <MobileDatePicker value={dateArrival} onChange={(newValue) => {setDateArrival(newValue);}} 
                            label="Прибытие"
                            slotProps={{ textField: { size: 'small',
                            error: (dateArrival?(dateArrival.diff(dayjs(), 'day') < 0):showErrorsBooking)}}} sx={{width: '100%'}}
                            shouldDisableDate={disableArriveDates}/>
                        </DemoContainer>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['MobileDatePicker']} sx={{width: '100%'}}>
                            <MobileDatePicker value={dateDeparture} onChange={(newValue) => {setDateDeparture(newValue);}}
                            label="Выезд"
                            slotProps={{ textField: { size: 'small',
                        error: (dateDeparture?(dateDeparture.diff(dateArrival, 'day') <= 0):showErrorsBooking)}}} sx={{width: '100%'}}
                        shouldDisableDate={disableDepartureDates}
                            />
                        </DemoContainer>
                    </LocalizationProvider>

                    </Box>

                    <Box sx={{width: '100%', minHeight: '3rem', position: 'relative', marginTop: '0.5rem'}}>
                <Typography sx={{height: '2.5rem', width: '100%', background: 'white', userSelect: 'none', display: 'flex', alignItems: 'center',
                border: `1px ${adults+children==0&&showErrorsBooking?'red':'#CDCDCD'} solid`,
            borderRadius: '5px', paddingLeft: '1rem', cursor: 'pointer',
        color: showErrorsBooking&&adults+children==0?'red':(adults+children==0?'#525252':'black')}}
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
                <Typography sx={{textAlign: 'center', marginTop: '1em', fontWeight: 'bold'}}>
                    Итого: {numberWithSpaces(room.price * (dateDeparture&&dateArrival?(dateDeparture.diff(dateArrival, 'day') <= 0?1:dateDeparture.diff(dateArrival, 'day')):1))} &#8381;
                </Typography>
                <BookingBtn onClick={handleBooking}>
                    Забронировать
                </BookingBtn>
                </BookingInterBox>
            </ContentBox>
            {
                        (isLogin==='true')?
                        (
                        <>
                        <Line/>
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
                            <Box sx={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-evenly'}}>
                            <a href={'/profile/'+userId} style={{textDecoration: 'none', marginRight: '1vw'}}>
                                <Avatar alt={username}  sx={{width: '3.5rem', height: '3.5rem', background: BgAvatar(username), fontSize: '1.6rem'}}>{(username[0] || ' ').toUpperCase()}</Avatar>
                            </a>
                            <Box sx={{display: 'flex', flexDirection: 'column', width: '70%', alignItems: 'flex-end'}}>
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
            <Box sx={{display: 'flex', overflowX: 'hidden', width: '90vw', flexDirection: 'column', gap: '2rem'}}>
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
            </Box>
            <Button sx={{color: 'black'}} href={"/details/"+String(id) + "/reviews"}>Посмотреть все отзывы</Button>
        </MainBox>
        </>
    )
}