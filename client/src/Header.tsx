import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Cookies from 'universal-cookie';

export default function Header(){
    const isLogin = localStorage.getItem('isLogin') || '';
    const username = localStorage.getItem('username') || '';
    const userId = localStorage.getItem('userId') || '';
    // console.log(cookies.getAll())
    return (
        <Box sx={{backgroundColor: '#EEEEEE', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        height: '8vh', gap: '40vw', borderBottom: '2px #E1E1E1 solid'}}>
                <Box sx={{display: 'flex', flexDirection: 'row', width: '20vw', justifyContent: 'flex-start', alignItems: 'center', height: '5vh',
            marginLeft: '12vw'}}>
                    <HomeOutlinedIcon fontSize='large'/>
                    <Link href="/" underline='none' color={'black'} fontWeight={'bold'} marginLeft={'0.8vw'} fontSize={'1rem'}>RusBnB</Link>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'row', width: '30vw', justifyContent: 'flex-end', alignItems: 'center', height: '5vh',
            marginRight: '12vw'}}>
                
                    <Button variant="text" sx={{color: '#000000', textTransform: 'none',
                fontSize: '1rem', height: '100%', marginRight: '2.5vw'}}>Сдать жилье</Button>
                    {
                        (isLogin==='true')?
                        (<a href={'/profile/'+userId} style={{textDecoration: 'none'}}>
                        <Avatar alt={username}  sx={{width: '5vh', height: '5vh', backgroundColor: 'orange'}}>{username[0].toUpperCase()}</Avatar>
                        </a>):
                        (<a href='/login'>
                        <Avatar alt="" src="https://sun9-34.userapi.com/impg/CGIJgv5Q46g-B6awKhM0jS0QZ2fikV3EhHU1Vw/eZmriWePwwA.jpg?size=280x280&quality=96&sign=f88d3363968b8bc3de3678750c1a5bbf&type=album" sx={{width: '5vh', height: '5vh'}}/>
                        </a>)
                    }
                    
                </Box>
                
            </Box>
    )
}