import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Header from './Header';
import SearchBlock from './SearchBlock';
import { styled } from '@mui/system';

const MainContent = styled(Box)({
    display: 'flex', flexDirection: 'row', width: '76vw', marginLeft: '12vw', marginTop: '5vh'
})

export default function MainPage (){
    return (
        <>
            <Header />
            <SearchBlock />
            <MainContent>
                <Typography variant="h4" component="h1" gutterBottom>
                    Material UI Create React App example in TypeScript
                </Typography>
            </MainContent>
        </>
    )
}