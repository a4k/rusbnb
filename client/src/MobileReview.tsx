import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { Grid, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { toast } from 'react-toastify';
import BgAvatar from './BgAvatar';

const ShortText = styled(Typography)({
    height: '20vh', overflow: 'scroll', textOverflow: 'ellipsis', overflowX: 'hidden', '&::-webkit-scrollbar':{ display: 'none'}
}),
FullText = styled(Typography)({
    height: 'auto',
    marginBottom: '2vh'
}),
ShortReview = styled(Box)({
    minWidth: '90vw', height: '25vh', marginRight: '10%',
    background: 'white',
    borderRadius: '20px',
    padding: '1rem',
    overflow: 'hidden',
    transition: '0.3s',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px'
}),
FullReview = styled(Grid)({
    width: '100%'
});

type ReviewParams = {
    userId: number,
    rate: number,
    text: string,
    short: boolean,
    roomId?: number,
}

export default function Review(props: ReviewParams){
    const [user, setUser] = React.useState({
        id: 0,
        username: ''
    })
    const [room, setRoom] = React.useState(
        {description: '', id: 0, price: 0, rate: 0, subtitle: '', title: ''}
    );
    React.useEffect(()=>{
        axios.get('/user/'+props.userId)
        .then(res=>{
            setUser(res.data);
            })
        .catch((error) => {
            if(!error.response) toast.error(`Ошибка на сервере. `+error);
            if (error.response!.status === 404){
                toast.error(`Пользователь не найден `);
            }
            else
            toast.error(`Ошибка на сервере. `+error);
            });

        if(props.roomId){
            axios.get('/rooms/'+props.roomId)
            .then(res=>{
                setRoom(res.data);
                })
            .catch((error) => {
                
            });
        }
    }, [])
    return (
        <>
        {(props.short)?(
            <ShortReview>
                <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: '1vh'}}>
                    <a href={"/profile/" + String(props.userId)} style={{textDecoration: 'none'}}><Avatar sx={{width: '5vh', height: '5vh',
                background: BgAvatar(user.username)}}>
                        {user.username?(user.username[0].toUpperCase()):''}
                        </Avatar></a>
                    <Box sx={{display: 'inline-flex', flexFlow: 'column'}}>
                    <Typography sx={{marginLeft: '1rem', textOverflow: 'ellipsis'}}>{user.username}</Typography>
                    {props.roomId?
                    (
                        <a style={{marginLeft: '1rem', textOverflow: 'ellipsis', fontWeight: 'bold', textDecoration: 'none', color: 'black'}} href={`/details/${props.roomId}`}>{room.title}</a>
                    ):<></>    
                }
                    </Box>
                </Box>
                <Typography sx={{fontSize: '1.5rem'}}>&#9733; {props.rate}</Typography>
                <ShortText>{props.text}</ShortText>
            </ShortReview>
        ):(
            <FullReview item>
                <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: '1vh'}}>
                <a href={"/profile/" + String(props.userId)} style={{textDecoration: 'none'}}><Avatar sx={{width: '5vh', height: '5vh'}}>
                        {user.username?(user.username[0].toUpperCase()):''}
                        </Avatar></a>
                    <Typography sx={{marginLeft: '1rem', textOverflow: 'ellipsis'}}>{user.username}</Typography>
                </Box>
                <Typography sx={{fontSize: '1.5rem'}}>&#9733; {props.rate}</Typography>
                <FullText>{props.text}</FullText>
            </FullReview>
        )}
    </>
    )
}