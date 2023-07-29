import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import BgAvatar from './BgAvatar';
import Card from './MobileCard';
import { blankImage } from './Images';
import Skeleton from '@mui/material/Skeleton';
import { ReviewsBlock } from './ReviewsBlock';
import Review from './Review';
import { Grid, TextField  } from '@mui/material';
import { MuiTelInput } from 'mui-tel-input'
import {Room} from './Types'
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
// import io from 'socket.io-client';
import Autocomplete from '@mui/material/Autocomplete';
import { countries } from './CitiesData';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Footer from './MobileFooter';
import {capitalize, validateEmail} from './Functions';
import {setTitle, titles} from './Functions';

const CardsBlock = styled(Box)({
    display: 'flex', width: '100%', margin: '0 auto', flexDirection: 'column', marginTop: '1rem'
});

const MainBox = styled(Box)({
    width: '88vw', margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
}),
BigAvatar = styled(Avatar)({
    width: '20vh', height: '20vh', fontSize: '10vh'
}),
UsernameTypo = styled(Typography)({
    marginTop: '3vh', fontSize: '2rem'
}),
LogoutButton = styled(Button)({ color: 'white', minWidth: '80%', marginTop: '5rem',
backgroundColor: 'rgb(95,71,135)',
background: 'linear-gradient(333deg, rgba(95,71,135,1) 0%, rgba(82,97,148,1) 100%)',
}),
NavBox = styled('ul')({
    margin: '0',
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: '100px',
    gap: '1.2rem',
    padding: '2em 0',
    minWidth: '150px',
    alignItems: 'center'
}),
NaxItem = styled('li')({
    borderRadius: '10px',
    backgroundColor: '#8EC5FC',
    backgroundImage: 'linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)',
    width: '90%',
    fontSize: '1.5rem',
    textAlign: 'center',
    wordWrap: 'break-word',
    padding: '0.5rem 0',
    color: 'white',
    cursor: 'pointer',
    '&:hover': {
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 30px 90px'
    },
    transition: '0.3s'
}),
ContentBox = styled(Box)({
    marginTop: '0',
    display: 'flex',
    flexFlow: 'column',
    width: '100%',
    backgroundColor: '#D9D9D9',
    minHeight: '75vh',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: '20px', height: '80vh', 
    '&::-webkit-scrollbar': {display: 'none'}, overflowY: 'auto'
}),
InfoBox = styled(Box)({
    textAlign: 'center'
}),
UnactiveButton = styled(Button)({width: '50%', fontSize: '1.1rem', height: '2.3rem', backgroundColor: '#DAEBFB',
borderRadius: '0',transition: '.3s', color: '#3191E0', '&:hover':{
    backgroundColor: '#ADD7FF'
}}),
ActiveButton = styled(Button)({
    width: '50%', fontSize: '1.1rem', height: '2.3rem', backgroundColor: '#83BCF1', '&:hover':{
        backgroundColor: '#83BCF1'
    },
borderRadius: '0', color: '#DAEBFB'
}),
ChangeDataTF = styled(TextField)({
    width: '80%', backgroundColor: 'white', borderRadius: '5px'
}),
ChangeDataGI = styled(Grid)({
    width: '50%', minWidth: '100px',
    margin: '1em 0'
})

const navStates = {
    rentout: 0,
    messenger: 1,
    myRentout: 2,
    reviews: 3,
    changeData: 4,
    profile: 5
};

type Book = {
    date_from: string,
    date_to: string,
    id: number,
    user_id: number,
    room_id: number
}

// const socket = io();
// socket.on('connect',  ()=>{
//     console.log('КОННЕКТ');
// })
// socket.on('response', (response)=>{
//     console.log(response)
// });


/**
 * Страница профиля для мобильных устройств
 */
export default function MobileProfilePage(){

    const navigate = useNavigate();
    const [phone, setPhone] = React.useState('');
    const phoneChange = (newPhone : string) => {
        setPhone(newPhone)
      }
    const [reviewRate, setReviewRate] = React.useState(1);
    const [hrate, setHR] = React.useState(0);
    const {userId} = useParams();
    const [leftReviews, setLReviews] = React.useState(true);
    const [user, setUser] = React.useState({
        id: 0,
        username: ''
    });
    const [navState, setNavSt] = React.useState(navStates.profile);
    const isLogin = localStorage.getItem('isLogin') || '';
    const id = localStorage.getItem('userId') || '';
    const [rooms, setRooms] = React.useState(Array<Room>);
    const [requestRentoutRooms, setRequestRentoutRooms] = React.useState(false);
    const [bookedRooms, setBookedRooms] = React.useState(Array<Book>);
    const [requestBookedRooms, setRequestBookedRooms] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [name, setName] = React.useState('');
    const [surname, setSName] = React.useState('');
    const [region, setRegion] = React.useState('');
    const [country, setCountry] = React.useState('');
    const [city, setCity] = React.useState('');
    const [showNavbar, setShowNav] = React.useState(false); 
    React.useEffect(()=>{
        axios.get('/user/'+userId)
        .then(res=>{
            setUser(res.data);
            setTitle(titles.profile(res.data.username));
            })
        .catch((error) => {
            if (error.response && error.response!.status === 404){
                toast.error(`Пользователь не найден `);
            }
            else
            toast.error(`Ошибка на сервере. `+error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
            });
}, []);

    /**
     * Загружает бронь юзера
     */
    const loadBook = ()=>{
        if(!requestBookedRooms)
        axios.get(`/book/user/${userId}`
        )
        .then(res=>{
               setBookedRooms(res.data.books);
               setRequestBookedRooms(true);
            })
        .catch((error) => {
            setRequestBookedRooms(true);
            });
    }

    /**
     * Загружает жилье, которое сдаёт юзер
     * НЕ РЕАЛИЗОВАНО
     */
    const LoadRentout = ()=>{
        if(!requestRentoutRooms)
        axios.get('/rooms?offset=0&size=12'
        )
        .then(res=>{
                setRooms(res.data.rooms);
                setRequestRentoutRooms(true);
            })
        .catch((error) => {
            setRequestRentoutRooms(true);
            });
    }

    return (
        <>
        <MainBox>
                <SwipeableDrawer
                anchor={'top'}
                open={showNavbar}
                onClose={()=>setShowNav(false)}
                onOpen={()=>{}}
            >
            <NavBox>
                {userId==id?<>
                    <NaxItem key={navStates.rentout} onClick={()=>{loadBook(); setNavSt(navStates.rentout); setShowNav(false)}}>Бронь</NaxItem>
                    {/* <NaxItem key={navStates.messenger} onClick={()=>{setNavSt(navStates.messenger); setShowNav(false)}}>Сообщения</NaxItem> */}
                    </>:
                    <></>
                }
                {/* <NaxItem key={navStates.myRentout} onClick={()=>{LoadRentout(); setNavSt(navStates.myRentout); setShowNav(false)}}>Объекты</NaxItem> */}
                {/* <NaxItem key={navStates.reviews} onClick={()=>{setNavSt(navStates.reviews); setShowNav(false)}}>Отзывы</NaxItem> */}
                <NaxItem key={navStates.profile} onClick={()=>{setNavSt(navStates.profile); setShowNav(false)}}>Профиль</NaxItem>
                {userId==id?<>
                    {/* <NaxItem key={navStates.changeData} onClick={()=>{setNavSt(navStates.changeData); setShowNav(false)}}>Изменить</NaxItem> */}
                    <NaxItem key={'1-1'} style={{padding: '1.5em 0'}} onClick={()=>{navigate('/rentout')}}>Сдать жильё</NaxItem></>:
                <></>
            }
                <NaxItem key='close' onClick={()=>{setShowNav(false)}}><Button sx={{color: 'white'}}><CloseIcon/></Button></NaxItem>
                
            </NavBox>
          </SwipeableDrawer>
          <Button onClick={()=>{setShowNav(true)}} variant="contained" sx={{width: '100%',
        backgroundColor: '#8BC6EC',
        backgroundImage: 'linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)', margin: '0.5rem auto'
        }}><MenuIcon/></Button>
            <ContentBox sx={{display: navState===navStates.profile?'flex':'none'}}>
                        <InfoBox>
                            {
                                user.username?
                                <><BigAvatar alt={user.username?(user.username[0].toUpperCase()):''}
                                sx={{background: BgAvatar(user.username)}}>{user.username[0].toUpperCase()}</BigAvatar>
                                <UsernameTypo>{user.username}</UsernameTypo></>:
                                <><Skeleton variant="circular" sx={{width: '20vh', height: '20vh'}} />
                                <Skeleton sx={{width: '20vh', height: '4rem', marginTop: '3vh'}} />
                                </>
                            }
                            
                        </InfoBox>
                    
                        <Box sx={{ display: 'none'
                    //         backgroundColor: 'white', width: '30%', minWidth: '200px', height: '3em',
                    // display: 'flex', justifyContent: 'space-evenly', padding: '1em 2em', boxSizing: 'content-box',
                    // borderRadius: '50px', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
                    }}>
                            {
                                // [1,2,3,4,5].map(v=>(
                                //     <a onClick={()=>{/*setReviewRate(v)*/}} style={{cursor: 'pointer', userSelect: 'none'}}
                                //     onMouseOver={()=>{/*setHR(v)*/}}
                                //     onMouseLeave={()=>{/*setHR(0)*/}}
                                //     >{(v<=reviewRate && hrate==0) || v <= hrate?(<StarIcon style={{fontSize: '3em'}}/>):(<StarIcon style={{color: '#D9D9D9',fontSize: '3em'}}/>)}
                                //     </a>
                                // ))
                            }
                        </Box>
                        
                        {
                            (isLogin=='true'&&id == String(userId))?(
                                <LogoutButton variant="contained" href="/login" onClick={()=>{
                                    localStorage.setItem('isLogin', 'false');
                                    localStorage.setItem('username', '');
                                    localStorage.setItem('password', '');
                                    localStorage.setItem('userId', '');
                                }}>Выйти</LogoutButton>
                            ):(
                                <></>
                            )
                        }
            </ContentBox>
            <CardsBlock sx={{ justifyContent: 'space-evenly', display: navState===navStates.rentout?'flex':'none', padding: '1em 0'}}>
                {
                !requestBookedRooms?(
                    <>
            {Array(6).fill(0).map((_, index)=>(
                            <Card 
                            imgSrc={''}
                            cost={0}
                            title={''} 
                            subtitle={''}
                            id={0}
                            skeleton={true}
                            rate={0}
                            key={`${index}-load`}
                            />
                        ))}
                        </>
                ):
                (bookedRooms.map((room : Book)=>(
                    <Card 
                    imgSrc={''}
                    cost={0}
                    title={''} 
                    subtitle={''}
                    id={room.room_id}
                    rate={0}
                    dateArrival={dayjs(room.date_from, 'DD/MM/YYYY')}
                    dateDeparture={dayjs(room.date_to, 'DD/MM/YYYY')}
                    key={room.id}
                    bookId={room.id}
                    />
                )))}
            </CardsBlock>
            <ContentBox sx={{display: navState===navStates.myRentout?'flex':'none', justifyContent: 'flex-start', padding: '1em 0'}}>
                <CardsBlock>
                    {
                    !requestRentoutRooms?(
                        <>
                            {Array(6).fill(0).map((_, index)=>(
                                    <Card 
                                    imgSrc={''}
                                    cost={0}
                                    title={''} 
                                    subtitle={''}
                                    id={0}
                                    skeleton={true}
                                    key={`${index}-load`}
                                    rate={0}
                                    />
                            ))}
                        </>
                    ):
                    (rooms.map(room=>(
                        <Card 
                        imgSrc={room["primary-image"] || blankImage}
                        cost={room.price}
                        title={room.title} 
                        subtitle={room.subtitle}
                        id={room.id}
                        rate={room.rate}
                        key={room.id}
                        />
                    )))}
                </CardsBlock>
            </ContentBox>
            <ContentBox sx={{display: navState===navStates.reviews?'flex':'none', justifyContent: 'flex-start',
                backgroundColor: '#83BCF1'}}>
                        <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-evenly', height: '3rem'}}>
                            {
                                leftReviews?
                                <>
                                <ActiveButton>Оставленные</ActiveButton>
                                <UnactiveButton onClick={()=>{setLReviews(false)}}>Полученные</UnactiveButton>
                                </>:
                                <>
                                <UnactiveButton onClick={()=>{setLReviews(true)}}>Оставленные</UnactiveButton>
                                <ActiveButton>Полученные</ActiveButton>
                                </>
                            }
                        </Box>
                        <ReviewsBlock sx={{padding: '0 1em', width: '100%', 
            '&::-webkit-scrollbar': {display: 'none'}, overflowY: 'auto'}}>
                            {
                                leftReviews?(
                                    <Review
                            userId={1}
                            rate={4}
                            text={'Оставленный хайп'}
                            short={true}
                            roomId={1}
                            key={1}
                            />
                                ):(
                                    <Review
                            userId={1}
                            rate={4}
                            text={'Полученный хайп'}
                            short={true}
                            roomId={1}
                            />
                                )
                            }
                            
                </ReviewsBlock>
            </ContentBox>
            
            <ContentBox sx={{display: navState===navStates.changeData?'flex':'none', justifyContent: 'flex-start', padding: '1em'}}>
                <Grid container sx={{width:'100%'}}>
                    <ChangeDataGI item>
                        <Typography>Имя</Typography>
                        <ChangeDataTF
                        placeholder='Имя'
                        value={name}
                        onChange={e=>setName(capitalize(e.target.value))}
                        />
                    </ChangeDataGI>
                    <ChangeDataGI item>
                        <Typography>Фамилия</Typography>
                        <ChangeDataTF
                        placeholder='Фамилия'
                        value={surname}
                        onChange={e=>setSName(capitalize(e.target.value))}
                        />
                    </ChangeDataGI>
                    <ChangeDataGI item>
                        <Typography>Страна</Typography>
                        <Autocomplete
                onChange={(e, v)=>{setCountry(String(v))}}
                disablePortal
                id="combo-box-demo"
                options={countries}
                sx={{ width: '80%', height: '70%', backgroundColor: 'white', borderRadius: '5px' }}
                renderInput={(params) => <TextField {...params} placeholder='Страна'
                error={country==''}
                sx={{ width: '100%', height: '100%'}} size="medium"/>}
            />
                    </ChangeDataGI>
                    <ChangeDataGI item>
                        <Typography>Регион, штат</Typography>
                        <ChangeDataTF
                        placeholder='Регион, штат'
                        value={region}
                        onChange={e=>setRegion(capitalize(e.target.value))}
                        />
                    </ChangeDataGI>
                    <ChangeDataGI item>
                        <Typography>Город</Typography>
                        <ChangeDataTF
                        placeholder='Город'
                        value={city}
                        onChange={e=>setCity(capitalize(e.target.value))}
                        />
                    </ChangeDataGI>
                    <ChangeDataGI item>
                        <Typography>Телефон</Typography>
                        <MuiTelInput value={phone} onChange={phoneChange} sx={{width: '80%', backgroundColor: 'white',
                    borderRadius: '5px'}}/>
                    </ChangeDataGI>
                    <ChangeDataGI item>
                        <Typography>Email</Typography>
                        <ChangeDataTF
                        placeholder='Email'
                        type='email'
                        value={email}
                        error={validateEmail(email) == null && email != ''}
                        onChange={e=>{setEmail(e.target.value);}}
                        />
                    </ChangeDataGI>

                    <ChangeDataGI item sx={{height: '3rem', marginTop: '3em'}}>
                        <Button sx={{width: '80%', height: '3em'}} variant='contained'>Сохранить</Button>
                    </ChangeDataGI>
                </Grid>
            </ContentBox>
        </MainBox>
        <Footer/>
        </>
    )
}