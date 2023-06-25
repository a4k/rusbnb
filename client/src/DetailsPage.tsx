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
type Room = {
    description : string,
    id: number,
    price: number,
    rate: number,
    subtitle: string,
    title: string
};

const server = 'http://rusbnb-1.exp-of-betrayal.repl.co',
blankImage = 'https://kartinkin.net/uploads/posts/2022-12/thumbs/1670495385_30-kartinkin-net-p-kartinki-soft-vkontakte-35.png';

function numberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function DetailsPage(){
    const {id} = useParams();

    const [listImages, setListImages] = React.useState(Array<Photo>);
    const [room, setRoom] = React.useState(
        {description: '', id: 0, price: 0, rate: 0, subtitle: '', title: ''}
    );
    if(listImages.length == 0)
    axios.get(server+'/rooms/'+id+'/photo'
    )
    .then(res=>{
        setListImages(res.data["room-photos"]);
        })
        .catch((error) => {
            console.log(error)
            if (error.response){
                console.log(error.response.data);
                
                }else if(error.request){
                    console.log(1);
                    console.log(error.request)
                
                }else if(error.message){
                    console.log(2);
                    console.log(error.message)
                
                }
          });
    if(room.price == 0)
    axios.get(server+'/rooms/'+id
    )
    .then(res=>{
        setRoom(res.data);
        })
        .catch((error) => {
            console.log(error)
            if (error.response){
                console.log(error.response.data);
                
                }else if(error.request){
                    console.log(1);
                    console.log(error.request)
                
                }else if(error.message){
                    console.log(2);
                    console.log(error.message)
                
                }
        });
    
    // const listImages = [
    //     'https://prorus.ru/_/manager/files/629/8c77ee1375/-MG-9802-result.jpg',
    //     'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/99/ec/e0/getlstd-property-photo.jpg?w=1200&h=-1&s=1',
    //     'https://store.building-tech.org/uploads/large_montana_floating_villa_mohanad_albasha_maldives_01_07463efcc8.jpg',
    //     'https://tabairarealestate.com/media/images/properties/thumbnails/o_1dkvc4o1o46p183bfias4gfk01j_w_1024x800.jpg'
    // ];
    const [indexImg, indexImgSet] = React.useState(0);
    const [countPeople, setCountPeople] = React.useState('');
    const handleChangeCountPeople = (event: SelectChangeEvent) => {
        setCountPeople(event.target.value);
    };
    const [dateArrival, setDateArrival] = React.useState<Dayjs | null>(null);
    const [dateDeparture, setDateDeparture] = React.useState<Dayjs | null>(null);
    const [srcFirst, srcFirstSet] = React.useState('');
    const [srcSecond, srcSecondSet] = React.useState('');

    const setImages = (index : number)=>{
        if(listImages.length == 0) return
        // console.log(index, (index+1)%listImages.length);
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
                <CarouselImg src={listImages.length==0?blankImage:(server + srcFirst)} alt="" 
                style={{borderTopLeftRadius: '15px'}}/>
                <CarouselImg src={listImages.length==0?blankImage:(server + srcSecond)} alt="" 
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
                    <BookingBtn>
                        Забронировать
                    </BookingBtn>
                </BookingBox>
            </ContentBox>
        </MainBox>
    )
}