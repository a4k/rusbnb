import * as React from 'react';
import Box from '@mui/material/Box';
import Header from './Header';
import Filter from './Filter';
import SearchBlock from './SearchBlock';
import Card from './Card';
import {CardsBlock, CardsBlockItem} from './CardsBlock';
import { styled } from '@mui/system';
import axios from 'axios';
import useId from '@mui/material/utils/useId';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

const server = 'http://rusbnb-1.exp-of-betrayal.repl.co'

export default function ProfilePage(){
    const {userId} = useParams();
    const [user, setUser] = React.useState({
        id: 0,
        username: ''
    })
    const isLogin = localStorage.getItem('isLogin') || '';
    const id = localStorage.getItem('userId') || '';
    if(user.username == ''){
        axios.get(server+'/user/'+userId)
        .then(res=>{
            setUser(res.data);
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
    }

    return (
        <Box sx={{backgroundColor: 'white', width: '50vw', marginLeft: '25vw', minHeight: '30vh', marginTop: '5vh', padding: '2vh 2vw'}}>
            <Avatar alt={user.username?(user.username[0].toUpperCase()):''}  sx={{width: '20vh', height: '20vh', backgroundColor: 'orange', fontSize: '10vh'}}>{user.username?(user.username[0].toUpperCase()):''}</Avatar>
            <Typography style={{marginTop: '3vh', fontSize: '2rem'}}>{user.username}</Typography>
            {
                (isLogin=='true'&&id == String(userId))?(
                    <Button sx={{backgroundColor: 'blue', color: 'white', minWidth: '10vw', marginTop: '10vh'}} variant="contained" href="/login">Выйти</Button>
                ):(
                    <></>
                )
            }
        </Box>
    )
}