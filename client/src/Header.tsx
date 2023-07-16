import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BgAvatar from './BgAvatar';
import { blankAvatar } from './Images';
import { styled } from '@mui/system';

const MainBox = styled(Box)({
    backgroundColor: '#EEEEEE', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: '8vh', gap: '40vw', borderBottom: '2px #E1E1E1 solid', minHeight: '80px'
}),
IconBox = styled(Box)({
    display: 'flex', flexDirection: 'row', width: '20vw', justifyContent: 'flex-start', alignItems: 'center', height: '5vh', marginLeft: '12vw'
}),
UserBox = styled(Box)({
    display: 'flex', flexDirection: 'row', width: '30vw', justifyContent: 'flex-end', alignItems: 'center', height: '5vh', marginRight: '12vw'
}),
RentOutButton = styled(Button)({
    color: '#000000', textTransform: 'none', fontSize: '1rem', height: '100%', marginRight: '2.5vw'
})

export default function Header(){
    const isLogin = localStorage.getItem('isLogin') || '';
    const username = localStorage.getItem('username') || '';
    const userId = localStorage.getItem('userId') || '';
    return (
        <MainBox>
                <IconBox>
                    <HomeOutlinedIcon fontSize='large'/>
                    <Link href="/" underline='none' color={'black'} fontWeight={'bold'} marginLeft={'0.8vw'} fontSize={'1rem'}>RusBnB</Link>
                </IconBox>
                <UserBox>
                
                    <RentOutButton variant="text" href={isLogin==='true'?("/rentout"):("/login")}>Сдать жилье</RentOutButton>
                    {
                        (isLogin==='true')?
                        (<a href={'/profile/'+userId} style={{textDecoration: 'none'}}>
                        <Avatar alt={username}  sx={{width: '2.5em', height: '2.5em', background: BgAvatar(username)}}>{username[0].toUpperCase()}</Avatar>
                        </a>):
                        (<a href='/login'>
                        <Avatar alt="" src={blankAvatar} sx={{width: '2.5em', height: '2.5em'}}/>
                        </a>)
                    }
                    
                </UserBox>
                
            </MainBox>
    )
}