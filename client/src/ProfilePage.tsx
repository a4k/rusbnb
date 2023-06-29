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

const MainBox = styled(Box)({
    backgroundColor: 'white', width: '50vw', marginLeft: '25vw', minHeight: '30vh', marginTop: '5vh', padding: '2vh 2vw',
    borderRadius: '15px'
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

export default function ProfilePage(){
    const {userId} = useParams();
    const [user, setUser] = React.useState({
        id: 0,
        username: ''
    })
    const isLogin = localStorage.getItem('isLogin') || '';
    const id = localStorage.getItem('userId') || '';
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
    }, []);

    return (
        <MainBox>
            <BigAvatar alt={user.username?(user.username[0].toUpperCase()):''}>{user.username?(user.username[0].toUpperCase()):(<CircularProgress/>)}</BigAvatar>
            <UsernameTypo>{user.username}</UsernameTypo>
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
        </MainBox>
    )
}