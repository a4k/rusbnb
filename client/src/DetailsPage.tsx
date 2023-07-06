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
import { Avatar } from '@mui/material';
import {ReviewsBlock} from './ReviewsBlock';
import Review from './Review';
import { OutlinedInput } from '@mui/material';
import BgAvatar from './BgAvatar';
import { blankImage } from './Images';

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
    display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', bottom: '5vh', marginTop: '4vh',
    minHeight: '45vh'
}),
BookingBox = styled(Box)({
    width: '35%'
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
    color: 'white', marginTop: '3vh', paddingTop: '1vh', paddingBottom: '1vh'
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
    const [sr, setSr] = React.useState("0");
    const isLogin = localStorage.getItem('isLogin') || '';
    const username = localStorage.getItem('username') || '';
    const userId = localStorage.getItem('userId') || '';

    const {id} = useParams();
    const [reviewText, setReviewText] = React.useState('');
    const [reviewRate, setReviewRate] = React.useState(1);

    const [listImages, setListImages] = React.useState(Array<Photo>);
    const [srcFirst, srcFirstSet] = React.useState('');
    const [srcSecond, srcSecondSet] = React.useState('');
    const [reviewsList, setRList] = React.useState(Array<Review>);
    const [hrate, setHR] = React.useState(0);
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
            {srcFirstSet(res.data["room-photos"][0]['filename']);
            if(res.data["room-photos"].length > 1)
            srcSecondSet(res.data["room-photos"][1]['filename']);
            }
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
        axios.get('/avr-rate/'+id)
        .then(res=>{
            setSr(res.data["average-rate"]);
            })
        .catch((error) => {
            toast.error('Ошибка '+error)
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
                console.log(error.response)
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

    const setImages = (index : number)=>{
        if(listImages.length <= 2) return
        srcFirstSet(listImages[index].filename);
        srcSecondSet(listImages[(index+1)%listImages.length].filename);
    }

    const loadPrev = ()=>{
        if(listImages.length <= 2) return
        indexImgSet(((indexImg-1)<0)?(listImages.length-1):(indexImg-1));
        setImages(((indexImg-1)<0)?(listImages.length-1):(indexImg-1));
    }

    const loadNext = ()=>{
        if(listImages.length <= 2) return
        indexImgSet((indexImg+1)%listImages.length);
        setImages((indexImg+1)%listImages.length);
    }

    return (
        <MainBox>

            <TitleBox>
                <TitleText> {room.title}</TitleText>
                <TitleText sx={{fontWeight: 'bold'}}> &#9733; {parseFloat(sr || "0").toFixed(1)}</TitleText>
            </TitleBox>
            <CarouselBox>
                <CarouselImg src={srcFirst || blankImage}
                alt="" 
                style={{borderTopLeftRadius: '15px'}}/>
                <CarouselImg src={srcSecond || blankImage} alt="" 
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
                    <BookingInterBox>
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
                                slotProps={{ textField: { size: 'small'}}}/>
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
                        toast.success('Жилье забронировано')
                    }}>
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
            <Typography sx={{fontSize: '2rem'}}>&#9733; {(reviewsList.reduce(function(sum : number, elem : Review){
                return sum + elem.rate;
            }, 0) / (reviewsList.length==0?1:reviewsList.length)).toFixed(1)} &#183; {reviewsList.length} отзыв{(reviewsList.length%100>=10&&reviewsList.length%100<=20)||[0,5,6,7,8,9].includes(reviewsList.length%10)?"ов":([2,3,4].includes(reviewsList.length%10)?"а":"")}</Typography>
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