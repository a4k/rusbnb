import * as React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import {Typography} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import BgAvatar from './BgAvatar';
import { blankAvatar } from './Images';
import Avatar from '@mui/material/Avatar';

const FooterAvatar = styled(Avatar)({

})

export default function Footer(){
    const isLogin = localStorage.getItem('isLogin') || '';
    const username = localStorage.getItem('username') || '';
    const userId = localStorage.getItem('userId') || '';
    return (
    <Box sx={{backgroundColor: '#F5F5F5', height: '4rem', width: '100%', position: 'fixed', bottom: '0',
    borderTop: '1px solid gray', display: 'flex'}}>
        <SearchIcon/>
        <HomeOutlinedIcon/>
        {
            (isLogin==='true')?
            (
            <FooterAvatar alt={username}  sx={{background: BgAvatar(username)}}>{username[0].toUpperCase()}</FooterAvatar>
            ):
            (
            <FooterAvatar alt="" src={blankAvatar}/>)
        }
    </Box>)
}