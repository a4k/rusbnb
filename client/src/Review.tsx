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
ShortReview = styled(Grid)({
    width: '40%', minHeight: '30vh', marginRight: '10%'
}),
FullReview = styled(Grid)({
    width: '100%'
});

type ReviewParams = {
    userId: number,
    rate: number,
    text: string,
    short: boolean
}

export default function Review(props: ReviewParams){
    const [user, setUser] = React.useState({
        id: 0,
        username: ''
    })
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
    }, [])
    return (
        <>
        {(props.short)?(
            <ShortReview item>
                <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: '1vh'}}>
                    <a href={"/profile/" + String(props.userId)} style={{textDecoration: 'none'}}><Avatar sx={{width: '5vh', height: '5vh',
                background: BgAvatar(user.username)}}>
                        {user.username?(user.username[0].toUpperCase()):''}
                        </Avatar></a>
                    <Typography sx={{marginLeft: '1rem', textOverflow: 'ellipsis'}}>{user.username}</Typography>
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