import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import BgAvatar from './BgAvatar';
import StarIcon from '@mui/icons-material/Star';
import Card from './Card';
import {CardsBlock, CardsBlockItem} from './CardsBlock';
import { blankImage } from './Images';
import Skeleton from '@mui/material/Skeleton';
import { ReviewsBlock } from './ReviewsBlock';
import Review from './Review';
import { Grid, TextField  } from '@mui/material';
import { MuiTelInput } from 'mui-tel-input'

const MainBox = styled(Box)({
    width: '88vw', margin: '0 auto', marginTop: '5vh',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
}),
BigAvatar = styled(Avatar)({
    width: '20vh', height: '20vh', fontSize: '10vh'
}),
UsernameTypo = styled(Typography)({
    marginTop: '3vh', fontSize: '2rem'
}),
LogoutButton = styled(Button)({
    backgroundColor: 'blue', color: 'white', minWidth: '10vw', marginTop: '10vh'
}),
NavBox = styled('ul')({
    borderRadius: '10px',
    margin: '0',
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    width: '25%',
    backgroundColor: '#83BCF1',
    minHeight: '100px',
    gap: '2em',
    padding: '2em 0',
    minWidth: '150px',
    alignItems: 'center'
}),
NaxItem = styled('li')({
    borderRadius: '10px',
    background: '#DAEBFB',
    width: '80%',
    fontSize: '1.5rem',
    textAlign: 'center',
    wordWrap: 'break-word',
    padding: '0.5em 0',
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
    width: '70%',
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

type Room = {
    description : string,
    id: number,
    price: number,
    rate: number,
    subtitle: string,
    title: string,
    "primary-image": string
};


export default function ProfilePage(){
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
    React.useEffect(()=>{
        axios.get('/user/'+userId)
        .then(res=>{
            setUser(res.data);
            })
        .catch((error) => {
            if (error.response!.status === 404){
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
        axios.get('/rooms'
        )
        .then(res=>{
                setRooms(res.data.rooms);
            })
        .catch((error) => {
            toast.error(`Ошибка на сервере. `+error);
            });
    }, []);

    return (
        <MainBox>
            <NavBox>
                <NaxItem key={navStates.rentout} onClick={()=>{setNavSt(navStates.rentout);}}>Бронь</NaxItem>
                {userId==id?<>
                    <NaxItem key={navStates.messenger}  onClick={()=>{setNavSt(navStates.messenger)}}>Сообщения</NaxItem>
                    </>:
                    <></>
                }
                <NaxItem key={navStates.myRentout} onClick={()=>{setNavSt(navStates.myRentout)}}>Объекты</NaxItem>
                <NaxItem key={navStates.reviews} onClick={()=>{setNavSt(navStates.reviews)}}>Отзывы</NaxItem>
                <NaxItem key={navStates.profile} onClick={()=>{setNavSt(navStates.profile)}}>Профиль</NaxItem>
                {userId==id?<>
                    <NaxItem key={navStates.changeData} onClick={()=>{setNavSt(navStates.changeData)}}>Изменить</NaxItem>
                    <NaxItem key={1} style={{padding: '1.5em 0'}} onClick={()=>{window.location.href='/rentout'}}>Разместить объект</NaxItem></>:
                <></>
                }
                
            </NavBox>
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
                        <Box sx={{backgroundColor: 'white', width: '30%', minWidth: '200px', height: '3em',
                    display: 'flex', justifyContent: 'space-evenly', padding: '1em 2em', boxSizing: 'content-box',
                    borderRadius: '50px', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'}}>
                            {
                                [1,2,3,4,5].map(v=>(
                                    <a onClick={()=>{setReviewRate(v)}} style={{cursor: 'pointer', userSelect: 'none'}}
                                    onMouseOver={()=>{setHR(v)}}
                                    onMouseLeave={()=>{setHR(0)}}
                                    >{(v<=reviewRate && hrate==0) || v <= hrate?(<StarIcon style={{fontSize: '3em'}}/>):(<StarIcon style={{color: '#D9D9D9',fontSize: '3em'}}/>)}
                                    </a>
                                ))
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
            <ContentBox sx={{display: navState===navStates.rentout?'flex':'none', justifyContent: 'flex-start', padding: '1em 0',
        backgroundColor: '#83BCF1'}}>
                <CardsBlock container sx={{width: '100%'}}>
                    {
                    rooms.length==0?(<CircularProgress size={'5vw'} sx={{margin: 'auto'}}/>):
                    (rooms.map(room=>(
                    <CardsBlockItem item key={room.id}>
                        <Card 
                        imgSrc={room["primary-image"] || blankImage}
                        cost={room.price} rating={room.rate}
                        title={room.title} 
                        subtitle={room.subtitle}
                        id={room.id}
                        />
                    </CardsBlockItem>
                    )))}
                </CardsBlock>
            </ContentBox>
            <ContentBox sx={{display: navState===navStates.myRentout?'flex':'none', justifyContent: 'flex-start', padding: '1em 0',
        backgroundColor: '#83BCF1'}}>
                <CardsBlock container sx={{width: '100%'}}>
                    {
                    rooms.length==0?(<CircularProgress size={'5vw'} sx={{margin: 'auto'}}/>):
                    (rooms.map(room=>(
                    <CardsBlockItem item key={room.id}>
                        <Card 
                        imgSrc={room["primary-image"] || blankImage}
                        cost={room.price} rating={room.rate}
                        title={room.title} 
                        subtitle={room.subtitle}
                        id={room.id}
                        />
                    </CardsBlockItem>
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
                    userId={2}
                    rate={4}
                    text={'Оставленный хайп'}
                    short={true}
                    roomId={1}
                    />
                        ):(
                            <Review
                    userId={2}
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
                        />
                    </ChangeDataGI>
                    <ChangeDataGI item>
                        <Typography>Фамилия</Typography>
                        <ChangeDataTF
                        placeholder='Фамилия'
                        />
                    </ChangeDataGI>
                    <ChangeDataGI item>
                        <Typography>Страна</Typography>
                        <ChangeDataTF
                        placeholder='Страна'
                        />
                    </ChangeDataGI>
                    <ChangeDataGI item>
                        <Typography>Регион, штат</Typography>
                        <ChangeDataTF
                        placeholder='Регион, штат'
                        />
                    </ChangeDataGI>
                    <ChangeDataGI item>
                        <Typography>Город</Typography>
                        <ChangeDataTF
                        placeholder='Город'
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
                        />
                    </ChangeDataGI>

                    <ChangeDataGI item sx={{height: '3rem', marginTop: '3em'}}>
                        <Button sx={{width: '80%', height: '3em'}} variant='contained'>Сохранить</Button>
                    </ChangeDataGI>
                </Grid>
            </ContentBox>
        </MainBox>
    )
}