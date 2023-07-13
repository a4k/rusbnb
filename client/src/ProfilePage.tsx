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

const MainBox = styled(Box)({
    width: '82vw', marginLeft: '9vw', marginTop: '5vh',
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
    alignItems: 'center'
}),
InfoBox = styled(Box)({
    textAlign: 'center'
})

const navStates = {
    rentout: 0,
    messenger: 1,
    myRentout: 2,
    reviews: 3,
    data: 4
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
    
    const [reviewRate, setReviewRate] = React.useState(1);
    const [hrate, setHR] = React.useState(0);
    const {userId} = useParams();
    const [user, setUser] = React.useState({
        id: 0,
        username: ''
    });
    const [navState, setNavSt] = React.useState(navStates.data);
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
                <NaxItem key={navStates.messenger}  onClick={()=>{setNavSt(navStates.messenger)}}>Сообщения</NaxItem>
                <NaxItem key={navStates.myRentout} onClick={()=>{setNavSt(navStates.myRentout)}}>Объекты</NaxItem>
                <NaxItem key={navStates.reviews} onClick={()=>{setNavSt(navStates.reviews)}}>Отзывы</NaxItem>
                <NaxItem key={navStates.data} onClick={()=>{setNavSt(navStates.data)}}>Данные</NaxItem>
                {userId==String(user.id)?<NaxItem key={1} style={{padding: '1.5em 0'}} onClick={()=>{window.location.href='/rentout'}}>Разместить объект</NaxItem>:
                <></>
                }
                
            </NavBox>
            <ContentBox sx={{display: navState===navStates.data?'flex':'none'}}>
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
            <ContentBox sx={{display: navState===navStates.rentout?'flex':'none', justifyContent: 'flex-start', padding: '1em 0'}}>
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
            <ContentBox sx={{display: navState===navStates.myRentout?'flex':'none', justifyContent: 'flex-start', padding: '1em 0'}}>
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
        </MainBox>
    )
}