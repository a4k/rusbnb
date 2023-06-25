import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

const MainBox = styled(Box)({
    backgroundColor: 'white', width: '50vw', marginLeft: '25vw', minHeight: '30vh', marginTop: '5vh', padding: '2vh 2vw'
}),
BigAvatar = styled(Avatar)({
    width: '20vh', height: '20vh', backgroundColor: 'orange', fontSize: '10vh'
}),
UsernameTypo = styled(Typography)({
    marginTop: '3vh', fontSize: '2rem'
}),
LogoutButton = styled(Button)({
    backgroundColor: 'blue', color: 'white', minWidth: '10vw', marginTop: '10vh'
})

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
        <MainBox>
            <BigAvatar alt={user.username?(user.username[0].toUpperCase()):''}>{user.username?(user.username[0].toUpperCase()):''}</BigAvatar>
            <UsernameTypo>{user.username}</UsernameTypo>
            {
                (isLogin=='true'&&id == String(userId))?(
                    <LogoutButton variant="contained" href="/login">Выйти</LogoutButton>
                ):(
                    <></>
                )
            }
        </MainBox>
    )
}