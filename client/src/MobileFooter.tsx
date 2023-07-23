import * as React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import {Typography} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import BgAvatar from './BgAvatar';
import { blankAvatar } from './Images';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';

const FooterAvatar = styled(Avatar)({
    width: '2rem',
    height: '2rem',
    fontSize: '1rem'
}),
Typo = styled(Typography)({
    textAlign: 'center',
    fontSize: '0.7rem'
}),
ElBox = styled(Box)({
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center',
    width: '30%'
})

export default function Footer(){
    const navigate = useNavigate();
    const isLogin = localStorage.getItem('isLogin') || '';
    const username = localStorage.getItem('username') || '';
    const userId = localStorage.getItem('userId') || '';
    return (
    <Box sx={{backgroundColor: '#F5F5F5', height: '4rem', width: '100%', position: 'fixed', bottom: '0',
    borderTop: '1px solid gray', display: 'flex', justifyContent: 'space-evenly'}}>
        <ElBox onClick={()=>{navigate('/'); window.scrollTo(0,0);}}>
            <SearchIcon sx={{fontSize: '2.1rem'}}/>
            <Typo>Поиск</Typo>
        </ElBox>
        <ElBox onClick={()=>{navigate(userId?'/rentout':'/login'); window.scrollTo(0,0);}}>
            <HomeOutlinedIcon sx={{fontSize: '2.1rem'}}/>
            <Typo>Сдать жилье</Typo>
        </ElBox>
        <ElBox onClick={()=>{navigate(userId?`/profile/${userId}`:'/login'); window.scrollTo(0,0);}}>
        {
            (isLogin==='true')?
            (
            <>
                <FooterAvatar alt={username}  sx={{background: BgAvatar(username)}}>{username[0].toUpperCase()}</FooterAvatar>
                <Typo>Профиль</Typo>
            </>
            ):
            (
            <>
                <FooterAvatar alt="" src={blankAvatar}/>
                <Typo>Войти</Typo>
            </>)
        }
        </ElBox>
        
    </Box>)
}